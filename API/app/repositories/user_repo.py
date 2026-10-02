from __future__ import annotations

from typing import Optional
from sqlalchemy.orm import Session

from app.models import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    """User repository."""

    def get_by_email(self, db: Session, email: str) -> Optional[User]:
        """Get user by email."""
        return db.query(User).filter(User.email == email).first()

    def get_by_tenant_and_email(self, db: Session, tenant_id: str, email: str) -> Optional[User]:
        """Get user by tenant and email."""
        return db.query(User).filter(
            User.tenant_id == tenant_id,
            User.email == email
        ).first()


user_repo = UserRepository(User)