"""
Tenant schemas.
"""

from typing import Dict, Optional

from pydantic import BaseModel, field_validator

from app.core.security import validate_password
from .base import BaseSchema, TimestampMixin


class TenantBase(BaseSchema):
    """Base tenant schema."""
    name: str
    slug: str
    plan: str
    is_active: bool = True
    metadata_: Optional[Dict] = {}


class TenantCreate(BaseModel):
    """Tenant creation schema."""
    name: str
    slug: str
    plan: str = "starter"


class OrgAdminCreate(BaseModel):
    """Organization creation with admin user."""
    org_name: str
    org_slug: str
    org_plan: str = "starter"
    admin_email: str
    admin_password: str
    admin_name: str

    @field_validator("admin_password")
    def validate_admin_password(cls, value: str) -> str:
        return validate_password(value)


class TenantUpdate(BaseModel):
    """Tenant update schema."""
    name: Optional[str] = None
    plan: Optional[str] = None
    is_active: Optional[bool] = None
    metadata_: Optional[Dict] = None


class Tenant(TenantBase, TimestampMixin):
    """Tenant response schema."""
    id: str