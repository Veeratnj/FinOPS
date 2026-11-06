"""
Targeted Hardware Orchestration & Docker Fleet Database Seeder Script
(/api/hardware-orchestration & /api/docker).

Seeds Hardware Orchestration and Docker Container Intelligence ONLY for a
specific user and/or organization (matching `create_test_users.py` and `seed_token_ops.py`),
without affecting other tenants.

Usage:
    # 1. Seed BOTH Hardware Orchestration + Docker Fleet for a specific user & org (recommended):
    python3 seed_hardware_docker.py --org sangatna --email gayatri@sangatna.com

    # 2. Seed only Hardware Orchestration OR only Docker Fleet:
    python3 seed_hardware_docker.py --org sangatna --email gayatri@sangatna.com --only hardware
    python3 seed_hardware_docker.py --org sangatna --email gayatri@sangatna.com --only docker

    # 3. Also include Multi-Cloud (/api/multi-cloud) if desired:
    python3 seed_hardware_docker.py --org sangatna --email gayatri@sangatna.com --include-multi-cloud
"""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

CURRENT_DIR = Path(__file__).resolve().parent
if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))

from dotenv import load_dotenv

local_env = CURRENT_DIR / ".env"
root_env = CURRENT_DIR.parent / ".env"
if local_env.is_file():
    load_dotenv(local_env, override=True)
elif root_env.is_file():
    load_dotenv(root_env, override=True)
