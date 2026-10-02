"""
AI FinOps Platform — SQLAlchemy ORM Models
Multi-tenant (tenant_id on every table), PostgreSQL backend.

Tables:
  Core:       tenants, users
  Resources:  accelerators (GPU/TPU/LPU), k8s_clusters, k8s_nodes, k8s_pods
  AI Work:    agents, orchestration_jobs, job_resource_usage
  Metrics:    resource_hourly_metrics (TimescaleDB-friendly)
  Billing:    cloud_accounts, cost_line_items, job_cost_aggregates
"""

from __future__ import annotations
import enum
import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    BigInteger, Boolean, CheckConstraint, DateTime, Enum,
    ForeignKey, Index, Integer, Numeric, String, Text, UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


# ──────────────────────────────────────────────
# Base
# ──────────────────────────────────────────────

class Base(DeclarativeBase):
    pass


def gen_uuid() -> str:
    return str(uuid.uuid4())


# ──────────────────────────────────────────────
# Enums
# ──────────────────────────────────────────────

class AcceleratorType(str, enum.Enum):
    GPU = "GPU"
    TPU = "TPU"
    LPU = "LPU"
    OTHER = "OTHER"


class AcceleratorStatus(str, enum.Enum):
    AVAILABLE = "available"
    IN_USE = "in_use"
    RESERVED = "reserved"
    OFFLINE = "offline"


class K8sNodeStatus(str, enum.Enum):
    READY = "ready"
    NOT_READY = "not_ready"
    UNKNOWN = "unknown"


class PodPhase(str, enum.Enum):
    PENDING = "Pending"
    RUNNING = "Running"
    SUCCEEDED = "Succeeded"
    FAILED = "Failed"
    UNKNOWN = "Unknown"


class JobStatus(str, enum.Enum):
    QUEUED = "queued"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class AgentStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    DEPRECATED = "deprecated"


class CostLineItemType(str, enum.Enum):
    COMPUTE = "compute"
    MEMORY = "memory"
    STORAGE = "storage"
    NETWORK = "network"
    LICENSING = "licensing"
    OTHER = "other"


# ──────────────────────────────────────────────
# Mixins
# ──────────────────────────────────────────────

class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(),
        onupdate=func.now(), nullable=False
    )


class TenantMixin:
    """Every table carries tenant_id for row-level isolation."""
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False),
        ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )


# ──────────────────────────────────────────────
# Core
# ──────────────────────────────────────────────

class Tenant(TimestampMixin, Base):
    """SaaS customer / organisation."""
    __tablename__ = "tenants"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    plan: Mapped[str] = mapped_column(String(50), default="starter")  # starter/pro/enterprise
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    metadata_: Mapped[dict] = mapped_column("metadata", JSONB, default=dict)

    # relationships
    users: Mapped[list[User]] = relationship("User", back_populates="tenant")
    cloud_accounts: Mapped[list[CloudAccount]] = relationship("CloudAccount", back_populates="tenant")
    k8s_clusters: Mapped[list[K8sCluster]] = relationship("K8sCluster", back_populates="tenant")
    accelerators: Mapped[list[Accelerator]] = relationship("Accelerator", back_populates="tenant")
    agents: Mapped[list[Agent]] = relationship("Agent", back_populates="tenant")


class User(TimestampMixin, TenantMixin, Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False
    )
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="viewer")  # owner/admin/viewer
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    tenant: Mapped[Tenant] = relationship("Tenant", back_populates="users")

    __table_args__ = (
        UniqueConstraint("tenant_id", "email", name="uq_user_tenant_email"),
    )


# ──────────────────────────────────────────────
# K8s
# ──────────────────────────────────────────────

class K8sCluster(TimestampMixin, TenantMixin, Base):
    __tablename__ = "k8s_clusters"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    provider: Mapped[str] = mapped_column(String(50))           # aws/gcp/azure/on-prem
    region: Mapped[str | None] = mapped_column(String(100))
    k8s_version: Mapped[str | None] = mapped_column(String(30))
    cloud_account_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False), ForeignKey("cloud_accounts.id", ondelete="SET NULL")
    )
    labels: Mapped[dict] = mapped_column(JSONB, default=dict)

    tenant: Mapped[Tenant] = relationship("Tenant", back_populates="k8s_clusters")
    nodes: Mapped[list[K8sNode]] = relationship("K8sNode", back_populates="cluster")
    pods: Mapped[list[K8sPod]] = relationship("K8sPod", back_populates="cluster")

    __table_args__ = (
        UniqueConstraint("tenant_id", "name", name="uq_cluster_tenant_name"),
    )


