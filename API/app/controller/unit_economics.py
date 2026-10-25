"""
Unit economics controller - serves dynamic unit economics from PostgreSQL.
"""

from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.services.unit_economics_service import unit_economics_service
from app.models import Tenant

unit_economics_controller = APIRouter(prefix="/unit-economics", tags=["Unit Economics"])


def _resolve_tenant_id(current_user: Any, db: Session) -> str:
    if current_user and hasattr(current_user, "tenant_id") and current_user.tenant_id:
        return str(current_user.tenant_id)
    tenant = db.query(Tenant).first()
    return str(tenant.id) if tenant else "default"


@unit_economics_controller.get("/summary")
def get_unit_economics_summary(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> dict[str, Any]:
    """Get latest unit economics KPIs dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return unit_economics_service.get_summary(db, tenant_id)


@unit_economics_controller.get("/trends")
def get_unit_economics_trends(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> list[dict[str, Any]]:
    """Get unit economics trends dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return unit_economics_service.get_trends(db, tenant_id)
