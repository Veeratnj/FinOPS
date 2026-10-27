"""
① TerraformInventoryAgent (Read-Only)
Parses .tf infrastructure files and/or tfplan.json to build a structured resource inventory.
"""

from __future__ import annotations

import json
import os
from typing import Any, Dict, List
import hcl2
from Agents.state import FinOpsState, ResourceInventoryItem


def parse_hcl_content(filename: str, content: str) -> List[ResourceInventoryItem]:
    """Parses HCL string content into normalized ResourceInventoryItem objects."""
    items: List[ResourceInventoryItem] = []
    try:
        parsed = hcl2.loads(content)
    except Exception:
        # Fallback line-by-line parser for simple .tf blocks if hcl2 raises
        return _fallback_hcl_parser(filename, content)

    # In hcl2, parsed is a dict: {"resource": [{"aws_instance": {"web": {...}}}]}
    resource_list = parsed.get("resource", [])
    for res_entry in resource_list:
        for res_type, instances in res_entry.items():
            for res_name, attrs in instances.items():
                size = ""
                if "instance_type" in attrs:
                    size = attrs["instance_type"]
                elif "size" in attrs:
                    size = f"{attrs['size']}GB"
                elif "allocated_storage" in attrs:
                    size = f"{attrs['allocated_storage']}GB"
                elif "node_type" in attrs:
                    size = attrs["node_type"]
                else:
                    size = attrs.get("type", "standard")

                tags = attrs.get("tags", {})
                if isinstance(tags, list):
                    # Sometimes hcl2 parses tags as list of dicts
                    tag_dict = {}
                    for t in tags:
                        if isinstance(t, dict):
                            tag_dict.update(t)
                    tags = tag_dict

                provider = "aws"
                if res_type.startswith("google_"):
                    provider = "gcp"
                elif res_type.startswith("azurerm_"):
                    provider = "azure"

                items.append(
                    ResourceInventoryItem(
                        resource_id=f"{res_type}.{res_name}",
                        resource_name=res_name,
                        resource_type=res_type,
                        provider=provider,
                        region=attrs.get("availability_zone", "us-east-1"),
                        current_size=str(size),
                        tags=tags if isinstance(tags, dict) else {},
                        source_file=filename,
                        hcl_block=attrs,
                    )
                )
    return items


def _fallback_hcl_parser(filename: str, content: str) -> List[ResourceInventoryItem]:
    """Resilient fallback regex parser for HCL resources."""
    import re
    items = []
    resource_pattern = re.compile(
        r'resource\s+"([^"]+)"\s+"([^"]+)"\s*\{([^}]+)\}', re.DOTALL
    )
    for match in resource_pattern.finditer(content):
        res_type, res_name, body = match.groups()
        size_match = re.search(r'(?:instance_type|size|allocated_storage)\s*=\s*"([^"]+)"', body)
        size = size_match.group(1) if size_match else "standard"
        items.append(
            ResourceInventoryItem(
                resource_id=f"{res_type}.{res_name}",
                resource_name=res_name,
                resource_type=res_type,
                provider="aws" if res_type.startswith("aws_") else "gcp",
                region="us-east-1",
                current_size=size,
                source_file=filename,
            )
        )
    return items


def parse_tfplan_json(tfplan_data: Dict[str, Any]) -> List[ResourceInventoryItem]:
    """Parses terraform plan output in JSON format."""
    items: List[ResourceInventoryItem] = []
    planned_values = tfplan_data.get("planned_values", {}).get("root_module", {})
    resources = planned_values.get("resources", [])

    for r in resources:
        res_type = r.get("type", "unknown")
        res_name = r.get("name", "unknown")
        values = r.get("values", {})
        size = values.get("instance_type") or values.get("size") or values.get("allocated_storage") or "default"

        items.append(
            ResourceInventoryItem(
                resource_id=r.get("address", f"{res_type}.{res_name}"),
                resource_name=res_name,
                resource_type=res_type,
                provider=r.get("provider_name", "aws").split("/")[-1],
                region=values.get("availability_zone", "us-east-1"),
                current_size=str(size),
                tags=values.get("tags", {}),
                hcl_block=values,
            )
        )
    return items


def terraform_inventory_node(state: FinOpsState) -> Dict[str, Any]:
    """
    LangGraph Node: TerraformInventoryAgent (Read-Only).
    Discovers all infrastructure assets from Terraform definitions.
    """
    inventory_items: List[ResourceInventoryItem] = []

    # 1. Direct in-memory file strings
    if state.get("tf_files"):
        for filename, content in state["tf_files"].items():
            inventory_items.extend(parse_hcl_content(filename, content))

    # 2. Local directory of .tf files
    elif state.get("terraform_dir") and os.path.isdir(state["terraform_dir"]):
        for root, _, files in os.walk(state["terraform_dir"]):
            for file in files:
                if file.endswith(".tf"):
                    filepath = os.path.join(root, file)
                    with open(filepath, "r", encoding="utf-8") as f:
                        inventory_items.extend(parse_hcl_content(file, f.read()))

    # 3. Direct tfplan.json
    elif state.get("tfplan_json"):
        inventory_items.extend(parse_tfplan_json(state["tfplan_json"]))

    # Convert Pydantic models to dicts for LangGraph state serialization
    serialized_inventory = [item.model_dump() for item in inventory_items]

    return {
        "inventory": serialized_inventory,
        "current_node": "terraform_inventory",
        "audit_trail": [
            {
                "node": "terraform_inventory",
                "action": "inventory_collected",
                "resources_count": len(serialized_inventory),
            }
        ],
    }
