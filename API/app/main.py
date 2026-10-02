"""
AI FinOps Platform - FastAPI Application
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.controller import (
    auth_controller,
    dashboard_controller,
    recommendations_controller,
    anomalies_controller,
    kubernetes_controller,
    cost_allocation_controller,
    cost_analyzer_controller,
    categories_controller,
    unit_economics_controller,
    budgets_controller,
    virtual_tags_controller,
    reports_controller,
    forecasting_controller,
    payment_receipts_controller,
    users_controller,
    tenant_controller,
    user_operations_controller,
    metrics_controller,

)
from app.core.config import settings
from app.core.logging import setup_logging
from app.core.middleware import ExceptionHandlerMiddleware, RequestLoggingMiddleware, TenantMiddleware
from app.db.session import engine
from app.models import Base
from fastapi.routing import APIRouter


from typing import AsyncGenerator

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan context manager."""
    # Startup
    setup_logging()
    # Create tables if they don't exist (in production, use migrations)
    if settings.ENVIRONMENT == "development":
        Base.metadata.create_all(bind=engine)

    yield

    # Shutdown
    # Close connections, etc.


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI FinOps Platform API",
    lifespan=lifespan,
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.ALLOWED_HOSTS)

# Custom middleware
app.add_middleware(TenantMiddleware)
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(ExceptionHandlerMiddleware)

# Register all routers under an API router
api_router = APIRouter(prefix=settings.API_V1_STR)

api_router.include_router(anomalies_controller)
api_router.include_router(auth_controller)
api_router.include_router(categories_controller)
api_router.include_router(cost_allocation_controller)
api_router.include_router(cost_analyzer_controller)
api_router.include_router(dashboard_controller)
api_router.include_router(forecasting_controller)
api_router.include_router(kubernetes_controller)
api_router.include_router(metrics_controller)
api_router.include_router(recommendations_controller)
api_router.include_router(reports_controller)
api_router.include_router(payment_receipts_controller)
api_router.include_router(tenant_controller)
api_router.include_router(unit_economics_controller)
api_router.include_router(budgets_controller)
api_router.include_router(users_controller)
api_router.include_router(user_operations_controller)
api_router.include_router(virtual_tags_controller)

app.include_router(api_router)
app.include_router(dashboard_controller)
app.include_router(metrics_controller)


@app.get("/health")
async def health_check() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy", "version": settings.VERSION}