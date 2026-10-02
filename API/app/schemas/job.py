"""
Job schemas.
"""

from datetime import datetime
from typing import Dict, Optional

from pydantic import BaseModel

from .base import BaseSchema, TimestampMixin


class JobBase(BaseSchema):
    """Base job schema."""
    name: str
    job_type: str
    status: str
    priority: int = 5
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None
    duration_seconds: Optional[int] = None
    prompt_tokens: Optional[int] = None
    completion_tokens: Optional[int] = None
    tags: Optional[Dict] = {}
    metadata_: Optional[Dict] = {}


class JobCreate(BaseModel):
    """Job creation schema."""
    name: str
    job_type: str
    agent_id: Optional[str] = None
    cluster_id: Optional[str] = None
    priority: int = 5
    tags: Optional[Dict] = {}
    metadata_: Optional[Dict] = {}


class JobUpdate(BaseModel):
    """Job update schema."""
    name: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[int] = None
    tags: Optional[Dict] = None
    metadata_: Optional[Dict] = None


class Job(JobBase, TimestampMixin):
    """Job response schema."""
    id: str
    tenant_id: str
    agent_id: Optional[str] = None
    cluster_id: Optional[str] = None
    parent_job_id: Optional[str] = None