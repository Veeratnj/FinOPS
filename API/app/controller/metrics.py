"""
Metrics controller - serves dynamic platform metrics and analytics directly from PostgreSQL.
"""

from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.services.metrics_service import metrics_service
from app.services.intelligence_service import intelligence_service
from app.models import Tenant

metrics_controller = APIRouter(prefix="/metrics", tags=["Metrics"])


def _resolve_tenant_id(current_user: Any, db: Session) -> str:
    """Helper to get tenant_id from auth context or fallback to default active tenant."""
    if current_user and hasattr(current_user, "tenant_id") and current_user.tenant_id:
        return str(current_user.tenant_id)
    tenant = db.query(Tenant).first()
    return str(tenant.id) if tenant else "default"


@metrics_controller.get("/all")
def get_all_metrics(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> dict[str, Any]:
    """Get all metrics and analytics data dynamically from PostgreSQL."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return metrics_service.get_all_metrics(db, tenant_id)


@metrics_controller.get("/summary")
def get_summary(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> dict[str, Any]:
    """Get cost summary data dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return metrics_service.get_summary(db, tenant_id)


@metrics_controller.get("/cost-by-category")
def get_cost_by_category(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> list[dict[str, Any]]:
    """Get cost breakdown by category dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    metrics = metrics_service.get_all_metrics(db, tenant_id)
    return metrics.get("costByCategory", [])


@metrics_controller.get("/cost-trend")
def get_cost_trend(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> list[dict[str, Any]]:
    """Get cost trends over time dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return metrics_service.get_cost_trend(db, tenant_id)


@metrics_controller.get("/top-services")
def get_top_services(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> list[dict[str, Any]]:
    """Get top services by cost dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    metrics = metrics_service.get_all_metrics(db, tenant_id)
    return metrics.get("topServices", [])


@metrics_controller.get("/recommendations")
def get_recommendations(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> list[dict[str, Any]]:
    """Get cost optimization recommendations dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    metrics = metrics_service.get_all_metrics(db, tenant_id)
    return metrics.get("recommendations", [])


@metrics_controller.get("/anomalies")
def get_anomalies(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> list[dict[str, Any]]:
    """Get detected anomalies dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    metrics = metrics_service.get_all_metrics(db, tenant_id)
    return metrics.get("anomalies", [])


@metrics_controller.get("/kubernetes")
def get_kubernetes(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> dict[str, Any]:
    """Get Kubernetes metrics and cluster data dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    metrics = metrics_service.get_all_metrics(db, tenant_id)
    return metrics.get("kubernetes", {})


@metrics_controller.get("/token-ops")
def get_token_ops(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> dict[str, Any]:
    """Get TokenOPS data dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return intelligence_service.get_token_ops(db, tenant_id)


@metrics_controller.get("/docker")
def get_docker(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> dict[str, Any]:
    """Get Docker Intelligence data dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return intelligence_service.get_docker_analytics(db, tenant_id)


@metrics_controller.get("/multi-cloud")
def get_multi_cloud(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> dict[str, Any]:
    """Get MultiCloud data dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return intelligence_service.get_multi_cloud_analytics(db, tenant_id)


@metrics_controller.get("/hardware-orchestration")
def get_hardware_orchestration(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> dict[str, Any]:
    """Get Hardware Orchestration data dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return intelligence_service.get_hardware_orchestration(db, tenant_id)
