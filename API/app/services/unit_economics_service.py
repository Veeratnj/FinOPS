"""
Unit economics service.
"""

from typing import List, Optional, Any
from sqlalchemy.orm import Session
from app.repositories.unit_economics_repo import unit_economics_repo
from app.models import UnitEconomicsRecord


class UnitEconomicsService:
    @staticmethod
    def get_trends(db: Session, tenant_id: str) -> List[dict[str, Any]]:
        records = unit_economics_repo.get_by_tenant(db, tenant_id)
        return [
            {
                "id": r.id,
                "month": r.month,
                "costPerUser": float(r.cost_per_user),
                "costPerTransaction": float(r.cost_per_transaction),
                "revenue": float(r.revenue),
                "margin": float(r.margin),
            }
            for r in records
        ]

    get_all = get_trends

    @staticmethod
    def get_summary(db: Session, tenant_id: str) -> dict[str, Any]:
        records = unit_economics_repo.get_by_tenant(db, tenant_id)
        if records:
            latest = records[-1]
            return {
                "month": latest.month,
                "costPerUser": float(latest.cost_per_user),
                "costPerTransaction": float(latest.cost_per_transaction),
                "revenue": float(latest.revenue),
                "margin": float(latest.margin),
            }
        return {
            "month": "Current",
            "costPerUser": 2.78,
            "costPerTransaction": 0.0040,
            "revenue": 1260000,
            "margin": 71.8,
        }


unit_economics_service = UnitEconomicsService()
