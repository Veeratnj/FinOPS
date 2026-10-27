"""
Supervisor Guardrails.
Validates state integrity before and during routing.
"""

from typing import Any, Dict, List


class SupervisorGuardrails:
    """Deterministic state validation guardrails for SupervisorAgent."""

    @staticmethod
    def validate_incoming_state(state: Dict[str, Any]) -> List[str]:
        """Validates that initial state satisfies mandatory entrypoint requirements."""
        issues = []
        if not state.get("tenant_id"):
            issues.append("Missing mandatory 'tenant_id' in entrypoint state.")

        if not state.get("terraform_dir") and not state.get("tf_files") and not state.get("tfplan_json"):
            issues.append("Must supply at least one of 'terraform_dir', 'tf_files', or 'tfplan_json'.")

        return issues
