"""
FinOps Agent Controller - Exposes REST endpoints to trigger and supervise LangGraph multi-agent runs.
"""

from __future__ import annotations

import uuid
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api import deps
from app.models import Tenant
import sys
from pathlib import Path

# Ensure root workspace directory is in sys.path
_ROOT_DIR = str(Path(__file__).resolve().parent.parent.parent.parent)
if _ROOT_DIR not in sys.path:
    sys.path.insert(0, _ROOT_DIR)

from langgraph.types import Command
from Agents.graph import create_finops_graph
from Agents.state import FinOpsState

agent_controller = APIRouter(prefix="/agents", tags=["FinOps Agents"])

# Global compiled graph with memory checkpointer
finops_graph = create_finops_graph()


class ScanRequest(BaseModel):
    tenant_id: Optional[str] = None
    terraform_dir: Optional[str] = None
    tf_files: Optional[Dict[str, str]] = None
    cloud_provider: str = "aws"
    dry_run: bool = True


class ApprovalRequest(BaseModel):
    thread_id: str
    approved: bool
    approved_by: str = "security-admin"
    comments: Optional[str] = None
    approved_proposal_ids: Optional[List[str]] = None


def _resolve_tenant_id(current_user: Any, db: Session, req_tenant_id: Optional[str] = None) -> str:
    if req_tenant_id:
        return req_tenant_id
    if current_user and hasattr(current_user, "tenant_id") and current_user.tenant_id:
        return str(current_user.tenant_id)
    tenant = db.query(Tenant).first()
    return tenant.id if tenant else "default-tenant"


@agent_controller.post("/scan")
def trigger_finops_scan(
    req: ScanRequest,
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> Dict[str, Any]:
    """
    Triggers the FinOps Multi-Agent LangGraph scan.
    Runs START -> Supervisor -> Inventory -> Observability -> CostCorrelator -> Synthesizer -> HITL Gate.
    Pauses execution at HitlGate via interrupt() and returns generated proposals.
    """
    tenant_id = _resolve_tenant_id(current_user, db, req.tenant_id)
    thread_id = f"thread-{uuid.uuid4().hex[:12]}"
    config = {"configurable": {"thread_id": thread_id}}

    tf_files = req.tf_files
    if not tf_files and not req.terraform_dir:
        sample_path = Path(_ROOT_DIR) / "Agents" / "examples" / "sample_infrastructure.tf"
        if sample_path.exists():
            tf_files = {"sample_infrastructure.tf": sample_path.read_text(encoding="utf-8")}

    initial_state: FinOpsState = {
        "tenant_id": tenant_id,
        "job_id": str(uuid.uuid4()),
        "terraform_dir": req.terraform_dir,
        "tf_files": tf_files,
        "cloud_provider": req.cloud_provider,
        "dry_run": req.dry_run,
        "errors": [],
        "audit_trail": [],
    }

    # Run until HITL interrupt
    try:
        state = finops_graph.invoke(initial_state, config=config)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent workflow failed: {str(e)}")

    proposals = state.get("optimization_proposals") or []
    total_savings = sum(float(p.get("estimated_monthly_savings_usd", 0.0)) for p in proposals)

    return {
        "thread_id": thread_id,
        "status": "AWAITING_APPROVAL" if proposals else "COMPLETED_NO_WASTE",
        "current_node": state.get("current_node"),
        "total_proposals": len(proposals),
        "total_monthly_savings_usd": total_savings,
        "proposals": proposals,
        "inventory_count": len(state.get("inventory") or []),
        "waste_candidates_count": len(state.get("waste_candidates") or []),
    }


@agent_controller.post("/approve")
def submit_approval(req: ApprovalRequest) -> Dict[str, Any]:
    """
    Submits human decision to the paused HITL Gate via Command(resume=...).
    Resumes graph: HitlGate -> Supervisor -> TerraformExecutor (4-layer guard) -> Verification -> Reporter -> END.
    """
    config = {"configurable": {"thread_id": req.thread_id}}

    approval_payload = {
        "approved": req.approved,
        "approved_by": req.approved_by,
        "comments": req.comments,
        "approved_proposal_ids": req.approved_proposal_ids,
    }

    try:
        final_state = finops_graph.invoke(Command(resume=approval_payload), config=config)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to resume agent workflow: {str(e)}")

    return {
        "thread_id": req.thread_id,
        "status": "COMPLETED",
        "execution_result": final_state.get("execution_result"),
        "verification_result": final_state.get("verification_result"),
        "report": final_state.get("report"),
    }


@agent_controller.get("/runs/{thread_id}")
def get_run_status(thread_id: str) -> Dict[str, Any]:
    """Retrieves state snapshot and audit trail for a graph execution thread."""
    config = {"configurable": {"thread_id": thread_id}}
    state_snapshot = finops_graph.get_state(config)
    if not state_snapshot or not state_snapshot.values:
        raise HTTPException(status_code=404, detail="Execution thread not found")

    vals = state_snapshot.values
    return {
        "thread_id": thread_id,
        "next": state_snapshot.next,
        "current_node": vals.get("current_node"),
        "approval_status": vals.get("approval_status"),
        "proposals_count": len(vals.get("optimization_proposals") or []),
        "audit_trail": vals.get("audit_trail", []),
    }
