"""
Cost allocation repository.
"""

from decimal import Decimal
from typing import Dict, List, Optional

from sqlalchemy import func, or_, and_
from sqlalchemy.orm import Session

from app.models import Team, CostAllocationRule, CostLineItem
from app.repositories.base import BaseRepository


class CostAllocationRepository(BaseRepository[CostAllocationRule]):
    """Repository for cost allocation operations."""

    def get_teams(self, db: Session, tenant_id: str) -> List[Team]:
        return db.query(Team).filter(Team.tenant_id == tenant_id).all()

    def get_team(self, db: Session, tenant_id: str, team_id: str) -> Optional[Team]:
        return db.query(Team).filter(
            and_(Team.id == team_id, Team.tenant_id == tenant_id)
        ).first()

    def get_team_by_name(self, db: Session, tenant_id: str, name: str) -> Optional[Team]:
        return db.query(Team).filter(
            and_(Team.name == name, Team.tenant_id == tenant_id)
        ).first()

    def get_rule(self, db: Session, tenant_id: str, rule_id: str) -> Optional[CostAllocationRule]:
        return db.query(CostAllocationRule).filter(
            and_(CostAllocationRule.id == rule_id, CostAllocationRule.tenant_id == tenant_id)
        ).first()

    def get_rules(self, db: Session, tenant_id: str) -> List[CostAllocationRule]:
        return db.query(CostAllocationRule).filter(CostAllocationRule.tenant_id == tenant_id).all()

    def get_team_rules(self, db: Session, tenant_id: str, team_id: str) -> List[CostAllocationRule]:
        return db.query(CostAllocationRule).filter(
            and_(CostAllocationRule.team_id == team_id, CostAllocationRule.tenant_id == tenant_id)
        ).all()

    def create_rule(self, db: Session, *, rule_data: dict) -> CostAllocationRule:
        rule = CostAllocationRule(**rule_data)
        db.add(rule)
        db.commit()
        db.refresh(rule)
        return rule

    def update_rule(self, db: Session, rule: CostAllocationRule, updates: dict) -> CostAllocationRule:
        for field, value in updates.items():
            setattr(rule, field, value)
        db.add(rule)
        db.commit()
        db.refresh(rule)
        return rule

    def _team_rule_filter(self, rules: List[CostAllocationRule]):
        return or_(*[
            CostLineItem.tags[rule.tag_key].astext == rule.tag_value
            for rule in rules
        ])

    def get_team_allocated_cost(self, db: Session, tenant_id: str, team_id: str) -> Decimal:
        rules = self.get_team_rules(db, tenant_id, team_id)
        if not rules:
            return Decimal("0")

        total = db.query(func.coalesce(func.sum(CostLineItem.cost_usd), 0)).filter(
            and_(CostLineItem.tenant_id == tenant_id, self._team_rule_filter(rules))
        ).scalar()
        return total or Decimal("0")

    def get_team_services_count(self, db: Session, tenant_id: str, team_id: str) -> int:
        rules = self.get_team_rules(db, tenant_id, team_id)
        if not rules:
            return 0

        count = db.query(func.count(func.distinct(CostLineItem.service))).filter(
            and_(CostLineItem.tenant_id == tenant_id, self._team_rule_filter(rules))
        ).scalar()
        return int(count or 0)

    def get_team_category_breakdown(self, db: Session, tenant_id: str, team_id: str) -> Dict[str, Decimal]:
        rules = self.get_team_rules(db, tenant_id, team_id)
        breakdown: Dict[str, Decimal] = {}
        for rule in rules:
            total = db.query(func.coalesce(func.sum(CostLineItem.cost_usd), 0)).filter(
                and_(
                    CostLineItem.tenant_id == tenant_id,
                    CostLineItem.tags[rule.tag_key].astext == rule.tag_value,
                )
            ).scalar()
            breakdown[rule.category] = breakdown.get(rule.category, Decimal("0")) + (total or Decimal("0"))
        return breakdown


cost_allocation_repo = CostAllocationRepository(CostAllocationRule)
