"""
Payment receipts controller - serves live payment receipts from PostgreSQL.
"""

from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.services.payment_receipt_service import payment_receipt_service
from app.models import Tenant

payment_receipts_controller = APIRouter(prefix="/payment-receipts", tags=["Payment Receipts"])


def _resolve_tenant_id(current_user: Any, db: Session) -> str:
    if current_user and hasattr(current_user, "tenant_id") and current_user.tenant_id:
        return str(current_user.tenant_id)
    tenant = db.query(Tenant).first()
    return str(tenant.id) if tenant else "default"


@payment_receipts_controller.get("")
def get_payment_receipts(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> list[dict[str, Any]]:
    """Get payment receipts dynamically from database."""
    tenant_id = _resolve_tenant_id(current_user, db)
    return payment_receipt_service.get_receipts(db, tenant_id)


@payment_receipts_controller.get("/{receipt_id}")
def get_payment_receipt(
    receipt_id: str,
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user_optional),
) -> dict[str, Any]:
    """Get a specific payment receipt."""
    tenant_id = _resolve_tenant_id(current_user, db)
    rcpt = payment_receipt_service.get_receipt(db, tenant_id, receipt_id)
    if not rcpt:
        raise HTTPException(status_code=404, detail="Payment receipt not found")
    return rcpt
