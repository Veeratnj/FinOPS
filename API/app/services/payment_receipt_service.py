"""
Payment receipts service.
"""

from typing import List, Optional, Any
from sqlalchemy.orm import Session
from app.repositories.payment_receipt_repo import payment_receipt_repo
from app.models import PaymentReceipt


class PaymentReceiptService:
    @staticmethod
    def get_receipts(db: Session, tenant_id: str) -> List[dict[str, Any]]:
        records = payment_receipt_repo.get_by_tenant(db, tenant_id)
        return [
            {
                "id": r.id,
                "vendor": r.vendor,
                "amount": float(r.amount_usd),
                "currency": r.currency,
                "date": r.payment_date.isoformat() if r.payment_date else "",
                "status": r.status.value if hasattr(r.status, "value") else str(r.status),
                "invoiceNumber": r.invoice_number,
                "description": r.description,
                "category": r.category,
                "downloadUrl": r.download_url or f"/receipts/{r.id}.pdf",
            }
            for r in records
        ]

    get_all = get_receipts

    @staticmethod
    def get_receipt(db: Session, tenant_id: str, receipt_id: str) -> Optional[dict[str, Any]]:
        r = payment_receipt_repo.get(db, receipt_id)
        if not r or r.tenant_id != tenant_id:
            return None
        return {
            "id": r.id,
            "vendor": r.vendor,
            "amount": float(r.amount_usd),
            "currency": r.currency,
            "date": r.payment_date.isoformat() if r.payment_date else "",
            "status": r.status.value if hasattr(r.status, "value") else str(r.status),
            "invoiceNumber": r.invoice_number,
            "description": r.description,
            "category": r.category,
            "downloadUrl": r.download_url or f"/receipts/{r.id}.pdf",
        }


payment_receipt_service = PaymentReceiptService()
