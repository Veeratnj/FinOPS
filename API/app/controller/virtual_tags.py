"""Virtual tags controller."""

from typing import Any

from fastapi import APIRouter, Body, status

virtual_tags_controller = APIRouter(prefix="/virtual-tags", tags=["Virtual Tags"])


@virtual_tags_controller.get("")
def get_virtual_tags() -> list[dict[str, Any]]:
    return [{"provider": "AWS", "rawKey": "aws:createdBy", "rawValue": "team-platform", "normalizedKey": "team", "normalizedValue": "Platform Engineering"}]


@virtual_tags_controller.get("/coverage")
def get_virtual_tags_coverage() -> dict[str, Any]:
    return {"covered": 8, "total": 12, "percentage": 67}


@virtual_tags_controller.post("/rules/create", status_code=status.HTTP_201_CREATED)
def create_virtual_tag_rule(payload: dict[str, Any] = Body(...)) -> dict[str, Any]:
    return {"id": "rule-1711361400000", "message": "Tag rule created."}


@virtual_tags_controller.put("/rules/{rule_id}/update")
def update_virtual_tag_rule(rule_id: str, payload: dict[str, Any] = Body(...)) -> dict[str, Any]:
    return {"id": rule_id, "message": "Rule updated."}


@virtual_tags_controller.delete("/rules/{rule_id}")
def delete_virtual_tag_rule(rule_id: str) -> dict[str, Any]:
    return {"message": f"Rule {rule_id} deleted."}


@virtual_tags_controller.get("/mappings")
def get_virtual_tag_mappings() -> list[dict[str, Any]]:
    return [{"from": "AWS:aws:createdBy=team-platform", "to": "team=Platform Engineering"}]


@virtual_tags_controller.post("/mappings/create", status_code=status.HTTP_201_CREATED)
def create_virtual_tag_mapping(payload: dict[str, Any] = Body(...)) -> dict[str, Any]:
    return {"id": "map-1711361400000", "message": "Tag mapping created."}


@virtual_tags_controller.get("/sample")
def sample_virtual_tags():
    return {
        'data': [],
        'msg': "Virtual tags fetched successfully"
    }

