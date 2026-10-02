"""
Authentication controller.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app import schemas
from app.api import deps
from app.services.auth_service import AuthService
from app.repositories.tenant_repo import tenant_repo

auth_controller = APIRouter(prefix="/auth", tags=["Authentication"])


@auth_controller.post("/login", response_model=schemas.Token)
def login(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> schemas.Token:
    """Login endpoint."""
    token = AuthService.login(db, form_data.username, form_data.password)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token


@auth_controller.post("/logout")
def logout(
    current_user: schemas.User = Depends(deps.get_current_user),
) -> dict:
    """Logout endpoint."""
    # For now, just return success
    # In a real implementation, you might want to blacklist the token
    return {"message": "Successfully logged out"}


@auth_controller.post("/refresh", response_model=schemas.Token)
def refresh_token(
    refresh_token: schemas.RefreshToken,
    db: Session = Depends(deps.get_db),
) -> schemas.Token:
    """Refresh access token."""
    token = AuthService.refresh_access_token(db, refresh_token.refresh_token)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )
    return token


@auth_controller.post("/register", response_model=schemas.User)
def register(
    *,
    db: Session = Depends(deps.get_db),
    user_reg: schemas.UserRegister,
) -> schemas.User:
    """Register a new user in an existing organization.
    
    Required fields:
    - email: User's email
    - password: User's password
    - org_slug: Organization slug (e.g., 'my-company')
    - org_admin_name: Organization admin's name (for verification)
    """
    try:
        user = AuthService.register_user(db, user_reg, tenant_repo)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )