"""
Forecasting repository.
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from app.models import ForecastingDriver, ForecastingAccuracy
from app.repositories.base import BaseRepository


class ForecastingRepository:
    """Forecasting repository."""

    def get_drivers(self, db: Session, tenant_id: str) -> List[ForecastingDriver]:
        return db.query(ForecastingDriver).filter(ForecastingDriver.tenant_id == tenant_id).all()

    def get_accuracy(self, db: Session, tenant_id: str) -> Optional[ForecastingAccuracy]:
        return db.query(ForecastingAccuracy).filter(ForecastingAccuracy.tenant_id == tenant_id).order_by(ForecastingAccuracy.last_evaluated_at.desc()).first()


forecasting_repo = ForecastingRepository()
