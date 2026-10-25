"""
Dashboard controller - serves dashboard metrics directly from PostgreSQL.
"""

from datetime import datetime, timezone
from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.services.metrics_service import metrics_service
from app.models import Tenant

dashboard_controller = APIRouter(prefix="/dashboard", tags=["Dashboard"])


def _resolve_tenant_id(current_user: Any, db: Session) -> str:
    """Helper to get tenant_id from auth context or fallback to default active tenant."""
    if current_user and hasattr(current_user, "tenant_id") and current_user.tenant_id:
        return str(current_user.tenant_id)
    tenant = db.query(Tenant).first()
    return str(tenant.id) if tenant else "default"


@dashboard_controller.get("/summary")
def get_dashboard_summary(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> dict[str, Any]:
    """Get cost summary dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return metrics_service.get_summary(db, tenant_id)


@dashboard_controller.get("/spend-trend")
def get_spend_trend(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> list[dict[str, Any]]:
    """Get cost trends dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return metrics_service.get_cost_trend(db, tenant_id)


@dashboard_controller.get("/cost-by-category")
def get_cost_by_category(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> list[dict[str, Any]]:
    """Get cost breakdown by category dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    all_data = metrics_service.get_all_metrics(db, tenant_id)
    return all_data.get("costByCategory", [])


@dashboard_controller.get("/top-services")
def get_top_services(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> list[dict[str, Any]]:
    """Get top services dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    all_data = metrics_service.get_all_metrics(db, tenant_id)
    return all_data.get("topServices", [])


@dashboard_controller.get("/recommendations-widget")
def get_recommendations_widget(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> list[dict[str, Any]]:
    """Get recommendations widget from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    all_data = metrics_service.get_all_metrics(db, tenant_id)
    return all_data.get("recommendations", [])[:3]


@dashboard_controller.get("/anomalies-widget")
def get_anomalies_widget(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> list[dict[str, Any]]:
    """Get anomalies widget from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    all_data = metrics_service.get_all_metrics(db, tenant_id)
    return all_data.get("anomalies", [])[:3]


@dashboard_controller.get("/reports-widget")
def get_reports_widget(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> list[dict[str, Any]]:
    """Get reports widget from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    all_data = metrics_service.get_all_metrics(db, tenant_id)
    return all_data.get("reports", [])


@dashboard_controller.post("/refresh")
def refresh_dashboard() -> dict[str, Any]:
    return {"message": "Dashboard data refreshed.", "timestamp": datetime.now(timezone.utc).isoformat()}


@dashboard_controller.get("/sample")
def sample_dashboard(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
):
    """Get all dashboard data from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    data = metrics_service.get_all_metrics(db, tenant_id)
    return {
        'data': data,
        'msg': "Dashboard data fetched successfully"
    }


@dashboard_controller.get("/agent-ops")
def agent_ops_dashboard(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> dict[str, Any]:
    """Return live Agent Operations data dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return metrics_service.get_agent_ops(db, tenant_id)


@dashboard_controller.get("/llm-ops")
def llm_ops_dashboard(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> dict[str, Any]:
    """Return live LLM Operations data dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return metrics_service.get_llm_ops(db, tenant_id)