class K8sNode(TimestampMixin, TenantMixin, Base):
    __tablename__ = "k8s_nodes"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True
    )
    cluster_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("k8s_clusters.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[K8sNodeStatus] = mapped_column(
        Enum(K8sNodeStatus, name="k8s_node_status"), default=K8sNodeStatus.READY
    )
    instance_type: Mapped[str | None] = mapped_column(String(100))   # e.g. a100.40gb.8x
    cpu_capacity: Mapped[int | None] = mapped_column(Integer)         # millicores
    memory_capacity_mb: Mapped[int | None] = mapped_column(BigInteger)
    labels: Mapped[dict] = mapped_column(JSONB, default=dict)
    taints: Mapped[list] = mapped_column(JSONB, default=list)

    cluster: Mapped[K8sCluster] = relationship("K8sCluster", back_populates="nodes")
    accelerators: Mapped[list[Accelerator]] = relationship("Accelerator", back_populates="node")
    pods: Mapped[list[K8sPod]] = relationship("K8sPod", back_populates="node")

    __table_args__ = (
        UniqueConstraint("cluster_id", "name", name="uq_node_cluster_name"),
    )


class K8sPod(TimestampMixin, TenantMixin, Base):
    __tablename__ = "k8s_pods"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True
    )
    cluster_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("k8s_clusters.id", ondelete="CASCADE"), nullable=False, index=True
    )
    node_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False), ForeignKey("k8s_nodes.id", ondelete="SET NULL")
    )
    orchestration_job_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False), ForeignKey("orchestration_jobs.id", ondelete="SET NULL"), index=True
    )
    namespace: Mapped[str] = mapped_column(String(255), default="default")
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    phase: Mapped[PodPhase] = mapped_column(
        Enum(PodPhase, name="pod_phase"), default=PodPhase.PENDING
    )
    # resource requests / limits
    cpu_request_m: Mapped[int | None] = mapped_column(Integer)        # millicores
    memory_request_mb: Mapped[int | None] = mapped_column(Integer)
    cpu_limit_m: Mapped[int | None] = mapped_column(Integer)
    memory_limit_mb: Mapped[int | None] = mapped_column(Integer)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    labels: Mapped[dict] = mapped_column(JSONB, default=dict)

    cluster: Mapped[K8sCluster] = relationship("K8sCluster", back_populates="pods")
    node: Mapped[K8sNode | None] = relationship("K8sNode", back_populates="pods")
    orchestration_job: Mapped[OrchestrationJob | None] = relationship(
        "OrchestrationJob", back_populates="pods"
    )


# ──────────────────────────────────────────────
# Accelerators (GPU / TPU / LPU)
# ──────────────────────────────────────────────

class Accelerator(TimestampMixin, TenantMixin, Base):
    """Physical or virtual accelerator device."""
    __tablename__ = "accelerators"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True
    )
    node_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False), ForeignKey("k8s_nodes.id", ondelete="SET NULL"), index=True
    )
    accelerator_type: Mapped[AcceleratorType] = mapped_column(
        Enum(AcceleratorType, name="accelerator_type"), nullable=False
    )
    model: Mapped[str] = mapped_column(String(100))               # e.g. A100, H100, TPU-v4, Groq-LPU
    vendor: Mapped[str | None] = mapped_column(String(100))       # NVIDIA / Google / Groq / Cerebras
    device_id: Mapped[str | None] = mapped_column(String(255))    # physical bus/device ID
    vram_gb: Mapped[int | None] = mapped_column(Integer)
    compute_units: Mapped[int | None] = mapped_column(Integer)    # SM count / TPU chips / etc.
    status: Mapped[AcceleratorStatus] = mapped_column(
        Enum(AcceleratorStatus, name="accelerator_status"), default=AcceleratorStatus.AVAILABLE
    )
    hourly_cost_usd: Mapped[Decimal | None] = mapped_column(Numeric(12, 6))
    cloud_account_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False), ForeignKey("cloud_accounts.id", ondelete="SET NULL")
    )
    extra: Mapped[dict] = mapped_column(JSONB, default=dict)      # MIG profiles, NVLink, etc.

    tenant: Mapped[Tenant] = relationship("Tenant", back_populates="accelerators")
    node: Mapped[K8sNode | None] = relationship("K8sNode", back_populates="accelerators")
    hourly_metrics: Mapped[list[ResourceHourlyMetric]] = relationship(
        "ResourceHourlyMetric", back_populates="accelerator"
    )
    job_usages: Mapped[list[JobResourceUsage]] = relationship(
        "JobResourceUsage", back_populates="accelerator"
    )


