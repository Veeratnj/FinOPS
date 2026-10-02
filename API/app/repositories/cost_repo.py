"""
Cost repository.
"""

from datetime import datetime
from typing import List, Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import CostLineItem, JobCostAggregate
from app.repositories.base import BaseRepository


class CostRepository(BaseRepository[CostLineItem]):
    """Cost repository."""

    def get_cost_overview(
        self, db: Session, tenant_id: str, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None
    ):
        """Get cost overview for tenant."""
        query = db.query(
            func.sum(CostLineItem.cost_usd).label("total_cost"),
            func.sum(
                CostLineItem.cost_usd
            ).filter(CostLineItem.line_item_type == "compute").label("compute_cost"),
            func.sum(
                CostLineItem.cost_usd
            ).filter(CostLineItem.line_item_type == "memory").label("memory_cost"),
        ).filter(CostLineItem.tenant_id == tenant_id)

        if start_date:
            query = query.filter(CostLineItem.usage_start >= start_date)
        if end_date:
            query = query.filter(CostLineItem.usage_end <= end_date)

        return query.first()

    def get_cost_by_service(
        self, db: Session, tenant_id: str, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None
    ) -> List:
        """Get cost breakdown by service."""
        query = db.query(
            CostLineItem.service,
            func.sum(CostLineItem.cost_usd).label("cost")
        ).filter(CostLineItem.tenant_id == tenant_id)

        if start_date:
            query = query.filter(CostLineItem.usage_start >= start_date)
        if end_date:
            query = query.filter(CostLineItem.usage_end <= end_date)

        return query.group_by(CostLineItem.service).all()

    def get_top_expensive_jobs(
        self, db: Session, tenant_id: str, limit: int = 10
    ) -> List[JobCostAggregate]:
        """Get top expensive jobs."""
        return (
            db.query(JobCostAggregate)
            .filter(JobCostAggregate.tenant_id == tenant_id)
            .order_by(JobCostAggregate.total_cost_usd.desc())
            .limit(limit)
            .all()
        )


cost_repo = CostRepository(CostLineItem)