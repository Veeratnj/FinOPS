"""
Budget repository.
"""

from datetime import datetime
from typing import List, Optional

from sqlalchemy import func, and_
from sqlalchemy.orm import Session

from app.models import Budget, BudgetAlert, BudgetStatus
from app.repositories.base import BaseRepository


class BudgetRepository(BaseRepository[Budget]):
    """Budget repository."""

    def get_by_tenant(self, db: Session, tenant_id: str) -> List[Budget]:
        """Get all budgets for a tenant."""
        return db.query(Budget).filter(Budget.tenant_id == tenant_id).all()

    def get_by_tenant_and_status(
        self, db: Session, tenant_id: str, status: BudgetStatus
    ) -> List[Budget]:
        """Get budgets by tenant and status."""
        return db.query(Budget).filter(
            and_(Budget.tenant_id == tenant_id, Budget.status == status)
        ).all()

    def get_status_counts(self, db: Session, tenant_id: str) -> List:
        """Get budget counts by status for a tenant."""
        return db.query(
            Budget.status,
            func.count(Budget.id).label("count")
        ).filter(Budget.tenant_id == tenant_id).group_by(Budget.status).all()

    def calculate_daily_burn_rate(self, db: Session, tenant_id: str) -> List:
        """Calculate daily burn rate for budgets (simplified calculation)."""
        # This would typically involve more complex calculations based on historical data
        # For now, return a simple calculation based on current spend
        budgets = db.query(Budget).filter(Budget.tenant_id == tenant_id).all()
        result = []
        for budget in budgets:
            # Simplified: assume 30-day month, calculate daily rate
            daily_rate = float(budget.current_spend_usd) / 30
            result.append({
                "name": budget.name,
                "daily_burn_rate": f"{daily_rate:.2f}"
            })
        return result

    def create_budget_alert(
        self, db: Session, tenant_id: str, budget_id: str, threshold_pct: int, notify_emails: List[str]
    ) -> BudgetAlert:
        """Create a budget alert."""
        alert = BudgetAlert(
            tenant_id=tenant_id,
            budget_id=budget_id,
            threshold_pct=threshold_pct,
            notify_emails=notify_emails
        )
        db.add(alert)
        db.commit()
        db.refresh(alert)
        return alert

    def get_budget_alerts(self, db: Session, tenant_id: str, budget_id: str) -> List[BudgetAlert]:
        """Get alerts for a specific budget."""
        return db.query(BudgetAlert).filter(
            and_(BudgetAlert.tenant_id == tenant_id, BudgetAlert.budget_id == budget_id)
        ).all()


budget_repo = BudgetRepository(Budget)