# ──────────────────────────────────────────────
# AI Agents & Orchestration
# ──────────────────────────────────────────────

class Agent(TimestampMixin, TenantMixin, Base):
    """AI agent definition (LangGraph node, AutoGen agent, custom, etc.)."""
    __tablename__ = "agents"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    framework: Mapped[str | None] = mapped_column(String(100))    # langgraph/autogen/crewai/custom
    model_id: Mapped[str | None] = mapped_column(String(255))     # gpt-4o / claude-3 / llama-3
    version: Mapped[str | None] = mapped_column(String(50))
    status: Mapped[AgentStatus] = mapped_column(
        Enum(AgentStatus, name="agent_status"), default=AgentStatus.ACTIVE
    )
    config: Mapped[dict] = mapped_column(JSONB, default=dict)     # tools, system prompt hash, etc.
    auth_token_expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    last_seen_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    tenant: Mapped[Tenant] = relationship("Tenant", back_populates="agents")
    jobs: Mapped[list[OrchestrationJob]] = relationship("OrchestrationJob", back_populates="agent")


class Resource(TimestampMixin, TenantMixin, Base):
    """Normalized resource identity for compute, GPU, host, pod, and service."""
    __tablename__ = "resources"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True
    )
    provider: Mapped[str] = mapped_column(String(50), nullable=False)
    resource_type: Mapped[str] = mapped_column(String(100), nullable=False)
    external_id: Mapped[str | None] = mapped_column(String(512))
    name: Mapped[str | None] = mapped_column(String(255))
    region: Mapped[str | None] = mapped_column(String(100))
    tags: Mapped[dict] = mapped_column(JSONB, default=dict)
    metadata_: Mapped[dict] = mapped_column("metadata", JSONB, default=dict)
    agent_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False), ForeignKey("agents.id", ondelete="SET NULL"), index=True
    )
    parent_resource_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False), ForeignKey("resources.id", ondelete="SET NULL"), index=True
    )

    tenant: Mapped[Tenant] = relationship("Tenant")
    agent: Mapped[Agent | None] = relationship("Agent")
    metric_samples: Mapped[list[MetricSample]] = relationship("MetricSample", back_populates="resource")
    inference_requests: Mapped[list[InferenceRequest]] = relationship(
        "InferenceRequest", back_populates="resource"
    )
    parent: Mapped[Resource | None] = relationship(
        "Resource",
        back_populates="children",
        remote_side=[id],
    )
    children: Mapped[list[Resource]] = relationship(
        "Resource",
        back_populates="parent",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        UniqueConstraint(
            "tenant_id",
            "provider",
            "resource_type",
            "external_id",
            name="uq_resource_tenant_provider_type_external",
        ),
        Index("ix_resource_tenant_provider_type", "tenant_id", "provider", "resource_type"),
    )


