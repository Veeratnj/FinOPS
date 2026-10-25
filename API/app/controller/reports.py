"""
Reports controller - serves dynamic report configurations and exports from PostgreSQL.
"""

from typing import Any
from fastapi import APIRouter, Body, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app.services.reports_service import reports_service
from app.models import Tenant

reports_controller = APIRouter(prefix="/reports", tags=["Reports"])


def _resolve_tenant_id(current_user: Any, db: Session) -> str:
    if current_user and hasattr(current_user, "tenant_id") and current_user.tenant_id:
        return str(current_user.tenant_id)
    tenant = db.query(Tenant).first()
    return str(tenant.id) if tenant else "default"


@reports_controller.get("")
def get_reports(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> list[dict[str, Any]]:
    """Get all reports dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return reports_service.get_reports(db, tenant_id)


@reports_controller.post("/create", status_code=status.HTTP_201_CREATED)
def create_report(
    payload: dict[str, Any] = Body(...),
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> dict[str, Any]:
    """Create a new report in the database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return reports_service.create_report(db, tenant_id, payload)


@reports_controller.delete("/{report_id}")
def delete_report(
    report_id: str,
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> dict[str, Any]:
    """Delete a report from the database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    success = reports_service.delete_report(db, tenant_id, report_id)
    if not success:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"message": f"Report {report_id} deleted."}


@reports_controller.post("/{report_id}/generate")
def generate_report(report_id: str) -> dict[str, Any]:
    return {"message": "Report generation started.", "jobId": f"job-{report_id}"}


@reports_controller.get("/{report_id}/download")
def download_report(report_id: str) -> dict[str, Any]:
    return {"downloadUrl": f"/reports/{report_id}.pdf"}
