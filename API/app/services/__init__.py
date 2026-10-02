from datetime import timedelta

from sqlalchemy.orm import Session

from app import models, schemas

from app import models

from .auth_service import AuthService
from .tenant_service import TenantService

__all__ = ["AuthService", "TenantService"]
from app.core import security
from app.core.config import settings
from app.core.security import pwd_context
from app.repositories.user_repo import user_repo


class AuthService:
    """Authentication service."""

    def authenticate_user(self, db: Session, email: str, password: str) -> models.User | None:
        """Authenticate user with email and password."""
        user = user_repo.get_by_email(db, email=email)
        if not user:
            return None
        if not pwd_context.verify(password, user.password_hash):
            return None
        return user

    def create_access_token(self, user: models.User) -> str:
        """Create access token for user."""
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        return security.create_access_token(
            user.id,
            expires_delta=access_token_expires,
            extra_claims={"tenant_id": user.tenant_id}
        )

    def create_refresh_token(self, user: models.User) -> str:
        """Create refresh token for user."""
        refresh_token_expires = timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
        return security.create_refresh_token(
            user.id,
            expires_delta=refresh_token_expires,
            extra_claims={"tenant_id": user.tenant_id}
        )

    def login(self, db: Session, email: str, password: str) -> schemas.Token | None:
        """Login user and return tokens."""
        user = self.authenticate_user(db, email, password)
        if not user or not user.is_active:
            return None

        access_token = self.create_access_token(user)
        refresh_token = self.create_refresh_token(user)

        return schemas.Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=user,
        )

    def refresh_access_token(self, db: Session, refresh_token: str) -> schemas.Token | None:
        """Refresh access token using refresh token."""
        try:
            payload = security.verify_token(refresh_token)
            if payload.get("type") != "refresh":
                return None
            user_id = payload.get("sub")
            tenant_id = payload.get("tenant_id")
        except Exception:
            return None

        user = user_repo.get(db, id=user_id)
        if not user or not user.is_active:
            return None

        access_token = self.create_access_token(user)
        new_refresh_token = self.create_refresh_token(user)

        return schemas.Token(
            access_token=access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
            user=user,
        )

    def create_user(self, db: Session, user_in: schemas.UserCreate) -> models.User:
        """Create a new user."""
        # Check if user already exists
        existing_user = user_repo.get_by_email(db, email=user_in.email)
        if existing_user:
            raise ValueError("User with this email already exists")

        # Hash password
        hashed_password = security.get_password_hash(user_in.password)
        
        # Create user
        user_data = user_in.model_dump()
        user_data["password_hash"] = hashed_password
        del user_data["password"]
        
        user = user_repo.create(db, obj_in=schemas.UserCreate(**user_data))
        return user

    def logout(self, db: Session, user_id: str) -> bool:
        """Logout user (could implement token blacklisting here)."""
        # For now, just return success
        # In a real implementation, you might want to blacklist tokens
        return True