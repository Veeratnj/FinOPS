"""
Cost and billing schemas.
"""

from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel

from .base import BaseSchema


class CostOverview(BaseSchema):
    """Cost overview schema."""
    total_cost: Decimal
    compute_cost: Decimal
    accelerator_cost: Decimal
    storage_cost: Decimal
    network_cost: Decimal
    llm_token_cost: Decimal
    other_cost: Decimal
    period_start: datetime
    period_end: datetime


class CostByService(BaseSchema):
    """Cost by service schema."""
    service: str
    cost: Decimal
    percentage: Decimal


class CostByJob(BaseSchema):
    """Cost by job schema."""
    job_id: str
    job_name: str
    cost: Decimal
    duration_seconds: Optional[int]


class CostAnomaly(BaseSchema):
    """Cost anomaly schema."""
    date: datetime
    expected_cost: Decimal
    actual_cost: Decimal
    z_score: Decimal
    severity: str  # low, medium, high


class CostTrend(BaseSchema):
    """Cost trend schema."""
    date: datetime
    cost: Decimal
    change_percentage: Optional[Decimal]


class IdleCostSummary(BaseSchema):
    """Idle cost summary schema."""
    total_idle_cost: Decimal
    idle_percentage: Decimal
    potential_savings: Decimal


class JobCostAggregate(BaseSchema):
    """Job cost aggregate schema."""
    id: str
    job_id: str
    compute_cost_usd: Decimal
    accelerator_cost_usd: Decimal
    storage_cost_usd: Decimal
    network_cost_usd: Decimal
    llm_token_cost_usd: Decimal
    other_cost_usd: Decimal
    total_cost_usd: Decimal
    accelerator_utilization_pct: Optional[Decimal]
    idle_cost_usd: Optional[Decimal]
    cost_per_token: Optional[Decimal]
    computed_at: datetime