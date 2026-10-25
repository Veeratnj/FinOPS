"""
Virtual tags controller - serves dynamic tag mappings from PostgreSQL.
"""

from typing import Any
from fastapi import APIRouter, Body, Depends, status
from sqlalchemy.orm import Session

from app.api import deps
from app.services.virtual_tags_service import virtual_tags_service
from app.models import Tenant

virtual_tags_controller = APIRouter(prefix="/virtual-tags", tags=["Virtual Tags"])


def _resolve_tenant_id(current_user: Any, db: Session) -> str:
    if current_user and hasattr(current_user, "tenant_id") and current_user.tenant_id:
        return str(current_user.tenant_id)
    tenant = db.query(Tenant).first()
    return str(tenant.id) if tenant else "default"


@virtual_tags_controller.get("")
@virtual_tags_controller.get("/rules")
def get_virtual_tags(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> list[dict[str, Any]]:
    """Get all virtual tag rules dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return virtual_tags_service.get_virtual_tags(db, tenant_id)


@virtual_tags_controller.get("/mappings")
def get_virtual_tag_mappings(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> list[dict[str, Any]]:
    """Get all virtual tag mappings dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return virtual_tags_service.get_mappings(db, tenant_id)


@virtual_tags_controller.post("/rules/create", status_code=status.HTTP_201_CREATED)
def create_virtual_tag_rule(
    payload: dict[str, Any] = Body(...),
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> dict[str, Any]:
    """Create a virtual tag rule in the database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return virtual_tags_service.create_rule(db, tenant_id, payload)
