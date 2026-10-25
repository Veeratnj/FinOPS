"""
Virtual tags service.
"""

from typing import List, Optional, Any
from sqlalchemy.orm import Session
from app.repositories.virtual_tag_repo import virtual_tag_repo
from app.models import VirtualTagRule, VirtualTagMapping


class VirtualTagsService:
    @staticmethod
    def get_virtual_tags(db: Session, tenant_id: str) -> List[dict[str, Any]]:
        rules = virtual_tag_repo.get_rules_by_tenant(db, tenant_id)
        return [
            {
                "id": r.id,
                "provider": r.provider,
                "rawKey": r.raw_key,
                "rawValue": r.raw_value,
                "normalizedKey": r.normalized_key,
                "normalizedValue": r.normalized_value,
            }
            for r in rules
        ]

    get_all_rules = get_virtual_tags

    @staticmethod
    def get_mappings(db: Session, tenant_id: str) -> List[dict[str, Any]]:
        mappings = virtual_tag_repo.get_mappings_by_tenant(db, tenant_id)
        return [
            {
                "id": m.id,
                "from": m.from_tag,
                "to": m.to_tag,
            }
            for m in mappings
        ]

    @staticmethod
    def create_rule(db: Session, tenant_id: str, data: dict[str, Any]) -> dict[str, Any]:
        rule = VirtualTagRule(
            tenant_id=tenant_id,
            provider=data["provider"],
            raw_key=data["rawKey"],
            raw_value=data["rawValue"],
            normalized_key=data["normalizedKey"],
            normalized_value=data["normalizedValue"],
        )
        virtual_tag_repo.create_rule(db, rule)
        return {"id": rule.id, "message": "Tag rule created."}


virtual_tags_service = VirtualTagsService()
