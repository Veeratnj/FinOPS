"""
Unit Economics schemas.
"""

from pydantic import BaseModel
from decimal import Decimal
from typing import Optional, List


class UnitEconomicsSummary(BaseModel):
    """Unit economics summary."""
    month: str
    cost_per_user: Decimal
    cost_per_transaction: Decimal
    revenue: Decimal
    margin: Decimal


class CostPerUserTrend(BaseModel):
    """Cost per user trend."""
    month: str
    value: Decimal


class CostPerTransactionTrend(BaseModel):
    """Cost per transaction trend."""
    month: str
    value: Decimal


class GrossMargin(BaseModel):
    """Gross margin."""
    month: str
    margin: Decimal
    revenue: Decimal


class BenchmarkComparison(BaseModel):
    """Benchmark comparison."""
    industry: dict
    yours: dict


class UnitEconomicsTrend(BaseModel):
    """Unit economics trend."""
    month: str
    cost_per_user: Decimal
    cost_per_transaction: Decimal
    margin: Decimal
    revenue: Decimal
