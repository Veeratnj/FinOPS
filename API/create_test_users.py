"""
AI FinOps Platform - Test User Creation & Seeding Script

Usage:
    # 1. Insert/update default suite of test users (admin, manager, analyst, viewer):
    python create_test_users.py

    # 2. Insert or update a specific custom user:
    python create_test_users.py --email dev@example.com --password mypass123 --role admin --org finops-corp
"""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Ensure API package is in sys.path even when script is run from project root
current_dir = Path(__file__).resolve().parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

from dotenv import load_dotenv

# Load local API .env first (if present), then fallback to root .env
local_env = current_dir / ".env"
root_env = current_dir.parent / ".env"
if local_env.is_file():
    load_dotenv(local_env, override=True)
elif root_env.is_file():
    load_dotenv(root_env, override=True)
else:
    load_dotenv()

from sqlalchemy import text
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.security import get_password_hash
from app.db.session import SessionLocal, engine
from app.models import Base, Tenant, User


DEFAULT_TEST_USERS = [
    {
        "email": "testuser@finops.com",
        "password": "admin@123",
        "role": "admin",
        "name": "Test Admin",
    },
    {
        "email": "admin@finops.com",
        "password": "admin@123",
        "role": "admin",
        "name": "Enterprise Administrator",
    },
    {
        "email": "manager@finops.com",
        "password": "manager@123",
        "role": "manager",
        "name": "FinOps Operations Manager",
    },
    {
        "email": "analyst@finops.com",
        "password": "analyst@123",
        "role": "analyst",
        "name": "Cloud Cost Analyst",
    },
    {
        "email": "viewer@finops.com",
        "password": "viewer@123",
        "role": "viewer",
        "name": "Read-Only Viewer",
    },
]


def get_or_create_tenant(
    db: Session,
    slug: str = "finops-corp",
    name: str | None = None,
    plan: str = "enterprise",
) -> Tenant:
    """Find an existing tenant organization or create a new one."""
    tenant = db.query(Tenant).filter(Tenant.slug == slug).first()
    if not tenant:
        display_name = name if name else (
            "FinOps Enterprise Corp" if slug == "finops-corp" else slug.replace("-", " ").replace("_", " ").title()
        )
        tenant = Tenant(
            name=display_name,
            slug=slug,
            plan=plan,
            is_active=True,
            metadata_={
                "industry": "Cloud & AI Infrastructure",
                "admin_name": f"{display_name} Admin",
            },
        )
        db.add(tenant)
        db.commit()
        db.refresh(tenant)
        print(f"[+] Created Organization: '{tenant.name}' (slug: {tenant.slug}, id: {tenant.id})")
    else:
        print(f"[*] Using Organization: '{tenant.name}' (slug: {tenant.slug})")
    return tenant  # type: ignore[return-value]


def insert_or_update_user(
    db: Session,
    tenant_id: str,
    email: str,
    password: str,
    role: str,
    name: str | None = None,
    department: str | None = None,
) -> tuple[User, bool]:
    """Insert or update user record."""
    clean_email = email.strip().lower()
    user = (
        db.query(User)
        .filter(User.tenant_id == tenant_id, User.email == clean_email)
        .first()
    )

    is_created = False
    hashed_pwd = get_password_hash(password)

    if not user:
        user = User(
            email=clean_email,
            password_hash=hashed_pwd,
            role=role,
            tenant_id=tenant_id,
            is_active=True,
            name=name,
            department=department,
        )
        db.add(user)
        is_created = True
    else:
        user.password_hash = hashed_pwd
        user.role = role
        user.is_active = True
        if name is not None:
            user.name = name
        if department is not None:
            user.department = department

    db.commit()
    db.refresh(user)
    return user, is_created


def main() -> None:
    parser = argparse.ArgumentParser(description="Insert test users for AI FinOps Platform")
    parser.add_argument("--email", type=str, help="User email address")
    parser.add_argument("--password", type=str, help="User password")
    parser.add_argument("--name", type=str, default=None, help="User display name")
    parser.add_argument("--department", type=str, default=None, help="User department")
    parser.add_argument("--role", type=str, default="admin", choices=["admin", "manager", "analyst", "viewer", "owner"], help="User role")
    parser.add_argument("--org", type=str, default="finops-corp", help="Tenant organization slug")
    parser.add_argument("--org-name", type=str, default=None, help="Tenant organization display name")
    parser.add_argument("--org-plan", type=str, default="enterprise", choices=["starter", "pro", "enterprise"], help="Tenant plan")
    parser.add_argument("--org-only", action="store_true", help="Only create or verify the organization")
    args = parser.parse_args()

    print("=" * 65)
    print("AI FinOps Platform - Test User Seeder")
    print("Database:", settings.SQLALCHEMY_DATABASE_URI)
    print("=" * 65)

    # Ensure tables exist and patch any missing columns on existing tables
    try:
        Base.metadata.create_all(bind=engine)
        with engine.begin() as conn:
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);"))
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS department VARCHAR(255);"))
    except Exception as e:
        print(f"[-] Warning creating tables / migrating columns: {e}")

    db = SessionLocal()
    try:
        tenant = get_or_create_tenant(db, slug=args.org, name=args.org_name, plan=args.org_plan)

        if args.org_only:
            print("\n" + "=" * 65)
            print(f"[OK] Organization ready!")
            print(f"     ID   : {tenant.id}")
            print(f"     Name : {tenant.name}")
            print(f"     Slug : {tenant.slug}")
            print(f"     Plan : {tenant.plan}")
            print("=" * 65)
            return

        results = []

        if args.email and args.password:
            # Single user mode
            user, is_created = insert_or_update_user(
                db,
                tenant_id=tenant.id,
                email=args.email,
                password=args.password,
                role=args.role,
                name=args.name,
                department=args.department,
            )
            results.append({
                "email": user.email,
                "password": args.password,
                "role": user.role,
                "status": "Created" if is_created else "Updated",
            })
        else:
            # Batch default test users mode
            print("\n[*] Inserting / Updating default test users suite...")
            for item in DEFAULT_TEST_USERS:
                user, is_created = insert_or_update_user(
                    db,
                    tenant_id=tenant.id,
                    email=item["email"],
                    password=item["password"],
                    role=item["role"],
                    name=item.get("name"),
                    department=item.get("department"),
                )
                results.append({
                    "email": user.email,
                    "password": item["password"],
                    "role": user.role,
                    "status": "Created" if is_created else "Updated",
                })

        print("\n" + "=" * 65)
        print(f"{'Email':<28} | {'Password':<12} | {'Role':<8} | {'Status'}")
        print("-" * 65)
        for r in results:
            print(f"{r['email']:<28} | {r['password']:<12} | {r['role']:<8} | {r['status']}")
        print("=" * 65)
        print("\n[OK] Ready! You can log in on the frontend with any of the accounts above.")

    except Exception as e:
        db.rollback()
        print(f"\n[-] Error: {e}")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