class MetricSample(TimestampMixin, TenantMixin, Base):
    """Raw metric sample ingested from agents."""
    __tablename__ = "metric_samples"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True
    )
    resource_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False), ForeignKey("resources.id", ondelete="SET NULL"), index=True
    )
    agent_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False), ForeignKey("agents.id", ondelete="SET NULL"), index=True
    )
    metric_name: Mapped[str] = mapped_column(String(255), nullable=False)
    value: Mapped[Decimal] = mapped_column(Numeric(20, 6), nullable=False)
    unit: Mapped[str | None] = mapped_column(String(50))
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    dimensions: Mapped[dict] = mapped_column(JSONB, default=dict)
    raw: Mapped[dict] = mapped_column(JSONB, default=dict)

    resource: Mapped[Resource | None] = relationship("Resource", back_populates="metric_samples")
    agent: Mapped[Agent | None] = relationship("Agent")

    __table_args__ = (
        Index("ix_metric_samples_tenant_ts", "tenant_id", "timestamp"),
        Index("ix_metric_samples_tenant_res_ts", "tenant_id", "resource_id", "timestamp"),
        Index("ix_metric_samples_tenant_metric_ts", "tenant_id", "metric_name", "timestamp"),
    )


class InferenceRequest(TimestampMixin, TenantMixin, Base):
    """AI inference request event."""
    __tablename__ = "inference_requests"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True
    )
    resource_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False), ForeignKey("resources.id", ondelete="SET NULL"), index=True
    )
    agent_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False), ForeignKey("agents.id", ondelete="SET NULL"), index=True
    )
    model_name: Mapped[str] = mapped_column(String(255), nullable=False)
    request_id: Mapped[str | None] = mapped_column(String(255))
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    latency_ms: Mapped[Decimal | None] = mapped_column(Numeric(12, 6))
    input_tokens: Mapped[int | None] = mapped_column(BigInteger)
    output_tokens: Mapped[int | None] = mapped_column(BigInteger)
    gpu_ms: Mapped[Decimal | None] = mapped_column(Numeric(12, 6))
    cost_usd: Mapped[Decimal] = mapped_column(Numeric(14, 6), default=Decimal("0"))
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    dimensions: Mapped[dict] = mapped_column(JSONB, default=dict)
    raw: Mapped[dict] = mapped_column(JSONB, default=dict)

    resource: Mapped[Resource | None] = relationship("Resource", back_populates="inference_requests")
    agent: Mapped[Agent | None] = relationship("Agent")

    __table_args__ = (
        Index("ix_inference_requests_tenant_ts", "tenant_id", "timestamp"),
        Index("ix_inference_requests_tenant_model_ts", "tenant_id", "model_name", "timestamp"),
    )


class OrchestrationJob(TimestampMixin, TenantMixin, Base):
    """
    A single orchestration run — could be a DAG run, agent execution,
    training job, inference batch, fine-tune, eval pipeline, etc.
    """
    __tablename__ = "orchestration_jobs"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True
    )
    agent_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False), ForeignKey("agents.id", ondelete="SET NULL"), index=True
    )
    cluster_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False), ForeignKey("k8s_clusters.id", ondelete="SET NULL"), index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    job_type: Mapped[str] = mapped_column(String(100))            # training/inference/eval/pipeline
    status: Mapped[JobStatus] = mapped_column(
        Enum(JobStatus, name="job_status"), default=JobStatus.QUEUED, index=True
    )
    priority: Mapped[int] = mapped_column(Integer, default=5)     # 1 (highest) → 10 (lowest)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    duration_seconds: Mapped[int | None] = mapped_column(Integer)
    # token usage (for LLM-heavy jobs)
    prompt_tokens: Mapped[int | None] = mapped_column(BigInteger)
    completion_tokens: Mapped[int | None] = mapped_column(BigInteger)
    # parent for DAG / sub-jobs
    parent_job_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False), ForeignKey("orchestration_jobs.id", ondelete="SET NULL"), index=True
    )
    tags: Mapped[dict] = mapped_column(JSONB, default=dict)
    metadata_: Mapped[dict] = mapped_column("metadata", JSONB, default=dict)

    agent: Mapped[Agent | None] = relationship("Agent", back_populates="jobs")
    pods: Mapped[list[K8sPod]] = relationship("K8sPod", back_populates="orchestration_job")
    resource_usages: Mapped[list[JobResourceUsage]] = relationship(
        "JobResourceUsage", back_populates="job"
    )
    cost_aggregate: Mapped[JobCostAggregate | None] = relationship(
        "JobCostAggregate", back_populates="job", uselist=False
    )
    parent: Mapped[OrchestrationJob | None] = relationship(
        "OrchestrationJob",
        back_populates="children",
        remote_side="[OrchestrationJob.id]",
        foreign_keys="[OrchestrationJob.parent_job_id]",
    )
    children: Mapped[list[OrchestrationJob]] = relationship(
        "OrchestrationJob",
        back_populates="parent",
        foreign_keys="[OrchestrationJob.parent_job_id]",
    )


