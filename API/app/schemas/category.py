"""
Category schemas.
"""

from pydantic import BaseModel
from decimal import Decimal
from typing import Optional, List


class CategoryBase(BaseModel):
    """Base category schema."""
    name: str
    value: Decimal
    change: Decimal


class Category(CategoryBase):
    """Category response schema."""
    id: Optional[str] = None

    class Config:
        from_attributes = True


class CategoryTrend(BaseModel):
    """Category trend data point."""
    month: str
    value: Decimal


class CategoryServices(BaseModel):
    """Services in category."""
    name: str
    provider: str
    cost: Decimal
    usage: str
    trend: Decimal


class CategoryExport(BaseModel):
    """Category export response."""
    download_url: str


class MomChange(BaseModel):
    """Month-over-month change."""
    category: str
    change: Decimal
