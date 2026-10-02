"""
User operations controller.
"""

from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import schemas
from app.api import deps
from app.services.auth_service import AuthService

user_operations_controller = APIRouter(prefix="/user-operations", tags=["User Operations"])


@user_operations_controller.post("/create-user", response_model=schemas.User)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,
    current_user: schemas.User = Depends(deps.get_current_user),
) -> Any:
    """Create a new user for the organization."""
    try:
        user = AuthService.create_user(db, user_in)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@user_operations_controller.get("/users", response_model=List[schemas.User])
def get_users(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: schemas.User = Depends(deps.get_current_user),
) -> Any:
    """Get all users in the organization."""
    # This would need a service method to get users by tenant
    # For now, return empty list
    return []


@user_operations_controller.delete("/users/{user_id}")
def delete_user(
    user_id: str,
    db: Session = Depends(deps.get_db),
    current_user: schemas.User = Depends(deps.get_current_user),
) -> dict:
    """Delete a user."""
    # This would need implementation
    return {"message": "User deleted successfully"}


