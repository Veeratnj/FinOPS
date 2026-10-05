"""
Database session management with proper connection pooling and error handling.
"""

from sqlalchemy import create_engine, event, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import QueuePool
import logging

from app.core.config import settings

# Configure logging
logger = logging.getLogger(__name__)

# Database engine with optimized connection pooling
engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URI,
    poolclass=QueuePool,
    pool_size=10,  # Maximum number of connections in the pool
    max_overflow=20,  # Maximum number of connections that can be created beyond pool_size
    pool_timeout=30,  # Timeout for getting a connection from the pool
    pool_recycle=3600,  # Recycle connections after 1 hour
    pool_pre_ping=True,  # Enable connection health checks
    echo=settings.ENVIRONMENT == "development",  # Log SQL queries in development
    echo_pool=settings.ENVIRONMENT == "development",  # Log connection pool events
    use_insertmanyvalues=False,  # Fix UUID sentinel mismatch with psycopg
)

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False,  # Prevent automatic expiration of objects
)

# Event listeners for connection management
@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    """Set SQLite pragmas for better performance (if using SQLite)."""
    if settings.SQLALCHEMY_DATABASE_URI.startswith("sqlite"):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA synchronous=NORMAL")
        cursor.close()

@event.listens_for(Engine, "connect")
def connect_event(dbapi_connection, connection_record):
    """Log successful database connections."""
    logger.info(f"Connected to database: {settings.POSTGRES_DB} on {settings.POSTGRES_SERVER}:{settings.POSTGRES_PORT}")

# @event.listens_for(Engine, "disconnect")
# def disconnect_event(dbapi_connection, connection_record):
#     """Log database disconnections."""
#     logger.info("Disconnected from database")

def get_db() -> Session:
    """
    Dependency to get database session.

    Yields a database session and ensures it's properly closed after use.
    """
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database session error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def get_db_session() -> Session:
    """
    Get a database session for use in background tasks or utilities.

    Note: Remember to close the session after use.
    """
    return SessionLocal()

def test_connection() -> bool:
    """
    Test database connection.

    Returns True if connection is successful, False otherwise.
    """
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("Database connection test successful")
        return True
    except Exception as e:
        logger.error(f"Database connection test failed: {e}")
        return False

def get_engine():
    """Get the database engine instance."""
    return engine