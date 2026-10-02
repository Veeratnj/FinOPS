"""
Database base configuration for SQLAlchemy models and Alembic migrations.
"""

from app.models import Base

# Export Base for use in Alembic migrations
__all__ = ["Base"]