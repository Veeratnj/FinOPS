"""
⑧ ReporterAgent (Terminal Node -> END)
Persists OrchestrationJob, Recommendation, Anomaly, sends Slack alerts, and formats executive report.
"""

from __future__ import annotations

from typing import Any, Dict, List
from Agents.integrations.db_adapter import FinOpsDBAdapter
from Agents.integrations.slack_notifier import SlackNotifier
from Agents.state import FinOpsReport, FinOpsState


def generate_markdown_report(
    tenant_id: str,
    total_scanned: int,
    total_waste: float,
    approved_savings: float,
    execution_status: str,
    proposals: List[Dict[str, Any]],
    verification_notes: str,
) -> str:
    """Formats executive Markdown summary."""
    rows = []
    for p in proposals:
        rows.append(
            f"| `{p.get('resource_id')}` | {p.get('category')} | {p.get('action')} | "
            f"`{p.get('current_config')}` → `{p.get('proposed_config')}` | "
            f"**${float(p.get('estimated_monthly_savings_usd', 0)):,.2f}** | {p.get('risk_level')} |"
        )
    table_str = "\n".join(rows) if rows else "| None | - | - | - | - | - |"

    return f"""# 🧭 FinOps Autonomous Agent Report

**Tenant ID:** `{tenant_id}`  
**Execution Outcome:** `{execution_status}`  
**Total Resources Scanned:** `{total_scanned}`  
**Identified Monthly Waste:** `${total_waste:,.2f}/mo`  
**Approved Monthly Realized Savings:** `${approved_savings:,.2f}/mo` (**${approved_savings * 12:,.2f}/year**)

---

### 📋 Optimization Proposals & Actions

| Resource ID | Category | Action | Config Change | Monthly Savings | Risk Level |
| :--- | :--- | :--- | :--- | :--- | :--- |
{table_str}

---

### ✅ Verification & Telemetry
{verification_notes}

---
*Report generated automatically by FinOps Multi-Agent LangGraph System.*
"""


def reporter_node(state: FinOpsState) -> Dict[str, Any]:
    """
    LangGraph Node: ReporterAgent (Terminal Node).
    Aggregates all execution stages, syncs DB, notifies Slack, and transitions to END.
    """
    tenant_id = state.get("tenant_id", "default_tenant")
    job_id = state.get("job_id")
    inventory = state.get("inventory") or []
    waste_candidates = state.get("waste_candidates") or []
    proposals = state.get("optimization_proposals") or []
    approval_decision = state.get("approval_decision") or {}
    execution_result = state.get("execution_result") or {}
    verification_result = state.get("verification_result") or {}

    total_waste = sum(float(w.get("estimated_waste_usd", 0.0)) for w in waste_candidates)
    approved_savings = sum(
        float(p.get("estimated_monthly_savings_usd", 0.0))
        for p in proposals
        if approval_decision.get("approved")
    )
    exec_status = execution_result.get("status", "TERMINATED_BEFORE_EXECUTION")

    # 1. DB Persistence (OrchestrationJob, Recommendation, Anomaly)
    db_metrics = FinOpsDBAdapter.persist_results(
        tenant_id=tenant_id,
        job_id=job_id,
        proposals=proposals,
        waste_candidates=waste_candidates,
        execution_result=execution_result,
    )

    # 2. Slack Notification
    slack_sent = SlackNotifier.send_finops_summary(
        tenant_id=tenant_id,
        total_savings_usd=approved_savings,
        proposals_count=len(proposals),
        execution_status=exec_status,
        details=proposals,
    )

    # 3. Format Executive Markdown
    md_report = generate_markdown_report(
        tenant_id=tenant_id,
        total_scanned=len(inventory),
        total_waste=total_waste,
        approved_savings=approved_savings,
        execution_status=exec_status,
        proposals=proposals,
        verification_notes=verification_result.get("verification_notes", "No verification performed."),
    )

    report_obj = FinOpsReport(
        summary=f"Processed {len(inventory)} resources. Unlocked ${approved_savings:,.2f}/mo savings.",
        total_resources_scanned=len(inventory),
        total_waste_identified_usd=total_waste,
        potential_monthly_savings_usd=sum(float(p.get("estimated_monthly_savings_usd", 0.0)) for p in proposals),
        approved_savings_usd=approved_savings,
        execution_status=exec_status,
        orchestration_job_id=job_id,
        recommendations_created=db_metrics["recommendations_created"],
        anomalies_flagged=db_metrics["anomalies_flagged"],
        slack_notified=slack_sent,
        markdown_report=md_report,
    )

    return {
        "report": report_obj.model_dump(),
        "current_node": "reporter",
        "next_node": "END",
        "audit_trail": [
            {
                "node": "reporter",
                "action": "report_completed",
                "realized_monthly_savings_usd": approved_savings,
                "slack_notified": slack_sent,
            }
        ],
    }
