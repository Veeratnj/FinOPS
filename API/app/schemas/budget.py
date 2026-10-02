"""
Budget schemas.
"""

from pydantic import BaseModel
from decimal import Decimal
from typing import Optional, List
from datetime import datetime


class BudgetBase(BaseModel):
    """Base budget schema."""
    name: str
    limit: Decimal
    owner: str


class Budget(BudgetBase):
    """Budget response schema."""
    id: str
    spent: Decimal
    forecast: Decimal
    status: str

    class Config:
        from_attributes = True


class BudgetCreate(BudgetBase):
    """Create budget request."""
    pass


class BudgetUpdate(BaseModel):
    """Update budget request."""
    limit: Optional[Decimal] = None


class BudgetStatus(BaseModel):
    """Budget status."""
    name: str
    status: str


class DailyBurnRate(BaseModel):
    """Daily burn rate."""
    name: str
    daily_burn_rate: str


class BudgetAlertSettings(BaseModel):
    """Budget alert settings."""
    threshold: int
    notify_emails: List[str]
