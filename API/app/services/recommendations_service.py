"""
Recommendations service.
"""

from typing import List, Optional, Any
from sqlalchemy.orm import Session
from app.repositories.recommendation_repo import recommendation_repo
from app.models import Recommendation, RecommendationStatus


class RecommendationsService:
    @staticmethod
    def get_recommendations(db: Session, tenant_id: str) -> List[dict[str, Any]]:
        records = recommendation_repo.get_by_tenant(db, tenant_id)
        return [
            {
                "id": r.id,
                "title": r.title,
                "category": r.category,
                "impact": r.impact.value if hasattr(r.impact, "value") else str(r.impact),
                "effort": r.effort.value if hasattr(r.effort, "value") else str(r.effort),
                "savings": float(r.savings_usd),
                "status": r.status.value if hasattr(r.status, "value") else str(r.status),
                "steps": r.steps or ["Assess resource utilization", "Execute optimization action"],
                "description": r.description,
            }
            for r in records
        ]

    get_all = get_recommendations

    @staticmethod
    def filter_recommendations(
        db: Session, tenant_id: str, category: Optional[str] = None, impact: Optional[str] = None
    ) -> List[dict[str, Any]]:
        records = recommendation_repo.filter_recommendations(db, tenant_id, category, impact)
        return [
            {
                "id": r.id,
                "title": r.title,
                "category": r.category,
                "impact": r.impact.value if hasattr(r.impact, "value") else str(r.impact),
                "effort": r.effort.value if hasattr(r.effort, "value") else str(r.effort),
                "savings": float(r.savings_usd),
                "status": r.status.value if hasattr(r.status, "value") else str(r.status),
                "steps": r.steps or [],
                "description": r.description,
            }
            for r in records
        ]

    @staticmethod
    def update_status(db: Session, tenant_id: str, rec_id: str, status_str: str) -> Optional[dict[str, Any]]:
        status_enum = RecommendationStatus(status_str) if status_str in [s.value for s in RecommendationStatus] else RecommendationStatus.IN_PROGRESS
        r = recommendation_repo.update_status(db, rec_id, tenant_id, status_enum)
        if not r:
            return None
        return {"id": r.id, "status": r.status.value}

    @staticmethod
    def get_savings_summary(db: Session, tenant_id: str) -> dict[str, Any]:
        records = recommendation_repo.get_by_tenant(db, tenant_id)
        total_savings = sum(float(r.savings_usd) for r in records)
        open_count = sum(1 for r in records if (r.status.value if hasattr(r.status, "value") else r.status) == "open")
        in_prog_count = sum(1 for r in records if (r.status.value if hasattr(r.status, "value") else r.status) == "in_progress")
        done_count = sum(1 for r in records if (r.status.value if hasattr(r.status, "value") else r.status) == "done")
        return {
            "totalSavings": total_savings,
            "open": open_count,
            "inProgress": in_prog_count,
            "done": done_count,
        }


recommendations_service = RecommendationsService()