class JobResourceUsage(TenantMixin, Base):
    """
    Per-accelerator usage record for a completed job.
    Denormalised for fast cost attribution queries.
    """
    __tablename__ = "job_resource_usage"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True
    )
    job_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("orchestration_jobs.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    accelerator_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False), ForeignKey("accelerators.id", ondelete="SET NULL"), index=True
    )
    accelerator_type: Mapped[AcceleratorType | None] = mapped_column(
        Enum(AcceleratorType, name="accelerator_type")
    )
    # utilisation
    duration_seconds: Mapped[int] = mapped_column(Integer, nullable=False)
    avg_utilization_pct: Mapped[Decimal | None] = mapped_column(Numeric(5, 2))
    avg_memory_used_gb: Mapped[Decimal | None] = mapped_column(Numeric(10, 3))
    peak_memory_gb: Mapped[Decimal | None] = mapped_column(Numeric(10, 3))
    # cost
    cost_usd: Mapped[Decimal] = mapped_column(Numeric(14, 6), default=Decimal("0"))

    job: Mapped[OrchestrationJob] = relationship("OrchestrationJob", back_populates="resource_usages")
    accelerator: Mapped[Accelerator | None] = relationship("Accelerator", back_populates="job_usages")

    __table_args__ = (
        Index("ix_job_resource_tenant_job", "tenant_id", "job_id"),
    )


# ──────────────────────────────────────────────
# Metrics (hourly time-series)
# ──────────────────────────────────────────────

class ResourceHourlyMetric(Base):
    """
    One row = one accelerator x one UTC hour.
    Compatible with TimescaleDB hypertable on (tenant_id, hour_ts).
    For vanilla PG: partition by RANGE on hour_ts.
    """
    __tablename__ = "resource_hourly_metrics"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    accelerator_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("accelerators.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    hour_ts: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )                                                             # floor(ts, 'hour')
    # utilisation
    avg_utilization_pct: Mapped[Decimal | None] = mapped_column(Numeric(5, 2))
    max_utilization_pct: Mapped[Decimal | None] = mapped_column(Numeric(5, 2))
    avg_memory_used_gb: Mapped[Decimal | None] = mapped_column(Numeric(10, 3))
    peak_memory_gb: Mapped[Decimal | None] = mapped_column(Numeric(10, 3))
    # power / thermals
    avg_power_watts: Mapped[Decimal | None] = mapped_column(Numeric(8, 2))
    avg_temp_celsius: Mapped[Decimal | None] = mapped_column(Numeric(5, 2))
    # cost (pre-computed for fast dashboards)
    cost_usd: Mapped[Decimal] = mapped_column(Numeric(14, 6), default=Decimal("0"))
    idle_fraction: Mapped[Decimal | None] = mapped_column(Numeric(5, 4))  # 0..1

    accelerator: Mapped[Accelerator] = relationship("Accelerator", back_populates="hourly_metrics")

    __table_args__ = (
        UniqueConstraint("tenant_id", "accelerator_id", "hour_ts",
                         name="uq_hourly_metric_tenant_acc_hour"),
        Index("ix_hourly_metric_tenant_hour", "tenant_id", "hour_ts"),
    )


# ──────────────────────────────────────────────
# Cloud Cost & Billing
# ──────────────────────────────────────────────

class CloudAccount(TimestampMixin, TenantMixin, Base):
    """AWS / GCP / Azure account linked to a tenant."""
    __tablename__ = "cloud_accounts"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True
    )
    provider: Mapped[str] = mapped_column(String(50), nullable=False)  # aws/gcp/azure
    account_id: Mapped[str] = mapped_column(String(255), nullable=False)
    alias: Mapped[str | None] = mapped_column(String(255))
    currency: Mapped[str] = mapped_column(String(10), default="USD")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    tenant: Mapped[Tenant] = relationship("Tenant", back_populates="cloud_accounts")
    cost_line_items: Mapped[list[CostLineItem]] = relationship(
        "CostLineItem", back_populates="cloud_account"
    )

    __table_args__ = (
        UniqueConstraint("tenant_id", "provider", "account_id",
                         name="uq_cloud_account_tenant_provider_id"),
    )


