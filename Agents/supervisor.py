"""
SupervisorAgent (deterministic • no LLM • guardrails + route_fn)
Acts as the central orchestrator and deterministic router for the FinOps LangGraph system.
"""

from __future__ import annotations

import logging
from typing import Any, Dict
from Agents.guards.supervisor_guards import SupervisorGuardrails
from Agents.state import FinOpsState

logger = logging.getLogger("SupervisorAgent")


def supervisor_node(state: FinOpsState) -> Dict[str, Any]:
    """
    Supervisor Node (deterministic • no LLM).
    Validates state integrity guardrails and prepares state for next routing step.
    """
    issues = SupervisorGuardrails.validate_incoming_state(state)
    errors = list(state.get("errors") or [])

    if issues:
        errors.extend(issues)
        logger.warning(f"Supervisor Guardrails detected issues: {issues}")

    # Determine next route
    next_step = supervisor_route_fn(state)

    return {
        "current_node": "supervisor",
        "next_node": next_step,
        "errors": errors if issues else [],
        "audit_trail": [
            {
                "node": "supervisor",
                "action": "routed",
                "destination": next_step,
            }
        ],
    }


def supervisor_route_fn(state: FinOpsState) -> str:
    """
    Deterministic Routing Function (route_fn) without LLM.
    Strictly follows the 8 numbered transitions from agent_mermaid.png:

    ① no inventory           -> terraform_inventory
    ② no metrics             -> observability
    ③ no waste               -> cost_correlator
    ④ no proposals           -> optimization_synthesizer
    ⑤ no approval yet        -> hitl_gate
    ⑥ approved • not executed -> terraform_executor
    ⑦ executed • not verified -> verification
    ⑧ done OR error          -> reporter
    """
    # ⑧ Check for fatal errors first
    errors = state.get("errors") or []
    if len(errors) > 0:
        return "reporter"

    # ① no inventory
    inventory = state.get("inventory")
    if inventory is None or len(inventory) == 0:
        return "terraform_inventory"

    # ② no metrics
    metrics = state.get("metrics")
    if metrics is None or len(metrics) == 0:
        return "observability"

    # ③ no waste
    waste = state.get("waste_candidates")
    if waste is None:
        return "cost_correlator"

    # ④ no proposals
    proposals = state.get("optimization_proposals")
    if proposals is None:
        return "optimization_synthesizer"

    # If there are 0 waste items or 0 proposals, we can jump directly to reporter (done)
    if len(proposals) == 0:
        return "reporter"

    # ⑤ no approval yet
    approval_status = state.get("approval_status")
    if not approval_status or approval_status == "pending":
        return "hitl_gate"

    # If human rejected, do not execute; route to reporter
    if approval_status == "rejected":
        return "reporter"

    # ⑥ approved • not executed
    execution_result = state.get("execution_result")
    if approval_status == "approved" and not execution_result:
        return "terraform_executor"

    # ⑦ executed • not verified
    verification_result = state.get("verification_result")
    if execution_result and not verification_result:
        return "verification"

    # ⑧ done OR error -> ReporterAgent
    return "reporter"
