"""
Virtual Tag schemas.
"""

from pydantic import BaseModel
from typing import Optional, List


class VirtualTagBase(BaseModel):
    """Base virtual tag schema."""
    provider: str
    raw_key: str
    raw_value: str
    normalized_key: str
    normalized_value: str


class VirtualTag(VirtualTagBase):
    """Virtual tag response schema."""
    id: Optional[str] = None

    class Config:
        from_attributes = True


class TagCoverage(BaseModel):
    """Tag coverage statistics."""
    covered: int
    total: int
    percentage: float


class TagRuleCreate(VirtualTagBase):
    """Create tag rule."""
    pass


class TagRuleUpdate(BaseModel):
    """Update tag rule."""
    normalized_value: Optional[str] = None


class TagMapping(BaseModel):
    """Tag mapping."""
    from_tag: str
    to_tag: str


class TagMappingCreate(BaseModel):
    """Create tag mapping."""
    from_tag: str
    to_tag: str
