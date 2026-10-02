"""
Cost analyzer repository.
"""

from decimal import Decimal
from typing import List, Optional

from sqlalchemy import func, and_, or_
from sqlalchemy.orm import Session

from app.models import CostLineItem, CloudAccount, CostLineItemType
from app.repositories.base import BaseRepository


class CostAnalyzerRepository(BaseRepository[CostLineItem]):
    """Cost analyzer repository."""

    def get_services(self, db: Session, tenant_id: str) -> List:
        """Get all services with cost information."""
        return (
            db.query(
                CostLineItem.service,
                CloudAccount.provider,
                func.sum(CostLineItem.cost_usd).label("cost"),
                func.sum(CostLineItem.usage_amount).label("usage_amount"),
                func.avg(CostLineItem.usage_amount).label("avg_usage")
            )
            .join(CloudAccount, CostLineItem.cloud_account_id == CloudAccount.id)
            .filter(CostLineItem.tenant_id == tenant_id)
            .group_by(CostLineItem.service, CloudAccount.provider)
            .order_by(func.sum(CostLineItem.cost_usd).desc())
            .all()
        )

    def get_services_filtered(
        self, db: Session, tenant_id: str, provider: Optional[str] = None, min_cost: Optional[Decimal] = None
    ) -> List:
        """Get filtered services."""
        query = (
            db.query(
                CostLineItem.service,
                CloudAccount.provider,
                func.sum(CostLineItem.cost_usd).label("cost"),
                func.sum(CostLineItem.usage_amount).label("usage_amount"),
                func.avg(CostLineItem.usage_amount).label("avg_usage")
            )
            .join(CloudAccount, CostLineItem.cloud_account_id == CloudAccount.id)
            .filter(CostLineItem.tenant_id == tenant_id)
            .group_by(CostLineItem.service, CloudAccount.provider)
        )

        if provider:
            query = query.filter(CloudAccount.provider == provider)

        if min_cost:
            query = query.having(func.sum(CostLineItem.cost_usd) >= min_cost)

        return query.order_by(func.sum(CostLineItem.cost_usd).desc()).all()

    def get_service_by_id(self, db: Session, tenant_id: str, service_id: str) -> Optional[tuple]:
        """Get a specific service by ID (service name)."""
        return (
            db.query(
                CostLineItem.service,
                CloudAccount.provider,
                func.sum(CostLineItem.cost_usd).label("cost"),
                func.sum(CostLineItem.usage_amount).label("usage_amount"),
                func.avg(CostLineItem.usage_amount).label("avg_usage")
            )
            .join(CloudAccount, CostLineItem.cloud_account_id == CloudAccount.id)
            .filter(
                and_(CostLineItem.tenant_id == tenant_id, CostLineItem.service == service_id)
            )
            .group_by(CostLineItem.service, CloudAccount.provider)
            .first()
        )

    def get_cost_by_provider(self, db: Session, tenant_id: str) -> List:
        """Get cost breakdown by provider."""
        return (
            db.query(
                CloudAccount.provider,
                func.sum(CostLineItem.cost_usd).label("cost")
            )
            .join(CostLineItem, CloudAccount.id == CostLineItem.cloud_account_id)
            .filter(CostLineItem.tenant_id == tenant_id)
            .group_by(CloudAccount.provider)
            .order_by(func.sum(CostLineItem.cost_usd).desc())
            .all()
        )

    def get_cost_by_category(self, db: Session, tenant_id: str) -> List:
        """Get cost breakdown by category."""
        return (
            db.query(
                CostLineItem.line_item_type,
                func.sum(CostLineItem.cost_usd).label("value")
            )
            .filter(CostLineItem.tenant_id == tenant_id)
            .group_by(CostLineItem.line_item_type)
            .order_by(CostLineItem.line_item_type)
            .all()
        )

    def get_usage_metrics(self, db: Session, tenant_id: str) -> List:
        """Get usage metrics."""
        return (
            db.query(
                CostLineItem.service,
                func.sum(CostLineItem.usage_amount).label("usage_amount"),
                func.sum(CostLineItem.cost_usd).label("cost")
            )
            .filter(CostLineItem.tenant_id == tenant_id)
            .group_by(CostLineItem.service)
            .order_by(func.sum(CostLineItem.cost_usd).desc())
            .all()
        )

    def get_provider_comparison(self, db: Session, tenant_id: str) -> List:
        """Get provider comparison with services."""
        providers = (
            db.query(CloudAccount.provider)
            .join(CostLineItem, CloudAccount.id == CostLineItem.cloud_account_id)
            .filter(CostLineItem.tenant_id == tenant_id)
            .distinct()
            .all()
        )

        result = []
        for (provider,) in providers:
            services = (
                db.query(
                    CostLineItem.service,
                    CloudAccount.provider,
                    func.sum(CostLineItem.cost_usd).label("cost"),
                    func.sum(CostLineItem.usage_amount).label("usage_amount"),
                    func.avg(CostLineItem.usage_amount).label("avg_usage")
                )
                .join(CloudAccount, CostLineItem.cloud_account_id == CloudAccount.id)
                .filter(
                    and_(CostLineItem.tenant_id == tenant_id, CloudAccount.provider == provider)
                )
                .group_by(CostLineItem.service, CloudAccount.provider)
                .order_by(func.sum(CostLineItem.cost_usd).desc())
                .all()
            )
            result.append((provider, services))

        return result

    def get_service_trend(self, db: Session, tenant_id: str, service_name: str) -> Decimal:
        """Calculate service cost trend (simplified)."""
        # Get current month and previous month costs
        current_month = (
            db.query(func.sum(CostLineItem.cost_usd))
            .filter(
                and_(
                    CostLineItem.tenant_id == tenant_id,
                    CostLineItem.service == service_name,
                    func.extract("month", CostLineItem.usage_start) == func.extract("month", func.now()),
                    func.extract("year", CostLineItem.usage_start) == func.extract("year", func.now())
                )
            )
            .scalar()
        )

        prev_month = (
            db.query(func.sum(CostLineItem.cost_usd))
            .filter(
                and_(
                    CostLineItem.tenant_id == tenant_id,
                    CostLineItem.service == service_name,
                    func.extract("month", CostLineItem.usage_start) == func.extract("month", func.now()) - 1,
                    func.extract("year", CostLineItem.usage_start) == func.extract("year", func.now())
                )
            )
            .scalar()
        )

        if not prev_month or prev_month == 0:
            return Decimal("0")

        return ((Decimal(str(current_month or 0)) - Decimal(str(prev_month))) / Decimal(str(prev_month)) * Decimal("100")).quantize(Decimal("0.01"))


cost_analyzer_repo = CostAnalyzerRepository(CostLineItem)
