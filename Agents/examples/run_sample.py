"""
End-to-End Demo Script for FinOps Multi-Agent LangGraph System.
Demonstrates:
1. Inventory scanning of sample_infrastructure.tf
2. Observability metrics correlation
3. Financial waste detection
4. Optimization synthesis with unified HCL diffs
5. LangGraph HITL Gate interruption
6. Human approval resume via Command(resume=...)
7. 4-Layer Guardrail verification & TerraformExecutorAgent execution
8. VerificationAgent before/after checks
9. ReporterAgent final executive output
"""

from __future__ import annotations

import os
import sys

# Ensure root workspace is on path
current_dir = os.path.dirname(os.path.abspath(__file__))
workspace_root = os.path.abspath(os.path.join(current_dir, "..", ".."))
if workspace_root not in sys.path:
    sys.path.insert(0, workspace_root)

if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if sys.stderr and hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from langgraph.types import Command
from Agents.graph import create_finops_graph
from Agents.state import FinOpsState


def main():
    print("=" * 80)
    print("🚀 FINOPS MULTI-AGENT SYSTEM (LANGGRAPH)")
    print("   Architecture: agent_mermaid.png (Deterministic Supervisor + Workers)")
    print("=" * 80)

    # 1. Read sample terraform file
    tf_sample_path = os.path.join(current_dir, "sample_infrastructure.tf")
    with open(tf_sample_path, "r", encoding="utf-8") as f:
        tf_code = f.read()

    # 2. Build graph with in-memory checkpointer
    graph = create_finops_graph()
    thread_config = {"configurable": {"thread_id": "demo-finops-run-101"}}

    initial_state: FinOpsState = {
        "tenant_id": "tenant-enterprise-77",
        "job_id": "job-finops-auto-001",
        "tf_files": {"sample_infrastructure.tf": tf_code},
        "cloud_provider": "aws",
        "dry_run": True,
        "errors": [],
        "audit_trail": [],
    }

    print("\n[Phase 1] Launching LangGraph workflow from START -> Supervisor...")
    # Run graph until it pauses at HitlGate
    state = graph.invoke(initial_state, config=thread_config)

    # Inspect current state after interruption
    print(f"\n⏸️ Graph Paused at Node: '{state.get('current_node')}' (HITL Gate)")
    proposals = state.get("optimization_proposals", [])
    print(f"📊 Synthesized Proposals Count: {len(proposals)}")
    total_savings = sum(p.get("estimated_monthly_savings_usd", 0) for p in proposals)
    print(f"💰 Total Monthly Potential Savings: ${total_savings:,.2f}/mo (${total_savings * 12:,.2f}/yr)\n")

    for idx, p in enumerate(proposals, 1):
        print(f"  [{idx}] {p.get('title')}")
        print(f"      Action: {p.get('action')} on {p.get('resource_id')}")
        print(f"      Config: {p.get('current_config')} -> {p.get('proposed_config')}")
        print(f"      Savings: ${p.get('estimated_monthly_savings_usd', 0):,.2f}/mo | Risk: {p.get('risk_level')}")
        print("      HCL Diff Preview:")
        for line in p.get("hcl_diff", "").strip().split("\n")[:4]:
            print(f"        {line}")
        print()

    # 3. Simulate Human Approval
    print("=" * 80)
    print("🧑‍💻 [Phase 2] HUMAN-IN-THE-LOOP APPROVAL")
    print("   Simulating Principal DevOps Engineer reviewing and signing off...")
    print("=" * 80)

    approval_payload = {
        "approved": True,
        "approved_by": "lead.architect@company.com",
        "comments": "Approved downsizing for non-peak workloads and storage tier upgrades.",
        "approved_proposal_ids": [p["proposal_id"] for p in proposals],
    }

    # 4. Resume execution via LangGraph Command(resume=...)
    print("\n▶️ Resuming graph execution with human approval payload...")
    final_state = graph.invoke(
        Command(resume=approval_payload),
        config=thread_config,
    )

    print("\n" + "=" * 80)
    print("🏁 EXECUTION COMPLETE — FINAL EXECUTIVE REPORT")
    print("=" * 80)

    report = final_state.get("report", {})
    print(report.get("markdown_report", "No report generated."))

    print("\n🔍 Execution Result Summary:")
    exec_res = final_state.get("execution_result", {})
    print(f"  Status: {exec_res.get('status')}")
    print(f"  Dry Run: {exec_res.get('dry_run')}")
    print("  Guardrails Verified:")
    for g in exec_res.get("guardrail_checks_passed", []):
        print(f"    ✓ {g}")

    print("\n🔍 Verification Result Summary:")
    ver_res = final_state.get("verification_result", {})
    print(f"  Status: {ver_res.get('status')}")
    print(f"  Health: {ver_res.get('health_status')}")
    print(f"  Notes:  {ver_res.get('verification_notes')}")


if __name__ == "__main__":
    main()
