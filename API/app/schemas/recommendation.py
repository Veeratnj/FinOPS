"""
Recommendation schemas.
"""

from pydantic import BaseModel
from decimal import Decimal
from typing import Optional, List


class RecommendationBase(BaseModel):
    """Base recommendation schema."""
    title: str
    category: str
    impact: str
    effort: str
    savings: Decimal
    description: Optional[str] = None


class Recommendation(RecommendationBase):
    """Recommendation response schema."""
    id: str
    status: str
    steps: List[str] = []

    class Config:
        from_attributes = True


class RecommendationUpdate(BaseModel):
    """Update recommendation status."""
    status: str


class RecommendationImpact(BaseModel):
    """Recommendation impact."""
    id: str
    savings: Decimal
    impact: str
    effort: str


class SavingsSummary(BaseModel):
    """Savings summary."""
    total_savings: Decimal
    open: int
    in_progress: int
    done: int
