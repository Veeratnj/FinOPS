"""
Test account creation helper for Ctrls-API.

This script creates:
- a tenant organization
- an admin user
- a normal viewer user

Run it from the repository root with:
    python fake.py
"""

from dotenv import load_dotenv

from app.core.config import settings
from app.db.session import SessionLocal, engine
from app.models.all_models import Base
from app.services.tenant_service import TenantService
from app.services.auth_service import AuthService
from app import schemas


def create_test_accounts() -> None:
    load_dotenv()
    print("Using database:", settings.SQLALCHEMY_DATABASE_URI)

    # Ensure tables exist in development environments
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        org_data = {
            "org_name": "Auralistic",
            "org_slug": "auralistic",
            "org_plan": "starter",
            "admin_email": "admin@auralistic.com",
            "admin_password": "admin@123",
            "admin_name": "Admin",
        }

        user_data = {
            "email": "it@auralistic.com",
            "password": "admin@123",
            "role": "viewer",
        }

        print("Creating tenant and admin user...")
        org_in = schemas.OrgAdminCreate(**org_data)
        tenant, admin_user = TenantService.create_tenant_with_admin(db, org_in)

        print("Created organization:", tenant.name, tenant.slug)
        print("Admin user:", admin_user.email)
        print("Admin tenant_id:", admin_user.tenant_id)
        print("Admin user id:", admin_user.id)

        print("Creating regular viewer user...")
        user_in = schemas.UserCreate(
            email=user_data["email"],
            password=user_data["password"],
            role=user_data["role"],
            tenant_id=tenant.id,
        )

        viewer_user = AuthService.create_user(db, user_in)

        print("Created viewer user:", viewer_user.email)
        print("Viewer user id:", viewer_user.id)

        print("\nTest accounts created successfully.")
        print("Admin login : admin@auralistic.com / admin@123")
        print("Viewer login: it@auralistic.com / admin@123")
        print("Use POST /auth/login with username and password.")

    except Exception as exc:
        db.rollback()
        print("Error creating test accounts:", repr(exc))

    finally:
        db.close()


if __name__ == "__main__":
    create_test_accounts()