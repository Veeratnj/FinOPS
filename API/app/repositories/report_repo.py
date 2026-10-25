"""
Report repository.
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from app.models import Report, ReportFrequency, ReportFormat
from app.repositories.base import BaseRepository


class ReportRepository(BaseRepository[Report]):
    """Report repository."""

    def get_by_tenant(self, db: Session, tenant_id: str) -> List[Report]:
        return db.query(Report).filter(Report.tenant_id == tenant_id).all()

    def get_active_reports(self, db: Session, tenant_id: str) -> List[Report]:
        return db.query(Report).filter(Report.tenant_id == tenant_id, Report.is_active == True).all()


report_repo = ReportRepository(Report)
