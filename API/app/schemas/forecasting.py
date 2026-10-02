"""
Forecasting schemas.
"""

from pydantic import BaseModel
from decimal import Decimal
from typing import Optional, List
from datetime import datetime


class ForecastPoint(BaseModel):
    """Forecast data point."""
    month: str
    spend: Decimal
    lower: Optional[Decimal] = None
    upper: Optional[Decimal] = None


class ForecastScenario(BaseModel):
    """Forecast scenario."""
    base: List[ForecastPoint]
    optimistic: List[ForecastPoint]
    pessimistic: List[ForecastPoint]


class WhatIfAssumptions(BaseModel):
    """What-if analysis assumptions."""
    assumptions: dict


class WhatIfResult(BaseModel):
    """What-if analysis result."""
    scenario: str
    projected_spend: Decimal
    savings: Decimal


class CostDriver(BaseModel):
    """Cost driver for forecasting."""
    service: str
    impact: Decimal
    direction: str
    reason: str


class CostDriverUpdate(BaseModel):
    """Update cost driver."""
    impact: Optional[Decimal] = None
    reason: Optional[str] = None


class ForecastAccuracy(BaseModel):
    """Forecast accuracy metrics."""
    mape: Decimal
    rmse: Decimal
    last_evaluated: str


class HistoricalAccuracy(BaseModel):
    """Historical forecast accuracy."""
    month: str
    spend: Decimal
