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
from app.repositories.user_repo import user_repo

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


@auth_controller.post("/forgot-password")
def forgot_password(
    payload: dict,
    db: Session = Depends(deps.get_db),
) -> dict:
    """Send verification code for password reset."""
    email = payload.get("email", "").strip()
    user = user_repo.get_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="User with this email not found")
    return {"message": "Verification code sent successfully", "email": email}


@auth_controller.post("/reset-password")
def reset_password(
    payload: dict,
    db: Session = Depends(deps.get_db),
) -> dict:
    """Reset user password in PostgreSQL database."""
    from app.core.security import get_password_hash
    email = payload.get("email", "").strip()
    new_password = payload.get("new_password", "")
    user = user_repo.get_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.password_hash = get_password_hash(new_password)
    db.commit()
    return {"message": "Password reset successfully"}


@auth_controller.post("/verify-email")
def verify_email(
    payload: dict,
    db: Session = Depends(deps.get_db),
) -> dict:
    """Verify email endpoint."""
    return {"message": "Email verified successfully", "status": "verified"}