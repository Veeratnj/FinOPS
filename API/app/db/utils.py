"""
Database utilities for testing connections and managing database operations.
"""

import logging
from contextlib import contextmanager
from typing import Generator

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import SessionLocal, engine, test_connection
from app.models import Base

logger = logging.getLogger(__name__)


@contextmanager
def get_db_session() -> Generator[Session, None, None]:
    """
    Context manager for database sessions.

    Usage:
        with get_db_session() as db:
            # Use db session
            pass
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Database transaction failed: {e}")
        raise
    finally:
        db.close()


def create_tables():
    """Create all database tables."""
    logger.info("Creating database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Failed to create tables: {e}")
        raise


def drop_tables():
    """Drop all database tables."""
    logger.warning("Dropping all database tables...")
    try:
        Base.metadata.drop_all(bind=engine)
        logger.info("Database tables dropped successfully")
    except Exception as e:
        logger.error(f"Failed to drop tables: {e}")
        raise


def reset_database():
    """Reset database by dropping and recreating all tables."""
    logger.warning("Resetting database...")
    drop_tables()
    create_tables()
    logger.info("Database reset complete")


def get_database_info():
    """Get database connection information."""
    return {
        "database": settings.POSTGRES_DB,
        "host": settings.POSTGRES_SERVER,
        "port": settings.POSTGRES_PORT,
        "user": settings.POSTGRES_USER,
        "uri": settings.SQLALCHEMY_DATABASE_URI.replace(settings.POSTGRES_PASSWORD, "***"),
    }


def execute_raw_sql(sql: str, params: dict = None):
    """
    Execute raw SQL query.

    Args:
        sql: SQL query string
        params: Query parameters

    Returns:
        Query result
    """
    with get_db_session() as db:
        try:
            result = db.execute(text(sql), params or {})
            return result.fetchall()
        except Exception as e:
            logger.error(f"Raw SQL execution failed: {e}")
            raise


def check_database_health():
    """
    Check database health and return status information.

    Returns:
        dict: Health check results
    """
    health_info = {
        "connection": False,
        "tables_exist": False,
        "database_info": get_database_info(),
    }

    try:
        # Test connection
        health_info["connection"] = test_connection()

        if health_info["connection"]:
            # Check if tables exist
            with get_db_session() as db:
                result = db.execute(text("""
                    SELECT COUNT(*) as table_count
                    FROM information_schema.tables
                    WHERE table_schema = 'public'
                """))
                table_count = result.scalar()
                health_info["tables_exist"] = table_count > 0
                health_info["table_count"] = table_count

    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        health_info["error"] = str(e)

    return health_info


if __name__ == "__main__":
    # Test database connection when run directly
    print("Testing database connection...")
    health = check_database_health()

    print(f"Connection: {'✓' if health['connection'] else '✗'}")
    print(f"Database: {health['database_info']['database']}")
    print(f"Host: {health['database_info']['host']}:{health['database_info']['port']}")

    if health.get("tables_exist"):
        print(f"Tables: ✓ ({health.get('table_count', 0)} tables)")
    else:
        print("Tables: ✗ (No tables found)")

    if "error" in health:
        print(f"Error: {health['error']}")