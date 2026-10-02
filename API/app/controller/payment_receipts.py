"""Payment receipts controller."""

from typing import Any

from fastapi import APIRouter, File, UploadFile, status

payment_receipts_controller = APIRouter(prefix="/payment-receipts", tags=["Payment Receipts"])


@payment_receipts_controller.get("")
def get_payment_receipts() -> list[dict[str, Any]]:
    return [
        {
            "id": "rcpt-1",
            "vendor": "AWS",
            "amount": 68500,
            "currency": "USD",
            "date": "2026-03-01T00:00:00Z",
            "status": "paid",
            "invoiceNumber": "INV-AWS-2026-03",
            "description": "AWS Monthly Bill - March 2026",
            "category": "Compute",
            "downloadUrl": "/receipts/rcpt-1.pdf",
        }
    ]


@payment_receipts_controller.get("/{receipt_id}")
def get_payment_receipt(receipt_id: str) -> dict[str, Any]:
    return {
        "id": receipt_id,
        "vendor": "AWS",
        "amount": 68500,
        "currency": "USD",
        "date": "2026-03-01T00:00:00Z",
        "status": "paid",
        "invoiceNumber": "INV-AWS-2026-03",
        "description": "AWS Monthly Bill - March 2026",
        "category": "Compute",
        "downloadUrl": "/receipts/rcpt-1.pdf",
    }


@payment_receipts_controller.get("/vendor/{vendor}")
def get_payment_receipts_by_vendor(vendor: str) -> list[dict[str, Any]]:
    return [
        {
            "id": "rcpt-1",
            "vendor": vendor,
            "amount": 68500,
            "currency": "USD",
            "date": "2026-03-01T00:00:00Z",
            "status": "paid",
            "invoiceNumber": "INV-AWS-2026-03",
            "description": "AWS Monthly Bill - March 2026",
            "category": "Compute",
            "downloadUrl": "/receipts/rcpt-1.pdf",
        }
    ]


@payment_receipts_controller.get("/{receipt_id}/download")
def download_payment_receipt(receipt_id: str) -> dict[str, Any]:
    return {"downloadUrl": f"/receipts/{receipt_id}.pdf"}


@payment_receipts_controller.post("/upload", status_code=status.HTTP_201_CREATED)
def upload_payment_receipt(file: UploadFile = File(...)) -> dict[str, Any]:
    return {"id": "rcpt-1711361400000", "message": "Receipt uploaded."}


@payment_receipts_controller.get("/summary")
def get_payment_receipts_summary() -> dict[str, Any]:
    return {"total": 237700, "paid": 4, "pending": 1}
