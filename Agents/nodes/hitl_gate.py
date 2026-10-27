"""
⑤ HitlGate (Human-In-The-Loop Gate)
Uses LangGraph interrupt() + checkpointing for idempotent human sign-off on IaC modifications.
"""

from __future__ import annotations

from typing import Any, Dict
from langgraph.types import interrupt
from Agents.state import FinOpsState, HumanApprovalDecision


def hitl_gate_node(state: FinOpsState) -> Dict[str, Any]:
    """
    LangGraph Node: HitlGate (interrupt() + checkpoint + idempotent re-entry).
    Pauses execution until a human operator approves or rejects the proposed optimizations.
    """
    approval_status = state.get("approval_status")

    # Idempotent re-entry check: If already approved or rejected, pass through
    if approval_status in ("approved", "rejected") and state.get("approval_decision"):
        return {
            "approval_status": approval_status,
            "current_node": "hitl_gate",
        }

    proposals = state.get("optimization_proposals") or []
    total_savings = sum(float(p.get("estimated_monthly_savings_usd", 0.0)) for p in proposals)

    interrupt_payload = {
        "action": "human_approval_required",
        "message": f"Review and approve {len(proposals)} FinOps optimization proposals (${total_savings:.2f}/mo potential savings).",
        "tenant_id": state.get("tenant_id"),
        "total_proposals": len(proposals),
        "total_monthly_savings_usd": total_savings,
        "proposals": [
            {
                "proposal_id": p.get("proposal_id"),
                "title": p.get("title"),
                "resource_id": p.get("resource_id"),
                "action": p.get("action"),
                "estimated_monthly_savings_usd": p.get("estimated_monthly_savings_usd"),
                "risk_level": p.get("risk_level"),
                "hcl_diff": p.get("hcl_diff"),
            }
            for p in proposals
        ],
    }

    # Yield execution via LangGraph interrupt(). Checkpointer preserves graph state.
    # When resumed via Command(resume={...}), resume_value holds the human input.
    human_response = interrupt(interrupt_payload)

    # Process resume payload
    approved = False
    approved_by = "anonymous_operator"
    comments = None
    approved_ids = []

    if isinstance(human_response, dict):
        approved = bool(human_response.get("approved", False))
        approved_by = human_response.get("approved_by", "finops_admin")
        comments = human_response.get("comments")
        raw_ids = human_response.get("approved_proposal_ids")
        approved_ids = raw_ids if raw_ids is not None else [p.get("proposal_id") for p in proposals if p.get("proposal_id")]

    decision = HumanApprovalDecision(
        approved=approved,
        approved_by=approved_by,
        comments=comments,
        approved_proposal_ids=approved_ids,
    )

    new_status = "approved" if approved else "rejected"

    return {
        "approval_status": new_status,
        "approval_decision": decision.model_dump(),
        "current_node": "hitl_gate",
        "audit_trail": [
            {
                "node": "hitl_gate",
                "action": f"decision_{new_status}",
                "operator": approved_by,
                "approved": approved,
                "comments": comments,
            }
        ],
    }
