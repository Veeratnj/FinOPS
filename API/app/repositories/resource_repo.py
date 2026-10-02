"""
Resource repository and normalization support.
"""

from sqlalchemy.orm import Session

from app.models import Resource
from app.repositories.base import BaseRepository


class ResourceRepository(BaseRepository[Resource]):
    """Resource repository."""

    def get_by_ref(
        self,
        db: Session,
        tenant_id: str,
        provider: str,
        resource_type: str,
        external_id: str,
    ) -> Resource | None:
        return db.query(Resource).filter(
            Resource.tenant_id == tenant_id,
            Resource.provider == provider,
            Resource.resource_type == resource_type,
            Resource.external_id == external_id,
        ).first()

    def get_or_create(
        self,
        db: Session,
        tenant_id: str,
        provider: str,
        resource_type: str,
        external_id: str,
        name: str | None = None,
        region: str | None = None,
        tags: dict | None = None,
        metadata: dict | None = None,
    ):
        resource = self.get_by_ref(db, tenant_id, provider, resource_type, external_id)
        if resource:
            return resource

        resource_data = {
            "tenant_id": tenant_id,
            "provider": provider,
            "resource_type": resource_type,
            "external_id": external_id,
            "name": name,
            "region": region,
            "tags": tags or {},
            "metadata": metadata or {},
        }
        return self.create(db, obj_in=resource_data)


resource_repo = ResourceRepository(Resource)
