"""
Anomaly repository.
"""

from datetime import datetime
from typing import List, Optional

from sqlalchemy import func, and_
from sqlalchemy.orm import Session

from app.models import Anomaly, AnomalyStatus, AnomalySeverity
from app.repositories.base import BaseRepository


class AnomalyRepository(BaseRepository[Anomaly]):
    """Anomaly repository."""

    def get_by_tenant(self, db: Session, tenant_id: str) -> List[Anomaly]:
        """Get all anomalies for a tenant."""
        return db.query(Anomaly).filter(Anomaly.tenant_id == tenant_id).all()

    def get_by_tenant_and_status(
        self, db: Session, tenant_id: str, status: AnomalyStatus
    ) -> List[Anomaly]:
        """Get anomalies by tenant and status."""
        return db.query(Anomaly).filter(
            and_(Anomaly.tenant_id == tenant_id, Anomaly.status == status)
        ).all()

    def get_by_tenant_and_severity(
        self, db: Session, tenant_id: str, severity: AnomalySeverity
    ) -> List[Anomaly]:
        """Get anomalies by tenant and severity."""
        return db.query(Anomaly).filter(
            and_(Anomaly.tenant_id == tenant_id, Anomaly.severity == severity)
        ).all()

    def get_severity_counts(self, db: Session, tenant_id: str) -> List:
        """Get anomaly counts by severity for a tenant."""
        return db.query(
            Anomaly.severity,
            func.count(Anomaly.id).label("count")
        ).filter(Anomaly.tenant_id == tenant_id).group_by(Anomaly.severity).all()

    def get_statistics(self, db: Session, tenant_id: str):
        """Get anomaly statistics for a tenant."""
        return db.query(
            func.count(Anomaly.id).label("total"),
            func.avg(Anomaly.spike_percentage).label("avg_spike")
        ).filter(Anomaly.tenant_id == tenant_id).first()

    def get_by_status_counts(self, db: Session, tenant_id: str):
        """Get anomaly counts by status for alerts summary."""
        return db.query(
            Anomaly.status,
            func.count(Anomaly.id).label("count")
        ).filter(Anomaly.tenant_id == tenant_id).group_by(Anomaly.status).all()

    def update_status(
        self,
        db: Session,
        anomaly_id: str,
        new_status: AnomalyStatus,
        tenant_id: str
    ) -> Optional[Anomaly]:
        """Update anomaly status."""
        anomaly = db.query(Anomaly).filter(
            and_(Anomaly.id == anomaly_id, Anomaly.tenant_id == tenant_id)
        ).first()
        if anomaly:
            anomaly.status = new_status
            db.add(anomaly)
            db.commit()
            db.refresh(anomaly)
        return anomaly

    def get_timeline(self, db: Session, tenant_id: str) -> List[Anomaly]:
        """Get anomalies timeline (most recent first)."""
        return db.query(Anomaly).filter(
            Anomaly.tenant_id == tenant_id
        ).order_by(Anomaly.detected_at.desc()).all()


anomaly_repo = AnomalyRepository(Anomaly)
