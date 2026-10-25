"""
Kubernetes controller - serves live Kubernetes clusters and pod metrics from PostgreSQL.
"""

from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.services.kubernetes_service import kubernetes_service
from app.models import Tenant

kubernetes_controller = APIRouter(prefix="/kubernetes", tags=["Kubernetes"])


def _resolve_tenant_id(current_user: Any, db: Session) -> str:
    if current_user and hasattr(current_user, "tenant_id") and current_user.tenant_id:
        return str(current_user.tenant_id)
    tenant = db.query(Tenant).first()
    return str(tenant.id) if tenant else "default"


@kubernetes_controller.get("/clusters")
def get_kubernetes_clusters(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> list[dict[str, Any]]:
    """Get Kubernetes clusters dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return kubernetes_service.get_clusters(db, tenant_id)


@kubernetes_controller.get("/namespaces")
def get_kubernetes_namespaces(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> list[dict[str, Any]]:
    """Get Kubernetes namespaces dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return kubernetes_service.get_namespaces(db, tenant_id)


@kubernetes_controller.get("/nodes")
def get_kubernetes_nodes(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> list[dict[str, Any]]:
    """Get Kubernetes nodes dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return kubernetes_service.get_nodes(db, tenant_id)
