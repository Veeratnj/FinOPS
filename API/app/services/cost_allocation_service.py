"""
Cost allocation service.
"""

from decimal import Decimal
from typing import List

from sqlalchemy.orm import Session

from app.repositories.cost_allocation_repo import cost_allocation_repo
from app import schemas


class CostAllocationService:
    """Cost allocation business logic."""

    @staticmethod
    def get_teams(db: Session, tenant_id: str) -> List[schemas.Team]:
        teams = cost_allocation_repo.get_teams(db, tenant_id)
        result = []
        for team in teams:
            actual = cost_allocation_repo.get_team_allocated_cost(db, tenant_id, team.id)
            services = cost_allocation_repo.get_team_services_count(db, tenant_id, team.id)
            variance = CostAllocationService._compute_variance(team.allocated_budget_usd, actual)
            result.append(
                schemas.Team(
                    id=team.id,
                    name=team.name,
                    department=team.department,
                    allocated=team.allocated_budget_usd,
                    actual=actual,
                    variance=variance,
                    services=services,
                )
            )
        return result

    @staticmethod
    def get_team(db: Session, tenant_id: str, team_id: str) -> schemas.Team | None:
        team = cost_allocation_repo.get_team(db, tenant_id, team_id)
        if team is None:
            return None
        actual = cost_allocation_repo.get_team_allocated_cost(db, tenant_id, team.id)
        services = cost_allocation_repo.get_team_services_count(db, tenant_id, team.id)
        variance = CostAllocationService._compute_variance(team.allocated_budget_usd, actual)
        return schemas.Team(
            id=team.id,
            name=team.name,
            department=team.department,
            allocated=team.allocated_budget_usd,
            actual=actual,
            variance=variance,
            services=services,
        )

    @staticmethod
    def get_team_breakdown(db: Session, tenant_id: str, team_id: str) -> schemas.TeamBreakdown | None:
        team = cost_allocation_repo.get_team(db, tenant_id, team_id)
        if team is None:
            return None
        breakdown = cost_allocation_repo.get_team_category_breakdown(db, tenant_id, team.id)
        return schemas.TeamBreakdown(team=team.name, breakdown=breakdown)

    @staticmethod
    def create_allocation_rule(db: Session, tenant_id: str, rule_in: schemas.CostAllocationRuleBase) -> dict:
        team = cost_allocation_repo.get_team_by_name(db, tenant_id, rule_in.target)
        if team is None:
            return {"error": "Team not found"}

        rule_data = {
            "tenant_id": tenant_id,
            "name": rule_in.name,
            "tag_key": rule_in.tag,
            "tag_value": rule_in.target,
            "team_id": team.id,
            "category": rule_in.category,
        }
        rule = cost_allocation_repo.create_rule(db, rule_data=rule_data)
        return {"id": rule.id, "message": "Allocation rule created."}

    @staticmethod
    def update_allocation_rule(db: Session, tenant_id: str, rule_id: str, rule_in: schemas.CostAllocationRuleUpdate) -> dict | None:
        rule = cost_allocation_repo.get_rule(db, tenant_id, rule_id)
        if rule is None:
            return None
        update_data = rule_in.dict(exclude_unset=True)
        updated_rule = cost_allocation_repo.update_rule(db, rule, update_data)
        return {"id": updated_rule.id, "message": "Rule updated."}

    @staticmethod
    def get_treemap(db: Session, tenant_id: str) -> List[schemas.TreemapNode]:
        teams = cost_allocation_repo.get_teams(db, tenant_id)
        return [
            schemas.TreemapNode(
                name=team.name,
                value=cost_allocation_repo.get_team_allocated_cost(db, tenant_id, team.id),
                department=team.department,
            )
            for team in teams
        ]

    @staticmethod
    def get_chargeback(db: Session, tenant_id: str) -> List[schemas.ChargebackEntry]:
        teams = cost_allocation_repo.get_teams(db, tenant_id)
        return [
            schemas.ChargebackEntry(
                team=team.name,
                chargeback=cost_allocation_repo.get_team_allocated_cost(db, tenant_id, team.id),
            )
            for team in teams
        ]

    @staticmethod
    def get_variance_analysis(db: Session, tenant_id: str) -> List[schemas.VarianceAnalysis]:
        teams = cost_allocation_repo.get_teams(db, tenant_id)
        result = []
        for team in teams:
            actual = cost_allocation_repo.get_team_allocated_cost(db, tenant_id, team.id)
            variance = CostAllocationService._compute_variance(team.allocated_budget_usd, actual)
            result.append(
                schemas.VarianceAnalysis(
                    team=team.name,
                    allocated=team.allocated_budget_usd,
                    actual=actual,
                    variance=variance,
                )
            )
        return result

    @staticmethod
    def _compute_variance(allocated: Decimal, actual: Decimal) -> Decimal:
        if allocated == 0:
            return Decimal("0")
        return ((actual - allocated) / allocated * Decimal("100")).quantize(Decimal("0.01"))


cost_allocation_service = CostAllocationService()
