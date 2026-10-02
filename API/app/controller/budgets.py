"""Budgets controller."""

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_db, get_current_user
from app import schemas
from app.services.budget_service import budget_service
from sqlalchemy.orm import Session

budgets_controller = APIRouter(prefix="/budgets", tags=["Budgets"])


@budgets_controller.get("", response_model=list[schemas.Budget])
def get_budgets(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> list[schemas.Budget]:
    """Get all budgets for the current tenant."""
    return budget_service.get_budgets(db, current_user.tenant_id)


@budgets_controller.get("/{budget_id}", response_model=schemas.Budget)
def get_budget(
    budget_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> schemas.Budget:
    """Get a specific budget by ID."""
    budget = budget_service.get_budget(db, current_user.tenant_id, budget_id)
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    return budget


@budgets_controller.post("/create", response_model=schemas.Budget, status_code=status.HTTP_201_CREATED)
def create_budget(
    budget_in: schemas.BudgetCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> schemas.Budget:
    """Create a new budget."""
    return budget_service.create_budget(db, current_user.tenant_id, budget_in)


@budgets_controller.put("/{budget_id}/update", response_model=schemas.Budget)
def update_budget(
    budget_id: str,
    budget_update: schemas.BudgetUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> schemas.Budget:
    """Update a budget."""
    budget = budget_service.update_budget(db, current_user.tenant_id, budget_id, budget_update)
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    return budget


@budgets_controller.delete("/{budget_id}")
def delete_budget(
    budget_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> dict[str, str]:
    """Delete a budget."""
    if not budget_service.delete_budget(db, current_user.tenant_id, budget_id):
        raise HTTPException(status_code=404, detail="Budget not found")
    return {"message": f"Budget {budget_id} deleted."}


@budgets_controller.get("/status", response_model=list[schemas.BudgetStatus])
def get_budget_status(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> list[schemas.BudgetStatus]:
    """Get budget status for all budgets."""
    return budget_service.get_budget_status(db, current_user.tenant_id)


@budgets_controller.get("/daily-burn-rate", response_model=list[schemas.DailyBurnRate])
def get_budget_daily_burn_rate(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> list[schemas.DailyBurnRate]:
    """Get daily burn rate for budgets."""
    return budget_service.get_budget_daily_burn_rate(db, current_user.tenant_id)


@budgets_controller.post("/{budget_id}/alerts", status_code=status.HTTP_201_CREATED)
def create_budget_alert(
    budget_id: str,
    alert_settings: schemas.BudgetAlertSettings,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> dict[str, Any]:
    """Create a budget alert."""
    result = budget_service.create_budget_alert(db, current_user.tenant_id, budget_id, alert_settings)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

