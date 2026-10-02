"""Categories controller."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app import schemas
from app.services.category_service import category_service

categories_controller = APIRouter(prefix="/categories", tags=["Categories"])


@categories_controller.get("", response_model=list[schemas.Category])
def get_categories(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> list[schemas.Category]:
    return category_service.get_categories(db, current_user.tenant_id)


@categories_controller.get("/{category_id}", response_model=schemas.Category)
def get_category(
    category_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> schemas.Category:
    try:
        return category_service.get_category(db, current_user.tenant_id, category_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Category not found")


@categories_controller.get("/{category_id}/trend", response_model=list[schemas.CategoryTrend])
def get_category_trend(
    category_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> list[schemas.CategoryTrend]:
    try:
        return category_service.get_category_trend(db, current_user.tenant_id, category_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Category not found")


@categories_controller.get("/{category_id}/services", response_model=list[schemas.CategoryServices])
def get_category_services(
    category_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> list[schemas.CategoryServices]:
    try:
        return category_service.get_category_services(db, current_user.tenant_id, category_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Category not found")


@categories_controller.get("/{category_id}/mom-change", response_model=schemas.MomChange)
def get_category_mom_change(
    category_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> schemas.MomChange:
    try:
        return category_service.get_category_mom_change(db, current_user.tenant_id, category_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Category not found")


@categories_controller.get("/{category_id}/export", response_model=schemas.CategoryExport)
def export_category(
    category_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> schemas.CategoryExport:
    try:
        return category_service.export_category(db, current_user.tenant_id, category_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Category not found")
