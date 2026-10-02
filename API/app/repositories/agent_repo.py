"""
Agent repository.
"""

from sqlalchemy.orm import Session

from app.models import Agent
from app.repositories.base import BaseRepository


class AgentRepository(BaseRepository[Agent]):
    """Agent repository."""

    def get_by_tenant_and_name(
        self, db: Session, tenant_id: str, name: str
    ) -> Agent | None:
        return db.query(Agent).filter(
            Agent.tenant_id == tenant_id,
            Agent.name == name,
        ).first()

    def get_by_id(self, db: Session, agent_id: str) -> Agent | None:
        return db.query(Agent).filter(Agent.id == agent_id).first()

    def get_by_tenant(self, db: Session, tenant_id: str) -> list[Agent]:
        return db.query(Agent).filter(Agent.tenant_id == tenant_id).all()

    def update_last_seen(self, db: Session, agent: Agent, last_seen_at) -> Agent:
        agent.last_seen_at = last_seen_at
        db.add(agent)
        db.commit()
        db.refresh(agent)
        return agent


agent_repo = AgentRepository(Agent)
