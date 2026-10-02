"""
Base Pydantic schemas.
"""

from datetime import datetime
from decimal import Decimal
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict


class BaseSchema(BaseModel):
    """Base schema with common configuration."""
    model_config = ConfigDict(
        from_attributes=True,
        protected_namespaces=(),
    )


class TimestampMixin(BaseModel):
    """Mixin for timestamp fields."""
    created_at: datetime
    updated_at: datetime


class PaginatedResponse(BaseModel):
    """Paginated response schema."""
    items: list[Any]
    total: int
    page: int
    size: int
    pages: int