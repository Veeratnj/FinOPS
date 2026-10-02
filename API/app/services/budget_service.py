"""
Budgets service.
"""

from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from sqlalchemy.orm import Session

from app.models import Budget, BudgetStatus
from app.repositories.budget_repo import budget_repo
from app import schemas


class BudgetService:
    """Budgets service."""

    @staticmethod
    def get_budgets(db: Session, tenant_id: str) -> List[schemas.Budget]:
        """Get all budgets for a tenant."""
        budgets = budget_repo.get_by_tenant(db, tenant_id)
        return [BudgetService._to_schema(b) for b in budgets]

    @staticmethod
    def get_budget(db: Session, tenant_id: str, budget_id: str) -> Optional[schemas.Budget]:
        """Get a specific budget."""
        budget = budget_repo.get(db, budget_id)
        if budget and budget.tenant_id == tenant_id:
            return BudgetService._to_schema(budget)
        return None

    @staticmethod
    def create_budget(
        db: Session, tenant_id: str, budget_in: schemas.BudgetCreate
    ) -> schemas.Budget:
        """Create a new budget."""
        budget_data = budget_in.dict()
        budget_data["tenant_id"] = tenant_id
        budget_data["limit_usd"] = budget_data.pop("limit")
        budget_data["current_spend_usd"] = Decimal("0")  # Start with zero spend
        budget_data["status"] = BudgetStatus.UNDER_BUDGET

        budget = budget_repo.create(db, obj_in=budget_data)
        return BudgetService._to_schema(budget)

    @staticmethod
    def update_budget(
        db: Session, tenant_id: str, budget_id: str, budget_update: schemas.BudgetUpdate
    ) -> Optional[schemas.Budget]:
        """Update a budget."""
        budget = budget_repo.get(db, budget_id)
        if not budget or budget.tenant_id != tenant_id:
            return None

        update_data = budget_update.dict(exclude_unset=True)
        if "limit" in update_data:
            update_data["limit_usd"] = update_data.pop("limit")

        updated_budget = budget_repo.update(db, db_obj=budget, obj_in=update_data)
        return BudgetService._to_schema(updated_budget)

    @staticmethod
    def delete_budget(db: Session, tenant_id: str, budget_id: str) -> bool:
        """Delete a budget."""
        budget = budget_repo.get(db, budget_id)
        if not budget or budget.tenant_id != tenant_id:
            return False

        budget_repo.remove(db, id=budget_id)
        return True

    @staticmethod
    def get_budget_status(db: Session, tenant_id: str) -> List[schemas.BudgetStatus]:
        """Get budget status for all budgets."""
        budgets = budget_repo.get_by_tenant(db, tenant_id)
        return [
            schemas.BudgetStatus(name=b.name, status=b.status.value)
            for b in budgets
        ]

    @staticmethod
    def get_budget_daily_burn_rate(db: Session, tenant_id: str) -> List[schemas.DailyBurnRate]:
        """Get daily burn rate for budgets."""
        burn_rates = budget_repo.calculate_daily_burn_rate(db, tenant_id)
        return [
            schemas.DailyBurnRate(name=item["name"], daily_burn_rate=item["daily_burn_rate"])
            for item in burn_rates
        ]

    @staticmethod
    def create_budget_alert(
        db: Session, tenant_id: str, budget_id: str, alert_settings: schemas.BudgetAlertSettings
    ) -> dict:
        """Create a budget alert."""
        # Verify budget exists and belongs to tenant
        budget = budget_repo.get(db, budget_id)
        if not budget or budget.tenant_id != tenant_id:
            return {"error": "Budget not found"}

        alert = budget_repo.create_budget_alert(
            db, tenant_id, budget_id, alert_settings.threshold, alert_settings.notify_emails
        )
        return {"message": f"Alert set for budget {budget_id}.", "alert_id": alert.id}

    @staticmethod
    def _to_schema(budget: Budget) -> schemas.Budget:
        """Convert Budget model to schema."""
        return schemas.Budget(
            id=budget.id,
            name=budget.name,
            limit=budget.limit_usd,
            owner=budget.owner,
            spent=budget.current_spend_usd,
            forecast=budget.current_spend_usd * Decimal("1.1"),  # Simple forecast calculation
            status=budget.status.value
        )


budget_service = BudgetService()
