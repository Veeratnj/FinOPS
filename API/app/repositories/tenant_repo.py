from __future__ import annotations

from typing import Optional
from app.models import Tenant
from app.repositories.base import BaseRepository


class TenantRepository(BaseRepository[Tenant]):
    """Tenant repository."""

    def get_by_slug(self, db, slug: str) -> Optional[Tenant]:
        """Get tenant by slug."""
        return db.query(Tenant).filter(Tenant.slug == slug).first()


tenant_repo = TenantRepository(Tenant)