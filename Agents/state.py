"""
FinOps Agent State Definitions and Pydantic Schemas.
Represents the unified state passed across all LangGraph nodes.
"""

from __future__ import annotations

import operator
from datetime import datetime, timezone
from typing import Annotated, Any, Dict, List, Optional
from pydantic import BaseModel, Field
from typing_extensions import TypedDict


class ResourceInventoryItem(BaseModel):
    """Represents an inventoried cloud/IaC resource."""
    resource_id: str
    resource_name: str
    resource_type: str  # e.g., "aws_instance", "aws_ebs_volume", "google_compute_instance"
    provider: str = "aws"  # aws, gcp, azure
    region: str = "us-east-1"
    current_size: str  # e.g., "m5.4xlarge", "500GB gp2", "g4dn.12xlarge"
    tags: Dict[str, str] = Field(default_factory=dict)
    source_file: Optional[str] = None
    hcl_block: Dict[str, Any] = Field(default_factory=dict)
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ResourceMetrics(BaseModel):
    """Aggregated observability metrics for a resource."""
    resource_id: str
    avg_cpu_utilization_pct: float = 0.0
    p95_cpu_utilization_pct: float = 0.0
    avg_memory_utilization_pct: float = 0.0
    p95_memory_utilization_pct: float = 0.0
    disk_iops: Optional[float] = None
    network_in_mbps: Optional[float] = None
    network_out_mbps: Optional[float] = None
    gpu_utilization_pct: Optional[float] = None
    gpu_memory_pct: Optional[float] = None
    sample_window_days: int = 14
    is_idle: bool = False
    metric_source: str = "prometheus"  # prometheus, datadog, grafana, dcgm


class WasteCandidate(BaseModel):
    """Identified cloud waste candidate."""
    resource_id: str
    resource_type: str
    waste_type: str  # "IDLE_INSTANCE", "OVERPROVISIONED_COMPUTE", "UNATTACHED_VOLUME", "LEGACY_STORAGE_TIER", "IDLE_GPU"
    severity: str = "MEDIUM"  # "CRITICAL", "HIGH", "MEDIUM", "LOW"
    monthly_cost_usd: float = 0.0
    estimated_waste_usd: float = 0.0
    reason: str = ""
    metrics_summary: Dict[str, Any] = Field(default_factory=dict)


class OptimizationProposal(BaseModel):
    """LLM or Rule-synthesized cost optimization proposal."""
    proposal_id: str
    title: str
    resource_id: str
    resource_type: str
    category: str = "Compute"  # Compute, Storage, GPU, Network
    action: str = "DOWNSIZE"  # DOWNSIZE, TERMINATE, TIER_MIGRATION, CLEANUP
    current_config: str = ""
    proposed_config: str = ""
    estimated_monthly_savings_usd: float = 0.0
    risk_level: str = "LOW"  # LOW, MEDIUM, HIGH
    risk_analysis: str = ""
    hcl_diff: str = ""  # Unified HCL diff / patch
    confidence_score: float = 0.95
    source_file: Optional[str] = None


class HumanApprovalDecision(BaseModel):
    """Payload provided during HITL Gate re-entry."""
    approved: bool
    approved_by: str
    approved_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    comments: Optional[str] = None
    approved_proposal_ids: Optional[List[str]] = Field(default_factory=list)
    signature_token: Optional[str] = None


class ExecutionResult(BaseModel):
    """Audit record and outcome from TerraformExecutorAgent."""
    execution_id: str
    executed_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    dry_run: bool = True
    status: str = "PENDING"  # SUCCESS, FAILED, DRY_RUN_PASSED
    applied_changes: List[Dict[str, Any]] = Field(default_factory=list)
    diff_applied: str = ""
    guardrail_checks_passed: List[str] = Field(default_factory=list)
    stdout: str = ""
    stderr: Optional[str] = None
    rollback_manifest_path: Optional[str] = None


class VerificationResult(BaseModel):
    """Verification outcome from VerificationAgent."""
    verified_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    status: str = "VERIFIED"  # VERIFIED, WARNING, FAILED
    checks_performed: List[str] = Field(default_factory=list)
    health_status: str = "HEALTHY"
    telemetry_stable: bool = True
    verification_notes: str = ""


class FinOpsReport(BaseModel):
    """Final synthesized executive FinOps report."""
    summary: str
    total_resources_scanned: int = 0
    total_waste_identified_usd: float = 0.0
    potential_monthly_savings_usd: float = 0.0
    approved_savings_usd: float = 0.0
    execution_status: str = "COMPLETED"
    orchestration_job_id: Optional[str] = None
    recommendations_created: int = 0
    anomalies_flagged: int = 0
    slack_notified: bool = False
    markdown_report: str = ""
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class FinOpsState(TypedDict, total=False):
    """
    Unified FinOps Agent State matching the mermaid workflow diagram:
    START -> SupervisorAgent <-> Workers -> ReporterAgent -> END
    """
    # Context & Entrypoint
    tenant_id: str
    job_id: Optional[str]
    terraform_dir: Optional[str]
    tf_files: Optional[Dict[str, str]]  # filename -> file content
    tfplan_json: Optional[Dict[str, Any]]
    cloud_provider: str
    dry_run: bool

    # Phase 1: Terraform Inventory (Read-Only)
    inventory: Optional[List[Dict[str, Any]]]

    # Phase 2: Observability Metrics (Read-Only)
    metrics: Optional[List[Dict[str, Any]]]

    # Phase 3: Cost & Waste Correlation (Read-Only)
    waste_candidates: Optional[List[Dict[str, Any]]]

    # Phase 4: Optimization Synthesis (Frontier LLM, Read-Only)
    optimization_proposals: Optional[List[Dict[str, Any]]]

    # Phase 5: Human-In-The-Loop Gate (interrupt + checkpoint)
    approval_status: str  # "pending", "approved", "rejected"
    approval_decision: Optional[Dict[str, Any]]

    # Phase 6: Terraform Execution (ONLY WRITE AGENT, 4-layer guard)
    execution_result: Optional[Dict[str, Any]]

    # Phase 7: Verification (Read-Only before/after)
    verification_result: Optional[Dict[str, Any]]

    # Phase 8: Reporter (Terminal, OrchestrationJob + Recommendation + Anomaly + Slack)
    report: Optional[Dict[str, Any]]

    # Execution telemetry & audit trails
    errors: Annotated[List[str], operator.add]
    audit_trail: Annotated[List[Dict[str, Any]], operator.add]
    current_node: Optional[str]
    next_node: Optional[str]
