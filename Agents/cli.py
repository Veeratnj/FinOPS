"""
Command Line Interface for FinOps Multi-Agent System.
Allows running the graph directly against directories of Terraform files or plans.
"""

from __future__ import annotations

import argparse
import json
import os
import sys

# Configure UTF-8 streams
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if sys.stderr and hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# Ensure workspace root is on path
current_dir = os.path.dirname(os.path.abspath(__file__))
workspace_root = os.path.abspath(os.path.join(current_dir, ".."))
if workspace_root not in sys.path:
    sys.path.insert(0, workspace_root)

from langgraph.types import Command
from Agents.graph import create_finops_graph
from Agents.state import FinOpsState


def parse_args():
    parser = argparse.ArgumentParser(description="FinOps Autonomous Multi-Agent CLI (LangGraph)")
    parser.add_argument("--tf-dir", type=str, help="Directory containing .tf files", default=None)
    parser.add_argument("--tf-file", type=str, help="Single .tf file to scan", default=None)
    parser.add_argument("--tfplan-json", type=str, help="Path to tfplan.json file", default=None)
    parser.add_argument("--tenant-id", type=str, default="tenant-cli-default", help="Tenant ID")
    parser.add_argument("--provider", type=str, default="aws", choices=["aws", "gcp", "azure"], help="Cloud provider")
    parser.add_argument("--dry-run", action="store_true", default=True, help="Simulate without writing files")
    parser.add_argument("--auto-approve", action="store_true", default=False, help="Automatically approve proposals in non-interactive environments")
    return parser.parse_args()


def main():
    args = parse_args()
    print("=" * 80)
    print("🧭 FinOps Autonomous Agent Runner (LangGraph)")
    print("=" * 80)

    tf_files = {}
    tfplan_data = None

    if args.tf_file and os.path.isfile(args.tf_file):
        with open(args.tf_file, "r", encoding="utf-8") as f:
            tf_files[os.path.basename(args.tf_file)] = f.read()
    elif args.tfplan_json and os.path.isfile(args.tfplan_json):
        with open(args.tfplan_json, "r", encoding="utf-8") as f:
            tfplan_data = json.load(f)
    elif not args.tf_dir:
        # Default to sample if nothing supplied
        sample_path = os.path.join(current_dir, "examples", "sample_infrastructure.tf")
        if os.path.isfile(sample_path):
            with open(sample_path, "r", encoding="utf-8") as f:
                tf_files["sample_infrastructure.tf"] = f.read()
            print(f"[Info] No input specified. Using sample: {sample_path}")

    initial_state: FinOpsState = {
        "tenant_id": args.tenant_id,
        "job_id": f"cli-{os.urandom(4).hex()}",
        "terraform_dir": args.tf_dir,
        "tf_files": tf_files if tf_files else None,
        "tfplan_json": tfplan_data,
        "cloud_provider": args.provider,
        "dry_run": args.dry_run,
        "errors": [],
        "audit_trail": [],
    }

    thread_config = {"configurable": {"thread_id": f"cli-run-{os.urandom(4).hex()}"}}
    graph = create_finops_graph()

    print("[1/2] Scanning infrastructure and computing waste correlation...")
    state = graph.invoke(initial_state, config=thread_config)

    proposals = state.get("optimization_proposals") or []
    if not proposals:
        print("✅ No waste or optimization proposals found. Infrastructure is optimal.")
        return

    print(f"\n📋 Identified {len(proposals)} Optimization Proposals:")
    for i, p in enumerate(proposals, 1):
        print(f"  {i}. {p.get('title')} — Savings: ${p.get('estimated_monthly_savings_usd', 0):,.2f}/mo (Risk: {p.get('risk_level')})")

    if args.auto_approve:
        approved = True
        operator = "cli-auto-approver"
    else:
        ans = input("\nDo you approve executing these optimizations? [y/N]: ").strip().lower()
        approved = ans in ("y", "yes")
        operator = os.getenv("USER", os.getenv("USERNAME", "cli-operator"))

    print(f"\n[2/2] Submitting human decision (approved={approved})...")
    final_state = graph.invoke(
        Command(
            resume={
                "approved": approved,
                "approved_by": operator,
                "comments": "Approved via CLI runner.",
            }
        ),
        config=thread_config,
    )

    report = final_state.get("report") or {}
    print("\n" + report.get("markdown_report", "Execution complete."))


if __name__ == "__main__":
    main()