class CostLineItem(Base):
    """
    Raw cost line imported from cloud billing APIs (CUR, BigQuery billing export, etc.).
    One row per billing record; granularity depends on the provider.
    """
    __tablename__ = "cost_line_items"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    cloud_account_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("cloud_accounts.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    line_item_type: Mapped[CostLineItemType] = mapped_column(
        Enum(CostLineItemType, name="cost_line_item_type"), nullable=False
    )
    service: Mapped[str] = mapped_column(String(255))             # EC2, Compute Engine, etc.
    resource_id: Mapped[str | None] = mapped_column(String(512))  # instance ID, resource ARN
    usage_start: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    usage_end: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    usage_amount: Mapped[Decimal] = mapped_column(Numeric(20, 6))
    usage_unit: Mapped[str | None] = mapped_column(String(50))    # Hrs / GB-Mo / Requests
    cost_usd: Mapped[Decimal] = mapped_column(Numeric(14, 6), nullable=False)
    tags: Mapped[dict] = mapped_column(JSONB, default=dict)
    raw: Mapped[dict] = mapped_column(JSONB, default=dict)        # original provider payload

    cloud_account: Mapped[CloudAccount] = relationship("CloudAccount", back_populates="cost_line_items")

    __table_args__ = (
        Index("ix_cost_line_tenant_start", "tenant_id", "usage_start"),
    )


class JobCostAggregate(Base):
    """
    Materialised cost summary for a completed job.
    Updated by a background worker after job completion or on-demand.
    """
    __tablename__ = "job_cost_aggregates"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    job_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("orchestration_jobs.id", ondelete="CASCADE"),
        nullable=False, unique=True
    )
    # cost breakdown
    compute_cost_usd: Mapped[Decimal] = mapped_column(Numeric(14, 6), default=Decimal("0"))
    accelerator_cost_usd: Mapped[Decimal] = mapped_column(Numeric(14, 6), default=Decimal("0"))
    storage_cost_usd: Mapped[Decimal] = mapped_column(Numeric(14, 6), default=Decimal("0"))
    network_cost_usd: Mapped[Decimal] = mapped_column(Numeric(14, 6), default=Decimal("0"))
    llm_token_cost_usd: Mapped[Decimal] = mapped_column(Numeric(14, 6), default=Decimal("0"))
    other_cost_usd: Mapped[Decimal] = mapped_column(Numeric(14, 6), default=Decimal("0"))
    total_cost_usd: Mapped[Decimal] = mapped_column(Numeric(14, 6), default=Decimal("0"))
    # efficiency signals
    accelerator_utilization_pct: Mapped[Decimal | None] = mapped_column(Numeric(5, 2))
    idle_cost_usd: Mapped[Decimal | None] = mapped_column(Numeric(14, 6))
    cost_per_token: Mapped[Decimal | None] = mapped_column(Numeric(18, 10))
    computed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    job: Mapped[OrchestrationJob] = relationship("OrchestrationJob", back_populates="cost_aggregate")


# ──────────────────────────────────────────────
# Recommendations
# ──────────────────────────────────────────────

