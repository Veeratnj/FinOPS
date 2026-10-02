"""
Dashboard schemas for FinOps platform.
"""

from pydantic import BaseModel
from decimal import Decimal
from typing import Optional, List


class DashboardSummary(BaseModel):
    """Dashboard summary metrics."""
    total_spend: Decimal
    month_over_month_change: Decimal
    forecasted_spend: Decimal
    budget_limit: Decimal
    savings_opportunity: Decimal
    anomalies_detected: int


class SpendTrendPoint(BaseModel):
    """Spend trend data point."""
    month: str
    compute: Decimal
    storage: Decimal
    network: Decimal
    kubernetes: Decimal
    database: Decimal


class CostByCategory(BaseModel):
    """Cost breakdown by category."""
    name: str
    value: Decimal
    change: Decimal


class TopService(BaseModel):
    """Top service by cost."""
    name: str
    provider: str
    cost: Decimal
    usage: str
    trend: Decimal


class DashboardRefresh(BaseModel):
    """Dashboard refresh response."""
    message: str
    timestamp: str
