"""
Authentication service.
"""

from datetime import timedelta
from typing import Any

from sqlalchemy.orm import Session

from app import models, schemas
from app.core import security
from app.core.config import settings
from app.core.security import pwd_context
from app.repositories.user_repo import user_repo


class AuthService:
    """Authentication service."""

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> models.User | None:
        """Authenticate user with email and password."""
        user = user_repo.get_by_email(db, email=email)
        if not user:
            return None
        if not pwd_context.verify(password, user.password_hash):
            return None
        return user

    @staticmethod
    def create_access_token(user: models.User) -> str:
        """Create access token for user."""
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        return security.create_access_token(
            user.id,
            expires_delta=access_token_expires,
            extra_claims={"tenant_id": user.tenant_id}
        )

    @staticmethod
    def create_refresh_token(user: models.User) -> str:
        """Create refresh token for user."""
        refresh_token_expires = timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
        return security.create_refresh_token(
            user.id,
            expires_delta=refresh_token_expires,
            extra_claims={"tenant_id": user.tenant_id}
        )

    @staticmethod
    def login(db: Session, email: str, password: str) -> schemas.Token | None:
        """Login user and return tokens."""
        user = AuthService.authenticate_user(db, email, password)
        if not user or not user.is_active:
            return None

        access_token = AuthService.create_access_token(user)
        refresh_token = AuthService.create_refresh_token(user)

        return schemas.Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=user,
        )

    @staticmethod
    def refresh_access_token(db: Session, refresh_token: str) -> schemas.Token | None:
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

        access_token = AuthService.create_access_token(user)
        new_refresh_token = AuthService.create_refresh_token(user)

        return schemas.Token(
            access_token=access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
            user=user,
        )

    @staticmethod
    def create_user(db: Session, user_in: schemas.UserCreate) -> models.User:
        """Create a new user."""
        # Check if user already exists
        existing_user = user_repo.get_by_email(db, email=user_in.email)
        if existing_user:
            raise ValueError("User with this email already exists")

        # Hash password
        hashed_password = security.get_password_hash(user_in.password)
        
        # Create user directly with model
        user = models.User(
            email=user_in.email,
            password_hash=hashed_password,
            role=user_in.role,
            tenant_id=user_in.tenant_id,
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def register_user(
        db: Session, 
        user_reg: schemas.UserRegister,
        tenant_repo
    ) -> models.User:
        """Register a new user in an organization.
        
        Validates that the organization exists and admin name matches.
        """
        # Get tenant by slug
        tenant = tenant_repo.get_by_slug(db, user_reg.org_slug)
        if not tenant:
            raise ValueError("Organization not found")

        # Verify admin name matches
        admin_name = tenant.metadata_.get("admin_name", "")
        if admin_name != user_reg.org_admin_name:
            raise ValueError("Invalid organization admin name")

        # Check if user already exists
        existing_user = user_repo.get_by_email(db, email=user_reg.email)
        if existing_user:
            raise ValueError("Email already registered")

        # Hash password
        hashed_password = security.get_password_hash(user_reg.password)
        
        # Create user
        user = models.User(
            email=user_reg.email,
            password_hash=hashed_password,
            role=user_reg.role,
            tenant_id=tenant.id,
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user