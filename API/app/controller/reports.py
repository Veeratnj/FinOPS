"""Reports controller."""

from typing import Any

from fastapi import APIRouter, Body, status

reports_controller = APIRouter(prefix="/reports", tags=["Reports"])


@reports_controller.get("")
def get_reports() -> list[dict[str, Any]]:
    return [
        {"name": "Weekly Cost Summary", "frequency": "Weekly", "recipients": ["cfo@company.com"], "lastRun": "2026-03-10T08:00:00Z", "format": "PDF"},
    ]


@reports_controller.get("/{report_id}")
def get_report(report_id: str) -> dict[str, Any]:
    return {"id": report_id, "name": "Weekly Cost Summary", "frequency": "Weekly", "recipients": ["cfo@company.com"], "lastRun": "2026-03-10T08:00:00Z", "format": "PDF"}


@reports_controller.post("/create", status_code=status.HTTP_201_CREATED)
def create_report(payload: dict[str, Any] = Body(...)) -> dict[str, Any]:
    return {"id": "rpt-1711361400000", "message": "Report created successfully."}


@reports_controller.put("/{report_id}/update")
def update_report(report_id: str, payload: dict[str, Any] = Body(...)) -> dict[str, Any]:
    return {"id": report_id, "name": "Weekly Cost Summary", "updated": True}


@reports_controller.delete("/{report_id}")
def delete_report(report_id: str) -> dict[str, Any]:
    return {"message": f"Report {report_id} deleted."}


@reports_controller.post("/{report_id}/generate")
def generate_report(report_id: str) -> dict[str, Any]:
    return {"message": "Report generation started.", "jobId": f"job-{report_id}"}


@reports_controller.get("/{report_id}/download")
def download_report(report_id: str) -> dict[str, Any]:
    return {"downloadUrl": f"/exports/{report_id}_report.pdf"}


@reports_controller.get("/schedules")
def get_report_schedules() -> list[dict[str, Any]]:
    return [{"name": "Weekly Cost Summary", "frequency": "Weekly", "lastRun": "2026-03-10T08:00:00Z"}]


@reports_controller.get("/sample")
def sample_reports():
    return {
        'data': [],
        'msg': "Reports fetched successfully"
    }

