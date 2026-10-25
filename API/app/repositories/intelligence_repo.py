"""
Intelligence and Operations Analytics repository (Docker, Multi-Cloud, Hardware, TokenOPS).
"""

from typing import Optional
from sqlalchemy.orm import Session
from app.models import (
    DockerAnalyticsRecord,
    MultiCloudAnalyticsRecord,
    HardwareOrchestrationRecord,
    TokenOpsRecord,
    LLMOpsRecord,
)


class IntelligenceRepository:
    """Repository for modern AI & infrastructure intelligence records."""

    def get_docker_analytics(self, db: Session, tenant_id: str) -> Optional[DockerAnalyticsRecord]:
        return db.query(DockerAnalyticsRecord).filter(
            DockerAnalyticsRecord.tenant_id == tenant_id
        ).order_by(DockerAnalyticsRecord.updated_at.desc()).first()

    def get_multi_cloud_analytics(self, db: Session, tenant_id: str) -> Optional[MultiCloudAnalyticsRecord]:
        return db.query(MultiCloudAnalyticsRecord).filter(
            MultiCloudAnalyticsRecord.tenant_id == tenant_id
        ).order_by(MultiCloudAnalyticsRecord.updated_at.desc()).first()

    def get_hardware_orchestration(self, db: Session, tenant_id: str) -> Optional[HardwareOrchestrationRecord]:
        return db.query(HardwareOrchestrationRecord).filter(
            HardwareOrchestrationRecord.tenant_id == tenant_id
        ).order_by(HardwareOrchestrationRecord.updated_at.desc()).first()

    def get_token_ops(self, db: Session, tenant_id: str) -> Optional[TokenOpsRecord]:
        return db.query(TokenOpsRecord).filter(
            TokenOpsRecord.tenant_id == tenant_id
        ).order_by(TokenOpsRecord.updated_at.desc()).first()

    def get_llm_ops(self, db: Session, tenant_id: str) -> Optional[LLMOpsRecord]:
        return db.query(LLMOpsRecord).filter(
            LLMOpsRecord.tenant_id == tenant_id
        ).order_by(LLMOpsRecord.updated_at.desc()).first()


intelligence_repo = IntelligenceRepository()

