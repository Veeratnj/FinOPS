"""
Category repository.
"""

from typing import List

from sqlalchemy import func, and_
from sqlalchemy.orm import Session

from app.models import CostLineItem, CloudAccount, CostLineItemType
from app.repositories.base import BaseRepository


class CategoryRepository(BaseRepository[CostLineItem]):
    """Category repository."""

    def get_category_totals(self, db: Session, tenant_id: str) -> List:
        """Get total cost by category."""
        return (
            db.query(
                CostLineItem.line_item_type,
                func.sum(CostLineItem.cost_usd).label("total_cost")
            )
            .filter(CostLineItem.tenant_id == tenant_id)
            .group_by(CostLineItem.line_item_type)
            .order_by(CostLineItem.line_item_type)
            .all()
        )

    def get_category_total(self, db: Session, tenant_id: str, category: CostLineItemType):
        """Get total cost for a specific category."""
        return (
            db.query(func.coalesce(func.sum(CostLineItem.cost_usd), 0))
            .filter(
                and_(
                    CostLineItem.tenant_id == tenant_id,
                    CostLineItem.line_item_type == category,
                )
            )
            .scalar()
        )

    def get_category_trend(self, db: Session, tenant_id: str, category: CostLineItemType):
        """Get monthly cost trend for a category."""
        return (
            db.query(
                func.date_trunc("month", CostLineItem.usage_start).label("month_start"),
                func.sum(CostLineItem.cost_usd).label("total_cost")
            )
            .filter(
                and_(
                    CostLineItem.tenant_id == tenant_id,
                    CostLineItem.line_item_type == category,
                )
            )
            .group_by(func.date_trunc("month", CostLineItem.usage_start))
            .order_by(func.date_trunc("month", CostLineItem.usage_start))
            .all()
        )

    def get_category_service_breakdown(self, db: Session, tenant_id: str, category: CostLineItemType):
        """Get service-level breakdown for a category."""
        return (
            db.query(
                CostLineItem.service,
                CloudAccount.provider,
                func.sum(CostLineItem.cost_usd).label("cost"),
                func.sum(CostLineItem.usage_amount).label("usage")
            )
            .join(CloudAccount, CostLineItem.cloud_account_id == CloudAccount.id)
            .filter(
                and_(
                    CostLineItem.tenant_id == tenant_id,
                    CostLineItem.line_item_type == category,
                )
            )
            .group_by(CostLineItem.service, CloudAccount.provider)
            .order_by(func.sum(CostLineItem.cost_usd).desc())
            .all()
        )


category_repo = CategoryRepository(CostLineItem)
