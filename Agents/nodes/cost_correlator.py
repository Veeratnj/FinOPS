"""
③ CostCorrelatorAgent (Read-Only)
Correlates CostLineItems with metrics to identify idle resources,
over-provisioned instances, legacy storage tiers, and idle GPUs.
"""

from __future__ import annotations

from typing import Any, Dict, List
from Agents.state import FinOpsState, WasteCandidate


# Typical cloud pricing reference table (monthly USD)
PRICING_CATALOG = {
    # Compute
    "t3.nano": 3.80,
    "t3.micro": 7.60,
    "t3.small": 15.20,
    "t3.medium": 30.40,
    "t3.large": 60.80,
    "t3.xlarge": 121.60,
    "t3.2xlarge": 243.20,
    "m5.large": 70.08,
    "m5.xlarge": 140.16,
    "m5.2xlarge": 280.32,
    "m5.4xlarge": 560.64,
    "c5.xlarge": 124.10,
    "c5.2xlarge": 248.20,
    "c5.4xlarge": 496.40,
    "g4dn.xlarge": 384.00,
    "g4dn.12xlarge": 2850.00,
    "p4d.24xlarge": 23900.00,
    # Storage per GB-mo
    "gp2": 0.10,
    "gp3": 0.08,
    "io1": 0.125,
    "standard": 0.05,
}


def estimate_monthly_cost(resource_type: str, current_size: str) -> float:
    """Estimates baseline monthly cost from size or type."""
    size = current_size.strip().lower()
    if size in PRICING_CATALOG:
        return PRICING_CATALOG[size]

    # Handle storage strings like "500GB gp2"
    if "gb" in size:
        parts = size.replace("gb", "").split()
        try:
            gb = float(parts[0])
            tier = parts[1] if len(parts) > 1 else "gp2"
            rate = PRICING_CATALOG.get(tier, 0.10)
            return round(gb * rate, 2)
        except Exception:
            return 50.00

    return 75.00


def cost_correlator_node(state: FinOpsState) -> Dict[str, Any]:
    """
    LangGraph Node: CostCorrelatorAgent (Read-Only).
    Detects financial waste by joining inventory with metrics.
    """
    inventory = state.get("inventory") or []
    metrics = {m["resource_id"]: m for m in (state.get("metrics") or [])}
    waste_candidates: List[WasteCandidate] = []

    for item in inventory:
        res_id = item.get("resource_id", "")
        res_type = item.get("resource_type", "")
        current_size = item.get("current_size", "")
        metric = metrics.get(res_id, {})
        monthly_cost = estimate_monthly_cost(res_type, current_size)

        avg_cpu = metric.get("avg_cpu_utilization_pct", 50.0)
        p95_cpu = metric.get("p95_cpu_utilization_pct", 60.0)
        gpu_util = metric.get("gpu_utilization_pct")
        disk_iops = metric.get("disk_iops", 100.0)

        # 1. Idle GPU
        if gpu_util is not None and gpu_util < 5.0:
            waste_candidates.append(
                WasteCandidate(
                    resource_id=res_id,
                    resource_type=res_type,
                    waste_type="IDLE_GPU",
                    severity="CRITICAL",
                    monthly_cost_usd=monthly_cost,
                    estimated_waste_usd=round(monthly_cost * 0.90, 2),
                    reason=f"GPU utilization is only {gpu_util}% (below 5% threshold) on costly accelerator node.",
                    metrics_summary=metric,
                )
            )

        # 2. Idle Instance (CPU P95 < 5%)
        elif p95_cpu < 5.0:
            waste_candidates.append(
                WasteCandidate(
                    resource_id=res_id,
                    resource_type=res_type,
                    waste_type="IDLE_INSTANCE",
                    severity="HIGH",
                    monthly_cost_usd=monthly_cost,
                    estimated_waste_usd=round(monthly_cost * 1.0, 2),
                    reason=f"P95 CPU is {p95_cpu}%. Instance is completely idle and should be stopped or decommissioned.",
                    metrics_summary=metric,
                )
            )

        # 3. Overprovisioned Compute (CPU P95 < 20% on multi-core instances)
        elif p95_cpu < 20.0 and ("4xlarge" in current_size or "2xlarge" in current_size or "xlarge" in current_size):
            downsized_cost = monthly_cost * 0.40  # ~60% savings
            waste_candidates.append(
                WasteCandidate(
                    resource_id=res_id,
                    resource_type=res_type,
                    waste_type="OVERPROVISIONED_COMPUTE",
                    severity="MEDIUM",
                    monthly_cost_usd=monthly_cost,
                    estimated_waste_usd=round(monthly_cost - downsized_cost, 2),
                    reason=f"P95 CPU is {p95_cpu}% on heavy instance '{current_size}'. Downsizing recommended.",
                    metrics_summary=metric,
                )
            )

        # 4. Legacy gp2 storage tier
        elif "gp2" in current_size.lower() or "aws_ebs_volume" in res_type:
            savings = monthly_cost * 0.20  # gp3 is 20% cheaper than gp2
            waste_candidates.append(
                WasteCandidate(
                    resource_id=res_id,
                    resource_type=res_type,
                    waste_type="LEGACY_STORAGE_TIER",
                    severity="LOW",
                    monthly_cost_usd=monthly_cost,
                    estimated_waste_usd=round(savings, 2),
                    reason="EBS Volume is provisioned on legacy gp2 tier. Migrating to gp3 saves 20% with higher baseline IOPS.",
                    metrics_summary=metric,
                )
            )

    serialized_waste = [w.model_dump() for w in waste_candidates]

    return {
        "waste_candidates": serialized_waste,
        "current_node": "cost_correlator",
        "audit_trail": [
            {
                "node": "cost_correlator",
                "action": "waste_analyzed",
                "waste_candidates_count": len(serialized_waste),
                "total_estimated_waste_usd": sum(w["estimated_waste_usd"] for w in serialized_waste),
            }
        ],
    }
