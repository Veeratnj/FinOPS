"""
Anomaly schemas.
"""

from pydantic import BaseModel
from decimal import Decimal
from typing import Optional, List
from datetime import datetime


class AnomalyBase(BaseModel):
    """Base anomaly schema."""
    service: str
    severity: str
    spike: Decimal
    description: str


class Anomaly(AnomalyBase):
    """Anomaly response schema."""
    id: str
    detected_at: datetime
    data: List[float] = []
    status: str

    class Config:
        from_attributes = True


class AnomalySeverity(BaseModel):
    """Anomaly severity count."""
    severity: str
    count: int


class AnomalyInvestigation(BaseModel):
    """Anomaly investigation details."""
    id: str
    investigation: dict


class AnomalyTimeline(BaseModel):
    """Anomaly timeline entry."""
    id: str
    service: str
    detected_at: datetime
    severity: str
    spike: Decimal


class AnomalyStatistics(BaseModel):
    """Anomaly statistics."""
    total: int
    avg_spike: Decimal
    by_severity: dict


class AlertsSummary(BaseModel):
    """Alerts summary."""
    active: int
    acknowledged: int
    resolved: int