class RecommendationStatus(str, enum.Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    DONE = "done"
    DISMISSED = "dismissed"


class RecommendationImpact(str, enum.Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class RecommendationEffort(str, enum.Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class Recommendation(TimestampMixin, TenantMixin, Base):
    """Cost optimization recommendation."""
    __tablename__ = "recommendations"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(512), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)  # Compute, Storage, etc.
    impact: Mapped[RecommendationImpact] = mapped_column(
        Enum(RecommendationImpact, name="recommendation_impact"), nullable=False
    )
    effort: Mapped[RecommendationEffort] = mapped_column(
        Enum(RecommendationEffort, name="recommendation_effort"), nullable=False
    )
    savings_usd: Mapped[Decimal] = mapped_column(Numeric(14, 6), nullable=False)
    status: Mapped[RecommendationStatus] = mapped_column(
        Enum(RecommendationStatus, name="recommendation_status"), default=RecommendationStatus.OPEN
    )
    description: Mapped[str] = mapped_column(Text, nullable=False)
    steps: Mapped[list] = mapped_column(JSONB, default=list)
    resource_id: Mapped[str | None] = mapped_column(String(255))
    resource_type: Mapped[str | None] = mapped_column(String(100))

    tenant: Mapped[Tenant] = relationship("Tenant")


# ──────────────────────────────────────────────
# Anomalies
# ──────────────────────────────────────────────

class AnomalySeverity(str, enum.Enum):
    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"


class AnomalyStatus(str, enum.Enum):
    OPEN = "open"
    ACKNOWLEDGED = "acknowledged"
    RESOLVED = "resolved"


class Anomaly(TimestampMixin, TenantMixin, Base):
    """Cost or usage anomaly detection."""
    __tablename__ = "anomalies"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True
    )
    service: Mapped[str] = mapped_column(String(255), nullable=False)
    detected_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    severity: Mapped[AnomalySeverity] = mapped_column(
        Enum(AnomalySeverity, name="anomaly_severity"), nullable=False
    )
    spike_percentage: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    data: Mapped[list] = mapped_column(JSONB, default=list)  # Historical data points
    status: Mapped[AnomalyStatus] = mapped_column(
        Enum(AnomalyStatus, name="anomaly_status"), default=AnomalyStatus.OPEN
    )
    investigation_steps: Mapped[list] = mapped_column(JSONB, default=list)

    tenant: Mapped[Tenant] = relationship("Tenant")


# ──────────────────────────────────────────────
# Reports
# ──────────────────────────────────────────────

class ReportFrequency(str, enum.Enum):
    ONCE = "Once"
    DAILY = "Daily"
    WEEKLY = "Weekly"
    MONTHLY = "Monthly"


class ReportFormat(str, enum.Enum):
    PDF = "PDF"
    CSV = "CSV"
    JSON = "JSON"


class Report(TimestampMixin, TenantMixin, Base):
    """Scheduled or on-demand reports."""
    __tablename__ = "reports"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    frequency: Mapped[ReportFrequency] = mapped_column(
        Enum(ReportFrequency, name="report_frequency"), nullable=False
    )
    recipients: Mapped[list] = mapped_column(JSONB, default=list)  # email addresses
    format: Mapped[ReportFormat] = mapped_column(
        Enum(ReportFormat, name="report_format"), default=ReportFormat.PDF
    )
    last_run_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    next_run_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    download_url: Mapped[str | None] = mapped_column(String(512))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    tenant: Mapped[Tenant] = relationship("Tenant")


#──────────────────────────────────────────────
# Virtual Tags
# ──────────────────────────────────────────────

class VirtualTagRule(TimestampMixin, TenantMixin, Base):
    """Mapping rule from raw provider tags to normalized tags."""
    __tablename__ = "virtual_tag_rules"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True
    )
    provider: Mapped[str] = mapped_column(String(50), nullable=False)  # AWS, GCP, Azure
    raw_key: Mapped[str] = mapped_column(String(255), nullable=False)
    raw_value: Mapped[str] = mapped_column(String(255), nullable=False)
    normalized_key: Mapped[str] = mapped_column(String(255), nullable=False)
    normalized_value: Mapped[str] = mapped_column(String(255), nullable=False)

    tenant: Mapped[Tenant] = relationship("Tenant")


class VirtualTagMapping(TimestampMixin, TenantMixin, Base):
    """Custom tag mapping across providers."""
    __tablename__ = "virtual_tag_mappings"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True
    )
    from_tag: Mapped[str] = mapped_column(String(255), nullable=False)
    to_tag: Mapped[str] = mapped_column(String(255), nullable=False)

    tenant: Mapped[Tenant] = relationship("Tenant")


# ──────────────────────────────────────────────
# Cost Allocation
# ──────────────────────────────────────────────

class Team(TimestampMixin, TenantMixin, Base):
    """Team or cost center for allocation."""
    __tablename__ = "teams"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    department: Mapped[str] = mapped_column(String(255), nullable=False)
    allocated_budget_usd: Mapped[Decimal] = mapped_column(Numeric(14, 6), default=Decimal("0"))

    tenant: Mapped[Tenant] = relationship("Tenant")


