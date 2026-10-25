"""
Forecasting controller - serves dynamic cost forecasts from PostgreSQL.
"""

from typing import Any
from fastapi import APIRouter, Body, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.services.forecasting_service import forecasting_service
from app.models import Tenant

forecasting_controller = APIRouter(prefix="/forecasting", tags=["Forecasting"])


def _resolve_tenant_id(current_user: Any, db: Session) -> str:
    if current_user and hasattr(current_user, "tenant_id") and current_user.tenant_id:
        return str(current_user.tenant_id)
    tenant = db.query(Tenant).first()
    return str(tenant.id) if tenant else "default"


@forecasting_controller.get("/forecast")
def get_forecast(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> dict[str, Any]:
    """Get forecast scenarios dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return forecasting_service.get_forecast_scenarios(db, tenant_id)


@forecasting_controller.get("/drivers")
def get_forecast_drivers(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> list[dict[str, Any]]:
    """Get forecast drivers dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return forecasting_service.get_drivers(db, tenant_id)


@forecasting_controller.get("/accuracy")
def get_forecast_accuracy(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> dict[str, Any]:
    """Get forecast accuracy dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return forecasting_service.get_accuracy(db, tenant_id)


@forecasting_controller.post("/what-if")
def what_if_forecast(payload: dict[str, Any] = Body(...)) -> dict[str, Any]:
    return {"scenario": "custom", "projectedSpend": 295000, "savings": 15000}