else:
    load_dotenv()


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Seed Hardware Orchestration (/api/hardware-orchestration) & Docker Fleet (/api/docker) for a specific user/org"
    )
    parser.add_argument(
        "--email",
        type=str,
        default=None,
        help="Target user email (e.g. gayatri@sangatna.com)",
    )
    parser.add_argument(
        "--org",
        type=str,
        default=None,
        help="Target tenant organization slug (e.g. sangatna)",
    )
    parser.add_argument(
        "--only",
        type=str,
        choices=["both", "hardware", "docker"],
        default="both",
        help="Seed both modules (default), or only 'hardware' or 'docker'",
    )
    parser.add_argument(
        "--include-multi-cloud",
        action="store_true",
        help="Also seed Multi-Cloud analytics (/api/multi-cloud) for the target org",
    )
    parser.add_argument(
        "--all-orgs",
        action="store_true",
        help="Explicitly seed all organizations (optional)",
    )
    parser.add_argument(
        "--database-url",
        type=str,
        default=None,
        help="Optional SQLAlchemy PostgreSQL URI override",
    )
    args = parser.parse_args()

    if not args.email and not args.org and not args.all_orgs:
        parser.error("Provide --email <user@domain.com> and/or --org <slug> (or --all-orgs).")

    if args.database_url:
        os.environ["DATABASE_URL"] = args.database_url

    from sqlalchemy import create_engine, func
    from sqlalchemy.orm import sessionmaker
    from app.core.config import Settings, settings
    from app.models import Base, Tenant, User
    from app.services.intelligence_service import IntelligenceService

    if args.database_url:
        db_uri = args.database_url
    elif local_env.is_file():
        load_dotenv(local_env, override=True)
        db_uri = Settings(_env_file=str(local_env)).SQLALCHEMY_DATABASE_URI
    else:
        db_uri = settings.SQLALCHEMY_DATABASE_URI

    print("=" * 70)
    print("AI FinOps Platform - Targeted Hardware & Docker Fleet Seeder")
    print(f"Database : {db_uri.split('@')[-1] if '@' in db_uri else db_uri}")
    print("=" * 70)

    engine = create_engine(db_uri, pool_pre_ping=True)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        targets: list[tuple[Tenant, User | None]] = []

        if args.all_orgs:
            for t in db.query(Tenant).all():
                targets.append((t, None))
        elif args.org and args.email:
            clean_email = args.email.strip().lower()
            tenant = db.query(Tenant).filter(Tenant.slug == args.org.strip()).first()
            if not tenant:
                print(f"[ERROR] Organization with slug '{args.org}' not found.", file=sys.stderr)
                sys.exit(1)

            user = (
                db.query(User)
                .filter(User.tenant_id == tenant.id, func.lower(User.email) == clean_email)
                .first()
            )
            if not user:
                print(
                    f"[ERROR] User '{clean_email}' not found under organization '{tenant.slug}' ({tenant.name}).",
                    file=sys.stderr,
                )
                sys.exit(1)

            other_users = (
                db.query(User, Tenant)
                .join(Tenant, User.tenant_id == Tenant.id)
                .filter(func.lower(User.email) == clean_email, User.tenant_id != tenant.id)
                .all()
            )
            if other_users:
                other_slugs = ", ".join(f"{t.slug} (user_id={u.id})" for u, t in other_users)
                print(
                    f"[!] WARNING: '{clean_email}' also exists in other org(s): {other_slugs}.\n"
                    f"    Ensure backend is up to date (git pull) so login resolves to '{tenant.slug}'."
                )

            targets.append((tenant, user))

        elif args.email:
            clean_email = args.email.strip().lower()
            matched = (
                db.query(User, Tenant)
                .join(Tenant, User.tenant_id == Tenant.id)
                .filter(func.lower(User.email) == clean_email)
                .order_by(User.updated_at.desc(), User.created_at.desc())
                .all()
            )
            if not matched:
                print(f"[ERROR] No user found with email '{clean_email}'.", file=sys.stderr)
                sys.exit(1)

            if len(matched) > 1:
                orgs_str = ", ".join(t.slug for _, t in matched)
                print(
                    f"[!] Note: '{clean_email}' exists in {len(matched)} orgs ({orgs_str}). "
                    f"Pass --org <slug> to target only one. Seeding most recent org '{matched[0][1].slug}'."
                )
            targets.append((matched[0][1], matched[0][0]))

        elif args.org:
            tenant = db.query(Tenant).filter(Tenant.slug == args.org.strip()).first()
            if not tenant:
                print(f"[ERROR] Organization with slug '{args.org}' not found.", file=sys.stderr)
                sys.exit(1)
            targets.append((tenant, None))

        for tenant, user in targets:
            display_name = user.name if user and user.name else (user.email if user else None)
            user_info = f" | user='{user.email}' ({display_name})" if user else ""
            print(f"[*] Target Org: '{tenant.name}' (slug='{tenant.slug}', id={tenant.id}){user_info}")

            if args.only in ("both", "hardware"):
                hw_res = IntelligenceService.seed_hardware_orchestration(db, tenant_id=tenant.id, force=True)
                print(
                    f"    [OK] Seeded hardware_orchestration -> id={hw_res.get('id')} "
                    f"({hw_res.get('summary', {}).get('totalAccelerators', 0)} accelerators, "
                    f"{len(hw_res.get('recommendations', []))} recommendations)"
                )

            if args.only in ("both", "docker"):
                dk_res = IntelligenceService.seed_docker_analytics(db, tenant_id=tenant.id, force=True)
                print(
                    f"    [OK] Seeded docker_analytics       -> id={dk_res.get('id')} "
                    f"({len(dk_res.get('hostNodes', []))} hosts, "
                    f"{len(dk_res.get('containers', []))} containers, "
                    f"{len(dk_res.get('storageWaste', []))} storageWaste items)"
                )

            if args.include_multi_cloud:
                mc_res = IntelligenceService.seed_multi_cloud_analytics(db, tenant_id=tenant.id, force=True)
                print(
                    f"    [OK] Seeded multi_cloud_analytics  -> id={mc_res.get('id')} "
                    f"({len(mc_res.get('trend', []))} trend months)"
                )

        print("=" * 70)
        print("Done! Refresh Hardware Orchestration and Docker Fleet in the UI.")
        print("=" * 70)

    except Exception as exc:
        db.rollback()
        print(f"[ERROR] Failed to seed Hardware/Docker data: {exc}", file=sys.stderr)
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()

