"""
Category service.
"""

from decimal import Decimal
from typing import List

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import CostLineItemType, CostLineItem, CloudAccount
from app.repositories.category_repo import category_repo
from app import schemas


class CategoryService:
    """Category service."""

    @staticmethod
    def get_categories(db: Session, tenant_id: str) -> List[schemas.Category]:
        """Get category summaries."""
        totals = category_repo.get_category_totals(db, tenant_id)
        categories = []
        for category_type, total_cost in totals:
            categories.append(
                schemas.Category(
                    id=category_type.value,
                    name=category_type.value.capitalize(),
                    value=total_cost,
                    change=CategoryService._compute_mom_change(db, tenant_id, category_type),
                )
            )
        return categories

    @staticmethod
    def get_category(db: Session, tenant_id: str, category_id: str) -> schemas.Category:
        """Get a specific category summary."""
        category_type = CategoryService._resolve_category(category_id)
        total = category_repo.get_category_total(db, tenant_id, category_type)
        return schemas.Category(
            id=category_type.value,
            name=category_type.value.capitalize(),
            value=total,
            change=CategoryService._compute_mom_change(db, tenant_id, category_type),
        )

    @staticmethod
    def get_category_trend(
        db: Session, tenant_id: str, category_id: str
    ) -> List[schemas.CategoryTrend]:
        """Get category monthly trend."""
        category_type = CategoryService._resolve_category(category_id)
        trend_rows = category_repo.get_category_trend(db, tenant_id, category_type)
        return [
            schemas.CategoryTrend(
                month=row.month_start.strftime("%b %Y"),
                value=row.total_cost,
            )
            for row in trend_rows
        ]

    @staticmethod
    def get_category_services(
        db: Session, tenant_id: str, category_id: str
    ) -> List[schemas.CategoryServices]:
        """Get service-level breakdown for a category."""
        category_type = CategoryService._resolve_category(category_id)
        services = category_repo.get_category_service_breakdown(db, tenant_id, category_type)
        return [
            schemas.CategoryServices(
                name=row.service,
                provider=row.provider,
                cost=row.cost,
                usage=f"{row.usage:.2f}" if row.usage is not None else "0.00",
                trend=CategoryService._service_trend(db, tenant_id, category_type, row.service),
            )
            for row in services
        ]

    @staticmethod
    def get_category_mom_change(
        db: Session, tenant_id: str, category_id: str
    ) -> schemas.MomChange:
        """Get month-over-month change for a category."""
        category_type = CategoryService._resolve_category(category_id)
        change = CategoryService._compute_mom_change(db, tenant_id, category_type)
        return schemas.MomChange(category=category_type.value.capitalize(), change=change)

    @staticmethod
    def export_category(
        db: Session, tenant_id: str, category_id: str
    ) -> schemas.CategoryExport:
        """Return export metadata for a category."""
        category_type = CategoryService._resolve_category(category_id)
        return schemas.CategoryExport(
            download_url=f"/exports/{category_type.value}_category_export.csv"
        )

    @staticmethod
    def _resolve_category(category_id: str) -> CostLineItemType:
        """Resolve string category id to enum."""
        return CostLineItemType(category_id.lower())

    @staticmethod
    def _compute_mom_change(db: Session, tenant_id: str, category: CostLineItemType) -> Decimal:
        """Compute month-over-month percentage change."""
        trend = category_repo.get_category_trend(db, tenant_id, category)
        if len(trend) < 2:
            return Decimal("0")

        last = Decimal(str(trend[-1].total_cost or 0))
        previous = Decimal(str(trend[-2].total_cost or 0))
        if previous == 0:
            return Decimal("0")

        return ((last - previous) / previous * Decimal("100")).quantize(Decimal("0.01"))

    @staticmethod
    def _service_trend(db: Session, tenant_id: str, category: CostLineItemType, service_name: str) -> Decimal:
        """Compute a simple trend number for a service."""
        trend_rows = (
            db.query(
                func.date_trunc("month", CostLineItem.usage_start).label("month_start"),
                func.sum(CostLineItem.cost_usd).label("total_cost")
            )
            .join(CloudAccount, CostLineItem.cloud_account_id == CloudAccount.id)
            .filter(
                CostLineItem.tenant_id == tenant_id,
                CostLineItem.line_item_type == category,
                CostLineItem.service == service_name,
            )
            .group_by(func.date_trunc("month", CostLineItem.usage_start))
            .order_by(func.date_trunc("month", CostLineItem.usage_start))
            .all()
        )
        if len(trend_rows) < 2:
            return Decimal("0")

        last = Decimal(str(trend_rows[-1].total_cost or 0))
        previous = Decimal(str(trend_rows[-2].total_cost or 0))
        if previous == 0:
            return Decimal("0")

        return ((last - previous) / previous * Decimal("100")).quantize(Decimal("0.01"))


category_service = CategoryService()
