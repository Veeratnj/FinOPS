"""
Payment receipt repository.
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from app.models import PaymentReceipt, PaymentReceiptStatus
from app.repositories.base import BaseRepository


class PaymentReceiptRepository(BaseRepository[PaymentReceipt]):
    """Payment receipt repository."""

    def get_by_tenant(self, db: Session, tenant_id: str) -> List[PaymentReceipt]:
        return db.query(PaymentReceipt).filter(PaymentReceipt.tenant_id == tenant_id).order_by(PaymentReceipt.payment_date.desc()).all()

    def get_by_vendor(self, db: Session, tenant_id: str, vendor: str) -> List[PaymentReceipt]:
        return db.query(PaymentReceipt).filter(
            PaymentReceipt.tenant_id == tenant_id,
            PaymentReceipt.vendor.ilike(f"%{vendor}%")
        ).all()

    def get_by_status(self, db: Session, tenant_id: str, status: PaymentReceiptStatus) -> List[PaymentReceipt]:
        return db.query(PaymentReceipt).filter(
            PaymentReceipt.tenant_id == tenant_id,
            PaymentReceipt.status == status
        ).all()


payment_receipt_repo = PaymentReceiptRepository(PaymentReceipt)
