"""
User schemas.
"""

from typing import Optional

from pydantic import BaseModel, EmailStr, field_validator

from app.core.security import validate_password
from .base import BaseSchema, TimestampMixin


class UserBase(BaseSchema):
    """Base user schema."""
    email: EmailStr
    role: str
    is_active: bool = True


class UserCreate(BaseModel):
    """User creation schema."""
    email: EmailStr
    password: str
    role: str = "viewer"
    tenant_id: str

    @field_validator("password")
    def validate_password(cls, value: str) -> str:
        return validate_password(value)


class UserUpdate(BaseModel):
    """User update schema."""
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None


class User(UserBase, TimestampMixin):
    """User response schema."""
    id: str
    tenant_id: str