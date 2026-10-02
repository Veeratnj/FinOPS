"""
Cost Analyzer schemas.
"""

from pydantic import BaseModel
from decimal import Decimal
from typing import Optional, List


class ServiceCost(BaseModel):
    """Service cost information."""
    name: str
    provider: str
    cost: Decimal
    usage: str
    trend: Decimal


class CostByProvider(BaseModel):
    """Cost breakdown by provider."""
    provider: str
    cost: Decimal


class UsageMetric(BaseModel):
    """Usage metric information."""
    name: str
    usage: str
    cost: Decimal


class ServiceExportResponse(BaseModel):
    """Service export response."""
    download_url: str
    generated_at: str


class ProviderComparison(BaseModel):
    """Provider comparison."""
    provider: str
    services: List[ServiceCost]
