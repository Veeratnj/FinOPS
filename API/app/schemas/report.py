"""
Report schemas.
"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ReportBase(BaseModel):
    """Base report schema."""
    name: str
    frequency: str
    recipients: List[str] = []
    format: str


class Report(ReportBase):
    """Report response schema."""
    id: str
    last_run: Optional[datetime] = None

    class Config:
        from_attributes = True


class ReportCreate(ReportBase):
    """Create report request."""
    pass


class ReportUpdate(BaseModel):
    """Update report request."""
    recipients: Optional[List[str]] = None


class ReportGenerate(BaseModel):
    """Report generation response."""
    message: str
    job_id: str


class ReportDownload(BaseModel):
    """Report download response."""
    download_url: str


class ReportSchedule(BaseModel):
    """Report schedule."""
    name: str
    frequency: str
    last_run: Optional[datetime] = None
