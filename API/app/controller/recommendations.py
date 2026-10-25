"""
Recommendations controller - serves live recommendations from PostgreSQL.
"""

from typing import Any, Optional
from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.services.recommendations_service import recommendations_service
from app.models import Tenant

recommendations_controller = APIRouter(prefix="/recommendations", tags=["Recommendations"])


def _resolve_tenant_id(current_user: Any, db: Session) -> str:
    if current_user and hasattr(current_user, "tenant_id") and current_user.tenant_id:
        return str(current_user.tenant_id)
    tenant = db.query(Tenant).first()
    return str(tenant.id) if tenant else "default"


@recommendations_controller.get("")
def get_recommendations(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> list[dict[str, Any]]:
    """Get all recommendations dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return recommendations_service.get_recommendations(db, tenant_id)


@recommendations_controller.get("/filter")
def filter_recommendations(
    category: Optional[str] = None,
    impact: Optional[str] = None,
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> list[dict[str, Any]]:
    """Filter recommendations by category and impact."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return recommendations_service.filter_recommendations(db, tenant_id, category, impact)


@recommendations_controller.get("/savings-summary")
def get_savings_summary(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> dict[str, Any]:
    """Get summary of savings opportunity."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return recommendations_service.get_savings_summary(db, tenant_id)


@recommendations_controller.get("/{recommendation_id}")
def get_recommendation(
    recommendation_id: str,
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> dict[str, Any]:
    """Get a specific recommendation."""
    tenant_id = _resolve_tenant_id(current_user, db)
    recs = recommendations_service.get_recommendations(db, tenant_id)
    for r in recs:
        if r["id"] == recommendation_id:
            return r
    raise HTTPException(status_code=404, detail="Recommendation not found")


@recommendations_controller.put("/{recommendation_id}/status")
def update_recommendation_status(
    recommendation_id: str,
    payload: dict[str, Any] = Body(...),
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> dict[str, Any]:
    """Update recommendation status in database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    status_str = payload.get("status", "in_progress")
    res = recommendations_service.update_status(db, tenant_id, recommendation_id, status_str)
    if not res:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    return res


@recommendations_controller.post("/{recommendation_id}/apply")
def apply_recommendation(
    recommendation_id: str,
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> dict[str, Any]:
    """Apply recommendation."""
    tenant_id = _resolve_tenant_id(current_user, db)
    recommendations_service.update_status(db, tenant_id, recommendation_id, "done")
    return {"message": "Recommendation applied successfully.", "status": "done"}


@recommendations_controller.post("/{recommendation_id}/dismiss")
def dismiss_recommendation(
    recommendation_id: str,
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> dict[str, Any]:
    """Dismiss recommendation."""
    tenant_id = _resolve_tenant_id(current_user, db)
    recommendations_service.update_status(db, tenant_id, recommendation_id, "dismissed")
    return {"message": "Recommendation dismissed."}
