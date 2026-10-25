"""
Dedicated Intelligence and Infrastructure Operations Controller (Docker, Multi-Cloud, Hardware, TokenOPS).
All endpoints query PostgreSQL database directly through service layers.
"""

from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.services.intelligence_service import intelligence_service
from app.models import Tenant

intelligence_controller = APIRouter(tags=["Intelligence & Operations"])


def _get_tenant_id(current_user: Any, db: Session) -> str:
    """Helper to get tenant_id safely or fallback to primary tenant."""
    if hasattr(current_user, "tenant_id") and current_user.tenant_id:
        return current_user.tenant_id
    tenant = db.query(Tenant).first()
    return tenant.id if tenant else "default"


@intelligence_controller.get("/docker")
def get_docker_analytics(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> dict[str, Any]:
    """Get Docker container fleet and storage waste analytics."""
    tenant_id = _get_tenant_id(current_user, db)
    return intelligence_service.get_docker_analytics(db, tenant_id)


@intelligence_controller.get("/multi-cloud")
def get_multi_cloud_analytics(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> dict[str, Any]:
    """Get cross-cloud spend, arbitrage, and provider comparisons."""
    tenant_id = _get_tenant_id(current_user, db)
    return intelligence_service.get_multi_cloud_analytics(db, tenant_id)


@intelligence_controller.get("/hardware-orchestration")
def get_hardware_orchestration(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> dict[str, Any]:
    """Get GPU, MPU, CPU, and LPU hardware fleet metrics."""
    tenant_id = _get_tenant_id(current_user, db)
    return intelligence_service.get_hardware_orchestration(db, tenant_id)


@intelligence_controller.get("/token-ops")
def get_token_ops(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> dict[str, Any]:
    """Get token consumption, prompt analytics, and consumer breakdowns."""
    tenant_id = _get_tenant_id(current_user, db)
    return intelligence_service.get_token_ops(db, tenant_id)


@intelligence_controller.get("/llm-ops")
def get_llm_ops(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> dict[str, Any]:
    """Get LLM operational telemetry, requests, tokens, and guardrails."""
    tenant_id = _get_tenant_id(current_user, db)
    return intelligence_service.get_llm_ops(db, tenant_id)

