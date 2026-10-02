"""
Cost Allocation schemas.
"""

from pydantic import BaseModel
from decimal import Decimal
from typing import Optional, List


class TeamBase(BaseModel):
    """Base team schema."""
    name: str
    department: str


class Team(TeamBase):
    """Team response schema."""
    id: str
    allocated: Decimal
    actual: Decimal
    variance: Decimal
    services: int

    class Config:
        from_attributes = True


class TeamBreakdown(BaseModel):
    """Team cost breakdown."""
    team: str
    breakdown: dict


class CostAllocationRuleBase(BaseModel):
    """Base cost allocation rule schema."""
    name: str
    tag: str
    target: str
    category: str


class CostAllocationRule(CostAllocationRuleBase):
    """Cost allocation rule response schema."""
    id: str

    class Config:
        from_attributes = True


class CostAllocationRuleUpdate(BaseModel):
    """Update cost allocation rule."""
    category: Optional[str] = None


class TreemapNode(BaseModel):
    """Treemap node."""
    name: str
    value: Decimal
    department: str


class ChargebackEntry(BaseModel):
    """Chargeback entry."""
    team: str
    chargeback: Decimal


class VarianceAnalysis(BaseModel):
    """Variance analysis."""
    team: str
    allocated: Decimal
    actual: Decimal
    variance: Decimal
