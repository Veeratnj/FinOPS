"""
Custom middleware for tenant injection and request logging.
"""

import time
from typing import Callable

from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.exceptions import FinOpsException
from app.core.logging import structlog


logger = structlog.get_logger(__name__)


class TenantMiddleware(BaseHTTPMiddleware):
    """Middleware to inject tenant_id from JWT token into request state."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Extract tenant_id from Authorization header
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            try:
                from app.core.security import verify_token
                payload = verify_token(token)
                tenant_id = payload.get("tenant_id")
                if tenant_id:
                    request.state.tenant_id = tenant_id
            except Exception:
                # Invalid token, continue without tenant_id
                pass

        response = await call_next(request)
        return response


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for logging requests and responses."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start_time = time.time()

        # Log request
        logger.info(
            "Request started",
            method=request.method,
            url=str(request.url),
            headers=dict(request.headers),
            tenant_id=getattr(request.state, "tenant_id", None),
        )

        try:
            response = await call_next(request)
            process_time = time.time() - start_time

            # Log response
            logger.info(
                "Request completed",
                method=request.method,
                url=str(request.url),
                status_code=response.status_code,
                process_time=f"{process_time:.4f}s",
                tenant_id=getattr(request.state, "tenant_id", None),
            )

            return response

        except Exception as exc:
            process_time = time.time() - start_time
            logger.error(
                "Request failed",
                method=request.method,
                url=str(request.url),
                error=str(exc),
                process_time=f"{process_time:.4f}s",
                tenant_id=getattr(request.state, "tenant_id", None),
            )
            raise


class ExceptionHandlerMiddleware(BaseHTTPMiddleware):
    """Middleware to handle exceptions and return proper JSON responses."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        try:
            return await call_next(request)
        except FinOpsException as exc:
            return JSONResponse(
                status_code=exc.status_code,
                content={"detail": exc.detail},
            )
        except Exception as exc:
            logger.error("Unhandled exception", error=str(exc))
            return JSONResponse(
                status_code=500,
                content={"detail": "Internal server error"},
            )