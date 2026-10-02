"""Cost allocation controller."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app import schemas
from app.services.cost_allocation_service import cost_allocation_service

cost_allocation_controller = APIRouter(prefix="/cost-allocation", tags=["Cost Allocation"])


@cost_allocation_controller.get("/teams", response_model=list[schemas.Team])
def get_cost_allocation_teams(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> list[schemas.Team]:
    return cost_allocation_service.get_teams(db, current_user.tenant_id)


@cost_allocation_controller.get("/teams/{team_id}", response_model=schemas.Team)
def get_team(
    team_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> schemas.Team:
    team = cost_allocation_service.get_team(db, current_user.tenant_id, team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team


@cost_allocation_controller.get("/teams/{team_id}/breakdown", response_model=schemas.TeamBreakdown)
def get_team_breakdown(
    team_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> schemas.TeamBreakdown:
    breakdown = cost_allocation_service.get_team_breakdown(db, current_user.tenant_id, team_id)
    if not breakdown:
        raise HTTPException(status_code=404, detail="Team not found")
    return breakdown


@cost_allocation_controller.post("/rules/create", status_code=status.HTTP_201_CREATED)
def create_allocation_rule(
    rule_in: schemas.CostAllocationRuleBase,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> dict[str, str]:
    result = cost_allocation_service.create_allocation_rule(db, current_user.tenant_id, rule_in)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


@cost_allocation_controller.put("/rules/{rule_id}/update")
def update_allocation_rule(
    rule_id: str,
    rule_in: schemas.CostAllocationRuleUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> dict[str, str]:
    result = cost_allocation_service.update_allocation_rule(db, current_user.tenant_id, rule_id, rule_in)
    if result is None:
        raise HTTPException(status_code=404, detail="Allocation rule not found")
    return result


@cost_allocation_controller.get("/treemap", response_model=list[schemas.TreemapNode])
def get_treemap(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> list[schemas.TreemapNode]:
    return cost_allocation_service.get_treemap(db, current_user.tenant_id)


@cost_allocation_controller.get("/chargeback", response_model=list[schemas.ChargebackEntry])
def get_chargeback(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> list[schemas.ChargebackEntry]:
    return cost_allocation_service.get_chargeback(db, current_user.tenant_id)


@cost_allocation_controller.get("/variance-analysis", response_model=list[schemas.VarianceAnalysis])
def get_variance_analysis(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> list[schemas.VarianceAnalysis]:
    return cost_allocation_service.get_variance_analysis(db, current_user.tenant_id)


@cost_allocation_controller.get("/sample")
def sample_cost_allocation():
    return {
        'data': [],
        'msg': "Cost allocation fetched successfully"
    }

