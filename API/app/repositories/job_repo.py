"""
Job repository.
"""

from typing import List, Optional

from sqlalchemy.orm import Session

from app.models import OrchestrationJob
from app.repositories.base import BaseRepository


class JobRepository(BaseRepository[OrchestrationJob]):
    """Job repository."""

    def get_by_status(self, db: Session, status: str) -> List[OrchestrationJob]:
        """Get jobs by status."""
        return db.query(OrchestrationJob).filter(OrchestrationJob.status == status).all()

    def get_by_agent(self, db: Session, agent_id: str) -> List[OrchestrationJob]:
        """Get jobs by agent."""
        return db.query(OrchestrationJob).filter(OrchestrationJob.agent_id == agent_id).all()

    def get_with_filters(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        status: Optional[str] = None,
        agent_id: Optional[str] = None,
    ) -> List[OrchestrationJob]:
        """Get jobs with filters."""
        query = db.query(OrchestrationJob)
        if status:
            query = query.filter(OrchestrationJob.status == status)
        if agent_id:
            query = query.filter(OrchestrationJob.agent_id == agent_id)
        return query.offset(skip).limit(limit).all()


job_repo = JobRepository(OrchestrationJob)