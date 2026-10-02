"""Users controller."""

from typing import Any

from fastapi import APIRouter, Body, status

users_controller = APIRouter(prefix="/users", tags=["Users"])


@users_controller.get("/{user_id}")
def get_user(user_id: str) -> dict[str, Any]:
    return {"id": user_id, "name": "Emma Lee", "email": "emma@company.com", "role": "analyst", "department": "Finance"}


@users_controller.post("/create", status_code=status.HTTP_201_CREATED)
def create_user(payload: dict[str, Any] = Body(...)) -> dict[str, Any]:
    return {"id": "usr-1711361400000", "message": "User created."}


@users_controller.put("/{user_id}/update")
def update_user(user_id: str, payload: dict[str, Any] = Body(...)) -> dict[str, Any]:
    return {"id": user_id, "department": payload.get("department", "Operations"), "updated": True}


@users_controller.delete("/{user_id}")
def delete_user(user_id: str) -> dict[str, Any]:
    return {"message": f"User {user_id} deleted."}


@users_controller.put("/{user_id}/role")
def change_user_role(user_id: str, payload: dict[str, Any] = Body(...)) -> dict[str, Any]:
    return {"id": user_id, "role": payload.get("role", "manager"), "message": "Role updated."}


@users_controller.post("/{user_id}/change-password")
def change_user_password(user_id: str, payload: dict[str, Any] = Body(...)) -> dict[str, Any]:
    return {"message": "Password changed successfully."}


@users_controller.get("/{user_id}/activity")
def get_user_activity(user_id: str) -> list[dict[str, Any]]:
    return [
        {"action": "login", "timestamp": "2026-03-24T08:00:00Z"},
        {"action": "viewed dashboard", "timestamp": "2026-03-24T08:01:00Z"},
    ]
