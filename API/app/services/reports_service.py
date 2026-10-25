"""
Reports service.
"""

from typing import List, Optional, Any
from sqlalchemy.orm import Session
from app.repositories.report_repo import report_repo
from app.models import Report, ReportFrequency, ReportFormat


class ReportsService:
    @staticmethod
    def get_reports(db: Session, tenant_id: str) -> List[dict[str, Any]]:
        records = report_repo.get_by_tenant(db, tenant_id)
        return [
            {
                "id": r.id,
                "name": r.name,
                "frequency": r.frequency.value if hasattr(r.frequency, "value") else str(r.frequency),
                "recipients": r.recipients or [],
                "lastRun": r.last_run_at.isoformat() if r.last_run_at else "2026-03-20T08:00:00Z",
                "format": r.format.value if hasattr(r.format, "value") else str(r.format),
                "downloadUrl": r.download_url or f"/reports/{r.id}.pdf",
                "isActive": r.is_active,
            }
            for r in records
        ]

    get_all = get_reports

    @staticmethod
    def create_report(db: Session, tenant_id: str, data: dict[str, Any]) -> dict[str, Any]:
        freq = ReportFrequency(data.get("frequency", "Weekly"))
        fmt = ReportFormat(data.get("format", "PDF"))
        report = Report(
            tenant_id=tenant_id,
            name=data["name"],
            frequency=freq,
            format=fmt,
            recipients=data.get("recipients", []),
        )
        db.add(report)
        db.commit()
        db.refresh(report)
        return {"id": report.id, "message": "Report created successfully."}

    @staticmethod
    def delete_report(db: Session, tenant_id: str, report_id: str) -> bool:
        r = report_repo.get(db, report_id)
        if r and r.tenant_id == tenant_id:
            report_repo.remove(db, id=report_id)
            return True
        return False


reports_service = ReportsService()
