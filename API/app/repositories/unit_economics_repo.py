"""
Unit economics repository.
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from app.models import UnitEconomicsRecord
from app.repositories.base import BaseRepository


class UnitEconomicsRepository(BaseRepository[UnitEconomicsRecord]):
    """Unit economics repository."""

    def get_by_tenant(self, db: Session, tenant_id: str) -> List[UnitEconomicsRecord]:
        return db.query(UnitEconomicsRecord).filter(UnitEconomicsRecord.tenant_id == tenant_id).order_by(UnitEconomicsRecord.created_at.asc()).all()


unit_economics_repo = UnitEconomicsRepository(UnitEconomicsRecord)
