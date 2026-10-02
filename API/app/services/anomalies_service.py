"""
Anomalies service.
"""

from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from sqlalchemy.orm import Session

from app.models import Anomaly, AnomalyStatus, AnomalySeverity
from app.repositories.anomaly_repo import anomaly_repo
from app import schemas


class AnomaliesService:
    """Anomalies service."""

    @staticmethod
    def get_anomalies(db: Session, tenant_id: str) -> List[schemas.Anomaly]:
        """Get all anomalies for a tenant."""
        anomalies = anomaly_repo.get_by_tenant(db, tenant_id)
        return [AnomaliesService._to_schema(a) for a in anomalies]

    @staticmethod
    def get_anomaly(db: Session, tenant_id: str, anomaly_id: str) -> Optional[schemas.Anomaly]:
        """Get a specific anomaly."""
        anomaly = anomaly_repo.get(db, anomaly_id)
        if anomaly and anomaly.tenant_id == tenant_id:
            return AnomaliesService._to_schema(anomaly)
        return None

    @staticmethod
    def filter_anomalies(
        db: Session, tenant_id: str, severity: Optional[str] = None
    ) -> List[schemas.Anomaly]:
        """Filter anomalies by severity."""
        if severity:
            anomalies = anomaly_repo.get_by_tenant_and_severity(
                db, tenant_id, AnomalySeverity(severity)
            )
        else:
            anomalies = anomaly_repo.get_by_tenant(db, tenant_id)
        return [AnomaliesService._to_schema(a) for a in anomalies]

    @staticmethod
    def get_anomalies_severity(db: Session, tenant_id: str) -> List[schemas.AnomalySeverity]:
        """Get anomaly counts by severity."""
        severity_counts = anomaly_repo.get_severity_counts(db, tenant_id)
        return [
            schemas.AnomalySeverity(severity=item[0].value, count=item[1])
            for item in severity_counts
        ]

    @staticmethod
    def acknowledge_anomaly(
        db: Session, tenant_id: str, anomaly_id: str
    ) -> Optional[schemas.Anomaly]:
        """Acknowledge an anomaly."""
        anomaly = anomaly_repo.update_status(
            db, anomaly_id, AnomalyStatus.ACKNOWLEDGED, tenant_id
        )
        if anomaly:
            return AnomaliesService._to_schema(anomaly)
        return None

    @staticmethod
    def resolve_anomaly(
        db: Session, tenant_id: str, anomaly_id: str
    ) -> Optional[schemas.Anomaly]:
        """Resolve an anomaly."""
        anomaly = anomaly_repo.update_status(
            db, anomaly_id, AnomalyStatus.RESOLVED, tenant_id
        )
        if anomaly:
            return AnomaliesService._to_schema(anomaly)
        return None

    @staticmethod
    def investigate_anomaly(
        db: Session, tenant_id: str, anomaly_id: str
    ) -> Optional[schemas.AnomalyInvestigation]:
        """Get investigation details for an anomaly."""
        anomaly = anomaly_repo.get(db, anomaly_id)
        if anomaly and anomaly.tenant_id == tenant_id:
            return schemas.AnomalyInvestigation(
                id=anomaly.id,
                investigation={"steps": anomaly.investigation_steps or []}
            )
        return None

    @staticmethod
    def get_anomalies_timeline(db: Session, tenant_id: str) -> List[schemas.AnomalyTimeline]:
        """Get anomalies timeline."""
        anomalies = anomaly_repo.get_timeline(db, tenant_id)
        return [
            schemas.AnomalyTimeline(
                id=a.id,
                service=a.service,
                detected_at=a.detected_at,
                severity=a.severity.value,
                spike=a.spike_percentage
            )
            for a in anomalies
        ]

    @staticmethod
    def get_anomalies_statistics(db: Session, tenant_id: str) -> schemas.AnomalyStatistics:
        """Get anomaly statistics."""
        stats = anomaly_repo.get_statistics(db, tenant_id)
        severity_breakdown = anomaly_repo.get_severity_counts(db, tenant_id)
        
        by_severity = {
            item[0].value: item[1] for item in severity_breakdown
        }
        
        return schemas.AnomalyStatistics(
            total=stats[0] or 0,
            avg_spike=Decimal(str(stats[1])) if stats[1] else Decimal("0"),
            by_severity=by_severity
        )

    @staticmethod
    def get_alerts_summary(db: Session, tenant_id: str) -> schemas.AlertsSummary:
        """Get alerts summary (active, acknowledged, resolved counts)."""
        status_counts = anomaly_repo.get_by_status_counts(db, tenant_id)
        
        summary = {AnomalyStatus.OPEN.value: 0, AnomalyStatus.ACKNOWLEDGED.value: 0, AnomalyStatus.RESOLVED.value: 0}
        for status, count in status_counts:
            summary[status.value] = count
        
        return schemas.AlertsSummary(
            active=summary[AnomalyStatus.OPEN.value],
            acknowledged=summary[AnomalyStatus.ACKNOWLEDGED.value],
            resolved=summary[AnomalyStatus.RESOLVED.value]
        )

    @staticmethod
    def _to_schema(anomaly: Anomaly) -> schemas.Anomaly:
        """Convert Anomaly model to schema."""
        return schemas.Anomaly(
            id=anomaly.id,
            service=anomaly.service,
            detected_at=anomaly.detected_at,
            severity=anomaly.severity.value,
            spike=anomaly.spike_percentage,
            description=anomaly.description,
            data=anomaly.data or [],
            status=anomaly.status.value
        )


anomalies_service = AnomaliesService()
