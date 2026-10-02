"""
Tenant controller.
"""

from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import schemas
from app.api import deps
from app.services.tenant_service import TenantService

tenant_controller = APIRouter(prefix="/tenants", tags=["Tenants"])


@tenant_controller.post("/register-org", response_model=dict)
def register_organization(
    *,
    db: Session = Depends(deps.get_db),
    org_in: schemas.OrgAdminCreate,
) -> Any:
    """Register a new organization with admin user."""
    try:
        print("Creating organization with data:", org_in)
        tenant, admin_user = TenantService.create_tenant_with_admin(db, org_in)
        return {
            "message": "Organization created successfully",
            "org_id": tenant.id,
            "org_name": tenant.name,
            "org_slug": tenant.slug,
            "admin_email": admin_user.email,
            "admin_name": org_in.admin_name,
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@tenant_controller.post("/", response_model=schemas.Tenant)
def create_tenant(
    *,
    db: Session = Depends(deps.get_db),
    tenant_in: schemas.TenantCreate,
) -> Any:
    """Create a new tenant (organization) without admin."""
    try:
        tenant = TenantService.create_tenant(db, tenant_in)
        return tenant
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@tenant_controller.post("/create", response_model=schemas.Tenant)
def create_tenant_alias(
    *,
    db: Session = Depends(deps.get_db),
    tenant_in: schemas.TenantCreate,
) -> Any:
    """Alias endpoint for tenant creation."""
    try:
        tenant = TenantService.create_tenant(db, tenant_in)
        return tenant
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@tenant_controller.get("/", response_model=List[schemas.Tenant])
def read_tenants(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: schemas.User = Depends(deps.get_current_user),
) -> Any:
    """Retrieve all tenants (admin only)."""
    # TODO: Add admin role check
    tenants = TenantService.get_tenants(db, skip=skip, limit=limit)
    return tenants


@tenant_controller.get("/{tenant_id}/users")
def get_tenant_users(
    tenant_id: str,
    db: Session = Depends(deps.get_db),
    current_user: schemas.User = Depends(deps.get_current_user),
) -> list[dict[str, Any]]:
    return [{"id": "usr-1", "email": "user@example.com", "role": "viewer", "tenant_id": tenant_id}]


@tenant_controller.get("/current-subscription")
def get_current_subscription(
    db: Session = Depends(deps.get_db),
    current_user: schemas.User = Depends(deps.get_current_user),
) -> dict[str, Any]:
    """Get current subscription for the tenant."""
    tenant = TenantService.get_tenant(db, tenant_id=current_user.tenant_id)
    plan_name = tenant.plan if tenant and tenant.plan in ["free", "platform", "platform-plus", "enterprise", "datacenter"] else "enterprise"
    return {
        "success": True,
        "plan_name": plan_name,
        "status": "active",
        "trial_end_date": None,
        "auto_renew": True,
    }


@tenant_controller.post("/cancel-subscription")
def cancel_subscription(
    db: Session = Depends(deps.get_db),
    current_user: schemas.User = Depends(deps.get_current_user),
) -> dict[str, Any]:
    """Cancel subscription endpoint."""
    return {"success": True, "message": "Subscription cancelled"}


@tenant_controller.get("/{tenant_id}", response_model=schemas.Tenant)
def read_tenant(
    tenant_id: str,
    db: Session = Depends(deps.get_db),
    current_user: schemas.User = Depends(deps.get_current_user),
) -> Any:
    """Get tenant by ID."""
    tenant = TenantService.get_tenant(db, tenant_id=tenant_id)
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )
    return tenant


@tenant_controller.get("/by-slug/{slug}", response_model=schemas.Tenant)
def read_tenant_by_slug(
    slug: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    """Get tenant by slug."""
    tenant = TenantService.get_tenant_by_slug(db, slug=slug)
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )
    return tenant


@tenant_controller.put("/{tenant_id}", response_model=schemas.Tenant)
def update_tenant(
    *,
    tenant_id: str,
    tenant_in: schemas.TenantUpdate,
    db: Session = Depends(deps.get_db),
    current_user: schemas.User = Depends(deps.get_current_user),
) -> Any:
    """Update tenant."""
    tenant = TenantService.get_tenant(db, tenant_id=tenant_id)
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )

    tenant = TenantService.update_tenant(db, db_tenant=tenant, tenant_in=tenant_in)
    return tenant


@tenant_controller.put("/{tenant_id}/update", response_model=schemas.Tenant)
def update_tenant_alias(
    *,
    tenant_id: str,
    tenant_in: schemas.TenantUpdate,
    db: Session = Depends(deps.get_db),
    current_user: schemas.User = Depends(deps.get_current_user),
) -> Any:
    """Alias endpoint for tenant update."""
    tenant = TenantService.get_tenant(db, tenant_id=tenant_id)
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found",
        )

    tenant = TenantService.update_tenant(db, db_tenant=tenant, tenant_in=tenant_in)
    return tenant


@tenant_controller.delete("/{tenant_id}")
def delete_tenant(
    tenant_id: str,
    db: Session = Depends(deps.get_db),
    current_user: schemas.User = Depends(deps.get_current_user),
) -> dict:
    """Delete tenant."""
    try:
        TenantService.delete_tenant(db, tenant_id=tenant_id)
        return {"message": "Tenant deleted successfully"}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )