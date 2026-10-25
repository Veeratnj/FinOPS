"""
Virtual tag repository.
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from app.models import VirtualTagRule, VirtualTagMapping
from app.repositories.base import BaseRepository


class VirtualTagRepository:
    """Virtual Tag repository."""

    def get_rules_by_tenant(self, db: Session, tenant_id: str) -> List[VirtualTagRule]:
        return db.query(VirtualTagRule).filter(VirtualTagRule.tenant_id == tenant_id).all()

    def get_mappings_by_tenant(self, db: Session, tenant_id: str) -> List[VirtualTagMapping]:
        return db.query(VirtualTagMapping).filter(VirtualTagMapping.tenant_id == tenant_id).all()

    def create_rule(self, db: Session, rule: VirtualTagRule) -> VirtualTagRule:
        db.add(rule)
        db.commit()
        db.refresh(rule)
        return rule

    def create_mapping(self, db: Session, mapping: VirtualTagMapping) -> VirtualTagMapping:
        db.add(mapping)
        db.commit()
        db.refresh(mapping)
        return mapping


virtual_tag_repo = VirtualTagRepository()
