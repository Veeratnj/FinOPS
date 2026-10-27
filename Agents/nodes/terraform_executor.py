"""
⑥ TerraformExecutorAgent (🔒 ONLY WRITE AGENT)
Enforces 4-layer guardrails and executes approved Terraform optimizations or dry-run simulations.
"""

from __future__ import annotations

import os
import uuid
from typing import Any, Dict, List
from Agents.guards.executor_guards import ExecutorGuardrails, GuardrailViolation
from Agents.state import ExecutionResult, FinOpsState


def apply_hcl_diff_to_string(content: str, old_val: str, new_val: str) -> str:
    """Safely applies replacement within HCL text."""
    return content.replace(f'"{old_val}"', f'"{new_val}"')


def terraform_executor_node(state: FinOpsState) -> Dict[str, Any]:
    """
    LangGraph Node: TerraformExecutorAgent.
    The ONLY write agent in the entire FinOps architecture.
    """
    proposals = state.get("optimization_proposals") or []
    approval_decision = state.get("approval_decision") or {}
    dry_run = state.get("dry_run", True)

    passed_guards: List[str] = []
    try:
        # Run 4-layer guardrails
        passed_guards = ExecutorGuardrails.verify_all(state, proposals, approval_decision)
    except GuardrailViolation as e:
        return {
            "execution_result": ExecutionResult(
                execution_id=f"exec-{uuid.uuid4().hex[:8]}",
                dry_run=dry_run,
                status="FAILED",
                stdout="",
                stderr=str(e),
                guardrail_checks_passed=passed_guards,
            ).model_dump(),
            "errors": [f"TerraformExecutor blocked by guardrail: {str(e)}"],
            "current_node": "terraform_executor",
            "audit_trail": [
                {
                    "node": "terraform_executor",
                    "action": "execution_blocked_by_guardrail",
                    "reason": str(e),
                }
            ],
        }

    # Filter proposals to approved ones
    approved_ids = set(approval_decision.get("approved_proposal_ids", []))
    active_proposals = [p for p in proposals if not approved_ids or p.get("proposal_id") in approved_ids]

    applied_changes = []
    combined_diff = ""
    updated_tf_files = dict(state.get("tf_files") or {})

    for p in active_proposals:
        combined_diff += p.get("hcl_diff", "") + "\n"
        change_meta = {
            "proposal_id": p.get("proposal_id"),
            "resource_id": p.get("resource_id"),
            "action": p.get("action"),
            "from": p.get("current_config"),
            "to": p.get("proposed_config"),
            "estimated_monthly_savings_usd": p.get("estimated_monthly_savings_usd"),
        }
        applied_changes.append(change_meta)

        # Apply to in-memory files if available
        src_file = p.get("source_file", "main.tf")
        if src_file in updated_tf_files and not dry_run:
            old_c = p.get("current_config", "")
            new_c = p.get("proposed_config", "")
            updated_tf_files[src_file] = apply_hcl_diff_to_string(
                updated_tf_files[src_file], old_c, new_c
            )

    status_str = "DRY_RUN_PASSED" if dry_run else "SUCCESS"
    stdout_msg = (
        f"[TerraformExecutor] {'Dry-run simulated' if dry_run else 'Successfully applied'} "
        f"{len(applied_changes)} IaC optimizations across {len(active_proposals)} resources.\n"
        f"Verified 4-layer security guardrails.\n"
    )

    result = ExecutionResult(
        execution_id=f"exec-{uuid.uuid4().hex[:8]}",
        dry_run=dry_run,
        status=status_str,
        applied_changes=applied_changes,
        diff_applied=combined_diff,
        guardrail_checks_passed=passed_guards,
        stdout=stdout_msg,
        stderr=None,
    )

    return {
        "execution_result": result.model_dump(),
        "tf_files": updated_tf_files,
        "current_node": "terraform_executor",
        "audit_trail": [
            {
                "node": "terraform_executor",
                "action": "execution_completed",
                "status": status_str,
                "dry_run": dry_run,
                "changes_count": len(applied_changes),
            }
        ],
    }
