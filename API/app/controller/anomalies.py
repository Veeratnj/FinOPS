"""Anomalies controller."""

from typing import Any

from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_db, get_current_user
from app import schemas
from app.services.anomalies_service import anomalies_service
from sqlalchemy.orm import Session

anomalies_controller = APIRouter(prefix="/anomalies", tags=["Anomalies"])


@anomalies_controller.get("", response_model=list[schemas.Anomaly])
def get_anomalies(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> list[schemas.Anomaly]:
    """Get all anomalies for the current tenant."""
    return anomalies_service.get_anomalies(db, current_user.tenant_id)


@anomalies_controller.get("/{anomaly_id}", response_model=schemas.Anomaly)
def get_anomaly(
    anomaly_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> schemas.Anomaly:
    """Get a specific anomaly by ID."""
    anomaly = anomalies_service.get_anomaly(db, current_user.tenant_id, anomaly_id)
    if not anomaly:
        raise HTTPException(status_code=404, detail="Anomaly not found")
    return anomaly


@anomalies_controller.get("/filter/by-severity", response_model=list[schemas.Anomaly])
def filter_anomalies(
    severity: str | None = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> list[schemas.Anomaly]:
    """Filter anomalies by severity."""
    return anomalies_service.filter_anomalies(db, current_user.tenant_id, severity)


@anomalies_controller.get("/severity-counts", response_model=list[schemas.AnomalySeverity])
def get_anomalies_severity(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> list[schemas.AnomalySeverity]:
    """Get anomaly counts by severity."""
    return anomalies_service.get_anomalies_severity(db, current_user.tenant_id)


@anomalies_controller.put("/{anomaly_id}/acknowledge", response_model=schemas.Anomaly)
def acknowledge_anomaly(
    anomaly_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> schemas.Anomaly:
    """Acknowledge an anomaly."""
    anomaly = anomalies_service.acknowledge_anomaly(db, current_user.tenant_id, anomaly_id)
    if not anomaly:
        raise HTTPException(status_code=404, detail="Anomaly not found")
    return anomaly


@anomalies_controller.put("/{anomaly_id}/resolve", response_model=schemas.Anomaly)
def resolve_anomaly(
    anomaly_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> schemas.Anomaly:
    """Resolve an anomaly."""
    anomaly = anomalies_service.resolve_anomaly(db, current_user.tenant_id, anomaly_id)
    if not anomaly:
        raise HTTPException(status_code=404, detail="Anomaly not found")
    return anomaly


@anomalies_controller.get("/{anomaly_id}/investigate", response_model=schemas.AnomalyInvestigation)
def investigate_anomaly(
    anomaly_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> schemas.AnomalyInvestigation:
    """Get investigation details for an anomaly."""
    investigation = anomalies_service.investigate_anomaly(db, current_user.tenant_id, anomaly_id)
    if not investigation:
        raise HTTPException(status_code=404, detail="Anomaly not found")
    return investigation


@anomalies_controller.get("/timeline/all", response_model=list[schemas.AnomalyTimeline])
def get_anomalies_timeline(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> list[schemas.AnomalyTimeline]:
    """Get anomalies timeline (most recent first)."""
    return anomalies_service.get_anomalies_timeline(db, current_user.tenant_id)


@anomalies_controller.get("/statistics/summary", response_model=schemas.AnomalyStatistics)
def get_anomalies_statistics(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> schemas.AnomalyStatistics:
    """Get anomaly statistics."""
    return anomalies_service.get_anomalies_statistics(db, current_user.tenant_id)


@anomalies_controller.get("/alerts/summary", response_model=schemas.AlertsSummary)
def get_alerts_summary(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> schemas.AlertsSummary:
    """Get alerts summary (active, acknowledged, resolved counts)."""
    return anomalies_service.get_alerts_summary(db, current_user.tenant_id)