class CostAllocationRule(TimestampMixin, TenantMixin, Base):
    """Rule for allocating costs to teams based on tags."""
    __tablename__ = "cost_allocation_rules"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    tag_key: Mapped[str] = mapped_column(String(255), nullable=False)
    tag_value: Mapped[str] = mapped_column(String(255), nullable=False)
    team_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("teams.id", ondelete="CASCADE"), nullable=False
    )
    category: Mapped[str] = mapped_column(String(100), nullable=False)  # Compute, Storage, etc.

    team: Mapped[Team] = relationship("Team")


# ──────────────────────────────────────────────
# Budgets
# ──────────────────────────────────────────────

class BudgetStatus(str, enum.Enum):
    UNDER_BUDGET = "Under Budget"
    AT_RISK = "At Risk"
    EXCEEDED = "Exceeded"


class Budget(TimestampMixin, TenantMixin, Base):
    """Budget definition and tracking."""
    __tablename__ = "budgets"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    limit_usd: Mapped[Decimal] = mapped_column(Numeric(14, 6), nullable=False)
    owner: Mapped[str] = mapped_column(String(255), nullable=False)
    current_spend_usd: Mapped[Decimal] = mapped_column(Numeric(14, 6), default=Decimal("0"))
    status: Mapped[BudgetStatus] = mapped_column(
        Enum(BudgetStatus, name="budget_status"), default=BudgetStatus.UNDER_BUDGET
    )

    tenant: Mapped[Tenant] = relationship("Tenant")


class BudgetAlert(TimestampMixin, TenantMixin, Base):
    """Budget alert thresholds and notifications."""
    __tablename__ = "budget_alerts"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True
    )
    budget_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("budgets.id", ondelete="CASCADE"), nullable=False
    )
    threshold_pct: Mapped[int] = mapped_column(Integer, nullable=False)  # 90
    notify_emails: Mapped[list] = mapped_column(JSONB, default=list)

    budget: Mapped[Budget] = relationship("Budget")


# ──────────────────────────────────────────────
# Payment Receipts
# ──────────────────────────────────────────────

class PaymentReceiptStatus(str, enum.Enum):
    PAID = "paid"
    PENDING = "pending"
    OVERDUE = "overdue"


class PaymentReceipt(TimestampMixin, TenantMixin, Base):
    """Cloud provider invoices/receipts."""
    __tablename__ = "payment_receipts"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True
    )
    vendor: Mapped[str] = mapped_column(String(100), nullable=False)  # AWS, GCP, Azure
    amount_usd: Mapped[Decimal] = mapped_column(Numeric(14, 6), nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="USD")
    payment_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    status: Mapped[PaymentReceiptStatus] = mapped_column(
        Enum(PaymentReceiptStatus, name="payment_receipt_status"), default=PaymentReceiptStatus.PENDING
    )
    invoice_number: Mapped[str | None] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text)
    category: Mapped[str] = mapped_column(String(100), nullable=False)  # Compute, Storage
    download_url: Mapped[str | None] = mapped_column(String(512))

    tenant: Mapped[Tenant] = relationship("Tenant")


# ──────────────────────────────────────────────
# Forecasting
# ──────────────────────────────────────────────

class ForecastingDriver(TimestampMixin, TenantMixin, Base):
    """Cost driver for forecasting (e.g., new workload impact)."""
    __tablename__ = "forecasting_drivers"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True
    )
    service: Mapped[str] = mapped_column(String(255), nullable=False)
    impact_usd: Mapped[Decimal] = mapped_column(Numeric(14, 6), nullable=False)
    direction: Mapped[str] = mapped_column(String(10), nullable=False)  # up, down
    reason: Mapped[str] = mapped_column(Text, nullable=False)

    tenant: Mapped[Tenant] = relationship("Tenant")


class ForecastingAccuracy(TimestampMixin, TenantMixin, Base):
    """Model accuracy metrics for forecasts."""
    __tablename__ = "forecasting_accuracy"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    tenant_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True
    )
    mape: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)  # Mean Absolute Percent Error
    rmse: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)  # Root Mean Squared Error
    last_evaluated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    tenant: Mapped[Tenant] = relationship("Tenant")