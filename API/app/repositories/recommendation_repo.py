"""
Recommendation repository.
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from app.models import Recommendation, RecommendationStatus, RecommendationImpact
from app.repositories.base import BaseRepository


class RecommendationRepository(BaseRepository[Recommendation]):
    """Recommendation repository."""

    def get_by_tenant(self, db: Session, tenant_id: str) -> List[Recommendation]:
        return db.query(Recommendation).filter(Recommendation.tenant_id == tenant_id).all()

    def get_by_category(self, db: Session, tenant_id: str, category: str) -> List[Recommendation]:
        return db.query(Recommendation).filter(
            Recommendation.tenant_id == tenant_id,
            Recommendation.category.ilike(f"%{category}%")
        ).all()

    def filter_recommendations(
        self, db: Session, tenant_id: str, category: Optional[str] = None, impact: Optional[str] = None
    ) -> List[Recommendation]:
        query = db.query(Recommendation).filter(Recommendation.tenant_id == tenant_id)
        if category:
            query = query.filter(Recommendation.category.ilike(f"%{category}%"))
        if impact:
            query = query.filter(Recommendation.impact == impact)
        return query.all()

    def update_status(self, db: Session, rec_id: str, tenant_id: str, status: RecommendationStatus) -> Optional[Recommendation]:
        rec = db.query(Recommendation).filter(
            Recommendation.id == rec_id,
            Recommendation.tenant_id == tenant_id
        ).first()
        if rec:
            rec.status = status
            db.commit()
            db.refresh(rec)
        return rec


recommendation_repo = RecommendationRepository(Recommendation)
