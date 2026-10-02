"""
Agent schemas.
"""

from datetime import datetime
from typing import Optional

from .base import BaseSchema, TimestampMixin


class AgentBase(BaseSchema):
    name: str
    framework: Optional[str] = None
    version: Optional[str] = None
    status: Optional[str] = "active"
    metadata: Optional[dict] = {}


class AgentCreate(AgentBase):
    pass


class AgentHeartbeat(BaseSchema):
    last_seen_at: Optional[datetime] = None


class Agent(AgentBase, TimestampMixin):
    id: str
    tenant_id: str
    auth_token_expires_at: Optional[datetime] = None
    last_seen_at: Optional[datetime] = None


class AgentWithToken(Agent):
    auth_token: Optional[str] = None
