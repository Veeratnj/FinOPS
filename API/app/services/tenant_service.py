"""
Tenant service.
"""

from sqlalchemy.orm import Session

from app import models, schemas
from app.repositories.tenant_repo import tenant_repo
from app.repositories.user_repo import user_repo
from app.core.security import get_password_hash


class TenantService:
    """Tenant service."""

    @staticmethod
    def create_tenant_with_admin(
        db: Session, 
        org_in: schemas.OrgAdminCreate
    ) -> tuple[models.Tenant, models.User]:
        """Create a new tenant with admin user.
        
        Returns: (tenant, admin_user)
        """
        # Check if tenant with slug already exists
        existing_tenant = tenant_repo.get_by_slug(db, org_in.org_slug)
        if existing_tenant:
            raise ValueError("Organization with this slug already exists")
        print("No existing organization found with slug:", org_in.org_slug)
        # Check if user email already exists
        existing_user = user_repo.get_by_email(db, email=org_in.admin_email)
        if existing_user:
            raise ValueError("Email already registered")
        print("No existing user found with email:", org_in.admin_email)

        # Create tenant
        tenant = models.Tenant(
            name=org_in.org_name,
            slug=org_in.org_slug,
            plan=org_in.org_plan,
            is_active=True,
            metadata_={"admin_name": org_in.admin_name}
        )
        print("Creating tenant with data:", tenant)
        db.add(tenant)
        db.flush()  # Get the tenant ID without committing
        print('flag22')
        # Create org admin user
        hashed_password = get_password_hash(org_in.admin_password)
        print("Creating admin user with email:", org_in.admin_email)
        admin_user = models.User(
            email=org_in.admin_email,
            password_hash=hashed_password,
            role="owner",  # Organization owner/admin
            tenant_id=tenant.id,
            is_active=True
        )
        db.add(admin_user)
        db.commit()
        db.refresh(tenant)
        db.refresh(admin_user)
        
        return tenant, admin_user

    @staticmethod
    def create_tenant(db: Session, tenant_in: schemas.TenantCreate) -> models.Tenant:
        """Create a new tenant (without admin)."""
        # Check if tenant with slug already exists
        existing_tenant = tenant_repo.get_by_slug(db, tenant_in.slug)
        if existing_tenant:
            raise ValueError("Tenant with this slug already exists")

        # Create tenant
        tenant = models.Tenant(
            name=tenant_in.name,
            slug=tenant_in.slug,
            plan=tenant_in.plan,
            is_active=True,
            metadata_={}
        )
        db.add(tenant)
        db.commit()
        db.refresh(tenant)
        return tenant

    @staticmethod
    def get_tenant(db: Session, tenant_id: str) -> models.Tenant | None:
        """Get tenant by ID."""
        return tenant_repo.get(db, id=tenant_id)

    @staticmethod
    def get_tenant_by_slug(db: Session, slug: str) -> models.Tenant | None:
        """Get tenant by slug."""
        return tenant_repo.get_by_slug(db, slug)

    @staticmethod
    def get_tenants(db: Session, skip: int = 0, limit: int = 100) -> list[models.Tenant]:
        """Get all tenants (admin only)."""
        return tenant_repo.get_multi(db, skip=skip, limit=limit)

    @staticmethod
    def update_tenant(
        db: Session,
        db_tenant: models.Tenant,
        tenant_in: schemas.TenantUpdate
    ) -> models.Tenant:
        """Update tenant."""
        update_data = tenant_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if field == "metadata_":
                setattr(db_tenant, "metadata_", value)
            else:
                setattr(db_tenant, field, value)

        db.add(db_tenant)
        db.commit()
        db.refresh(db_tenant)
        return db_tenant

    @staticmethod
    def delete_tenant(db: Session, tenant_id: str) -> models.Tenant:
        """Delete tenant."""
        tenant = tenant_repo.get(db, id=tenant_id)
        if not tenant:
            raise ValueError("Tenant not found")

        tenant_repo.remove(db, id=tenant_id)
        return tenant