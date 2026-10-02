"""Cost analyzer controller."""

from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app import schemas
from app.services.cost_analyzer_service import cost_analyzer_service

cost_analyzer_controller = APIRouter(prefix="/cost-analyzer", tags=["Cost Analyzer"])


@cost_analyzer_controller.get("/services", response_model=list[schemas.ServiceCost])
def get_services(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> list[schemas.ServiceCost]:
    return cost_analyzer_service.get_services(db, current_user.tenant_id)


@cost_analyzer_controller.get("/services/filter", response_model=list[schemas.ServiceCost])
def filter_services(
    provider: Optional[str] = Query(None),
    minCost: Optional[Decimal] = Query(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> list[schemas.ServiceCost]:
    return cost_analyzer_service.filter_services(db, current_user.tenant_id, provider, minCost)


@cost_analyzer_controller.get("/services/{service_id}", response_model=schemas.ServiceCost)
def get_service(
    service_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> schemas.ServiceCost:
    service = cost_analyzer_service.get_service(db, current_user.tenant_id, service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service


@cost_analyzer_controller.get("/cost-by-provider", response_model=list[schemas.CostByProvider])
def get_cost_by_provider(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> list[schemas.CostByProvider]:
    return cost_analyzer_service.get_cost_by_provider(db, current_user.tenant_id)


@cost_analyzer_controller.get("/cost-by-category")
def get_cost_by_category(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> list[dict]:
    return cost_analyzer_service.get_cost_by_category(db, current_user.tenant_id)


@cost_analyzer_controller.get("/usage-metrics", response_model=list[schemas.UsageMetric])
def get_usage_metrics(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> list[schemas.UsageMetric]:
    return cost_analyzer_service.get_usage_metrics(db, current_user.tenant_id)


@cost_analyzer_controller.get("/services/export", response_model=schemas.ServiceExportResponse)
def export_services(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> schemas.ServiceExportResponse:
    return cost_analyzer_service.export_services(db, current_user.tenant_id)


@cost_analyzer_controller.get("/provider-comparison", response_model=list[schemas.ProviderComparison])
def get_provider_comparison(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> list[schemas.ProviderComparison]:
    return cost_analyzer_service.get_provider_comparison(db, current_user.tenant_id)
