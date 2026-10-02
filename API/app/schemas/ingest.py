"""
Ingestion schemas for metrics and inference payloads.
"""

from datetime import datetime
from decimal import Decimal
from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class ResourceRef(BaseModel):
    provider: str
    resource_type: str
    external_id: str
    name: Optional[str] = None
    region: Optional[str] = None
    tags: Optional[Dict[str, Any]] = {}
    metadata: Optional[Dict[str, Any]] = {}


class MetricSampleIn(BaseModel):
    resource_ref: ResourceRef
    metric_name: str
    value: float
    unit: Optional[str] = None
    dimensions: Optional[Dict[str, Any]] = {}
    timestamp: Optional[datetime] = None


class MetricBatch(BaseModel):
    captured_at: Optional[datetime] = None
    samples: List[MetricSampleIn]


class InferenceEvent(BaseModel):
    model_name: str
    request_id: Optional[str] = None
    status: str
    latency_ms: Optional[float] = None
    input_tokens: Optional[int] = None
    output_tokens: Optional[int] = None
    gpu_ms: Optional[float] = None
    cost_usd: Optional[Decimal] = None
    dimensions: Optional[Dict[str, Any]] = {}
    timestamp: Optional[datetime] = None
    resource_ref: Optional[ResourceRef] = None


class InferenceBatch(BaseModel):
    captured_at: Optional[datetime] = None
    events: List[InferenceEvent]
