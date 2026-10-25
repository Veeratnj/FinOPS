"""
Forecasting service.
"""

from typing import List, Optional, Any
from sqlalchemy.orm import Session
from app.repositories.forecasting_repo import forecasting_repo
from app.models import ForecastingDriver, ForecastingAccuracy


class ForecastingService:
    @staticmethod
    def get_drivers(db: Session, tenant_id: str) -> List[dict[str, Any]]:
        drivers = forecasting_repo.get_drivers(db, tenant_id)
        return [
            {
                "id": d.id,
                "service": d.service,
                "impact": float(d.impact_usd),
                "direction": d.direction,
                "reason": d.reason,
            }
            for d in drivers
        ]

    @staticmethod
    def get_accuracy(db: Session, tenant_id: str) -> dict[str, Any]:
        acc = forecasting_repo.get_accuracy(db, tenant_id)
        if acc:
            return {
                "mape": float(acc.mape),
                "rmse": float(acc.rmse),
                "lastEvaluated": acc.last_evaluated_at.isoformat() if acc.last_evaluated_at else "2026-03-01",
            }
        return {"mape": 4.2, "rmse": 8900, "lastEvaluated": "2026-03-01"}

    @staticmethod
    def get_forecast_scenarios(db: Session, tenant_id: str) -> dict[str, Any]:
        return {
            "historical": [
                {"month": "Oct 2025", "spend": 262700},
                {"month": "Nov 2025", "spend": 268400},
                {"month": "Dec 2025", "spend": 274100},
                {"month": "Jan 2026", "spend": 271900},
                {"month": "Feb 2026", "spend": 279500},
                {"month": "Mar 2026", "spend": 284750},
            ],
            "forecast": {
                "base": [
                    {"month": "Apr 2026", "spend": 292000, "lower": 285000, "upper": 299000},
                    {"month": "May 2026", "spend": 298500, "lower": 289000, "upper": 308000},
                    {"month": "Jun 2026", "spend": 306000, "lower": 294000, "upper": 318000},
                ],
                "optimistic": [
                    {"month": "Apr 2026", "spend": 278000},
                    {"month": "May 2026", "spend": 281000},
                    {"month": "Jun 2026", "spend": 285000},
                ],
                "pessimistic": [
                    {"month": "Apr 2026", "spend": 308000},
                    {"month": "May 2026", "spend": 322000},
                    {"month": "Jun 2026", "spend": 339000},
                ],
            },
            "drivers": ForecastingService.get_drivers(db, tenant_id),
        }

    get_forecasting_data = get_forecast_scenarios


forecasting_service = ForecastingService()
