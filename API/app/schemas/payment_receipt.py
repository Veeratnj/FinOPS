"""
Payment Receipt schemas.
"""

from pydantic import BaseModel
from decimal import Decimal
from typing import Optional
from datetime import datetime


class PaymentReceiptBase(BaseModel):
    """Base payment receipt schema."""
    vendor: str
    amount: Decimal
    currency: str
    date: datetime
    status: str
    invoice_number: Optional[str] = None
    description: Optional[str] = None
    category: str


class PaymentReceipt(PaymentReceiptBase):
    """Payment receipt response schema."""
    id: str
    download_url: Optional[str] = None

    class Config:
        from_attributes = True


class PaymentReceiptDownload(BaseModel):
    """Payment receipt download response."""
    download_url: str


class PaymentReceiptSummary(BaseModel):
    """Payment receipt summary."""
    total: Decimal
    paid: int
    pending: int
