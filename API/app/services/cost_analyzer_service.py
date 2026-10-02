"""
Cost analyzer service.
"""

from decimal import Decimal
from typing import List, Optional
from datetime import datetime

from sqlalchemy.orm import Session

from app.repositories.cost_analyzer_repo import cost_analyzer_repo
from app import schemas


class CostAnalyzerService:
    """Cost analyzer service."""

    @staticmethod
    def get_services(db: Session, tenant_id: str) -> List[schemas.ServiceCost]:
        """Get all services with cost information."""
        services = cost_analyzer_repo.get_services(db, tenant_id)
        return [
            schemas.ServiceCost(
                name=service,
                provider=provider,
                cost=cost,
                usage=CostAnalyzerService._format_usage(usage_amount, avg_usage),
                trend=cost_analyzer_repo.get_service_trend(db, tenant_id, service)
            )
            for service, provider, cost, usage_amount, avg_usage in services
        ]

    @staticmethod
    def filter_services(
        db: Session, tenant_id: str, provider: Optional[str] = None, min_cost: Optional[Decimal] = None
    ) -> List[schemas.ServiceCost]:
        """Filter services by provider and minimum cost."""
        services = cost_analyzer_repo.get_services_filtered(db, tenant_id, provider, min_cost)
        return [
            schemas.ServiceCost(
                name=service,
                provider=provider_val,
                cost=cost,
                usage=CostAnalyzerService._format_usage(usage_amount, avg_usage),
                trend=cost_analyzer_repo.get_service_trend(db, tenant_id, service)
            )
            for service, provider_val, cost, usage_amount, avg_usage in services
        ]

    @staticmethod
    def get_service(db: Session, tenant_id: str, service_id: str) -> Optional[schemas.ServiceCost]:
        """Get a specific service by ID."""
        service_data = cost_analyzer_repo.get_service_by_id(db, tenant_id, service_id)
        if not service_data:
            return None

        service, provider, cost, usage_amount, avg_usage = service_data
        return schemas.ServiceCost(
            name=service,
            provider=provider,
            cost=cost,
            usage=CostAnalyzerService._format_usage(usage_amount, avg_usage),
            trend=cost_analyzer_repo.get_service_trend(db, tenant_id, service)
        )

    @staticmethod
    def get_cost_by_provider(db: Session, tenant_id: str) -> List[schemas.CostByProvider]:
        """Get cost breakdown by provider."""
        providers = cost_analyzer_repo.get_cost_by_provider(db, tenant_id)
        return [
            schemas.CostByProvider(provider=provider, cost=cost)
            for provider, cost in providers
        ]

    @staticmethod
    def get_cost_by_category(db: Session, tenant_id: str) -> List[dict]:
        """Get cost breakdown by category (similar to categories API)."""
        categories = cost_analyzer_repo.get_cost_by_category(db, tenant_id)
        return [
            {
                "name": category_type.value.capitalize(),
                "value": value,
                "change": CostAnalyzerService._compute_category_change(db, tenant_id, category_type)
            }
            for category_type, value in categories
        ]

    @staticmethod
    def get_usage_metrics(db: Session, tenant_id: str) -> List[schemas.UsageMetric]:
        """Get usage metrics."""
        metrics = cost_analyzer_repo.get_usage_metrics(db, tenant_id)
        return [
            schemas.UsageMetric(
                name=service,
                usage=CostAnalyzerService._format_usage_simple(usage_amount),
                cost=cost
            )
            for service, usage_amount, cost in metrics
        ]

    @staticmethod
    def export_services(db: Session, tenant_id: str) -> schemas.ServiceExportResponse:
        """Return export metadata for services."""
        return schemas.ServiceExportResponse(
            download_url="/exports/services_export.csv",
            generated_at=datetime.utcnow().isoformat() + "Z"
        )

    @staticmethod
    def get_provider_comparison(db: Session, tenant_id: str) -> List[schemas.ProviderComparison]:
        """Get provider comparison with services."""
        comparisons = cost_analyzer_repo.get_provider_comparison(db, tenant_id)
        return [
            schemas.ProviderComparison(
                provider=provider,
                services=[
                    schemas.ServiceCost(
                        name=service,
                        provider=provider_val,
                        cost=cost,
                        usage=CostAnalyzerService._format_usage(usage_amount, avg_usage),
                        trend=cost_analyzer_repo.get_service_trend(db, tenant_id, service)
                    )
                    for service, provider_val, cost, usage_amount, avg_usage in services
                ]
            )
            for provider, services in comparisons
        ]

    @staticmethod
    def _format_usage(usage_amount: Optional[Decimal], avg_usage: Optional[Decimal]) -> str:
        """Format usage information."""
        if usage_amount is None:
            return "0 units"
        if avg_usage and avg_usage != 0:
            return f"{usage_amount:.0f} units (avg: {avg_usage:.2f})"
        return f"{usage_amount:.0f} units"

    @staticmethod
    def _format_usage_simple(usage_amount: Optional[Decimal]) -> str:
        """Format usage information simply."""
        if usage_amount is None:
            return "0 units"
        return f"{usage_amount:.0f} units"

    @staticmethod
    def _compute_category_change(db: Session, tenant_id: str, category_type) -> Decimal:
        """Compute category change (simplified)."""
        # This is a simplified version - in reality you'd compare current vs previous period
        return Decimal("0")  # Placeholder


cost_analyzer_service = CostAnalyzerService()
