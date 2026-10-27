"""
FinOps Autonomous Multi-Agent System (LangGraph).
Built strictly to match agent_mermaid.png architecture:
- 🧭 SupervisorAgent (deterministic • no LLM • guardrails + route_fn)
- 📦 TerraformInventoryAgent (read-only • .tf + tfplan.json)
- 📈 ObservabilityAgent (read-only • Prom / DD / Grafana)
- 💰 CostCorrelatorAgent (read-only • CostLineItem x metrics)
- 🧠 OptimizationSynthesizer (read-only • frontier LLM • proposals + HCL diff)
- ✋ HitlGate (interrupt() + checkpoint • idempotent re-entry)
- 🛠️ TerraformExecutorAgent (🔒 ONLY WRITE AGENT • 4-layer guard)
- ✅ VerificationAgent (read-only • before/after)
- 📄 ReporterAgent (terminal • OrchestrationJob + Recommendation + Anomaly + Slack)
"""

from Agents.config import AgentConfig, config
from Agents.graph import create_finops_graph
from Agents.guards.executor_guards import ExecutorGuardrails, GuardrailViolation
from Agents.guards.supervisor_guards import SupervisorGuardrails
from Agents.state import (
    ExecutionResult,
    FinOpsReport,
    FinOpsState,
    HumanApprovalDecision,
    OptimizationProposal,
    ResourceInventoryItem,
    ResourceMetrics,
    VerificationResult,
    WasteCandidate,
)
from Agents.supervisor import supervisor_node, supervisor_route_fn

__all__ = [
    "create_finops_graph",
    "FinOpsState",
    "ResourceInventoryItem",
    "ResourceMetrics",
    "WasteCandidate",
    "OptimizationProposal",
    "HumanApprovalDecision",
    "ExecutionResult",
    "VerificationResult",
    "FinOpsReport",
    "SupervisorGuardrails",
    "ExecutorGuardrails",
    "GuardrailViolation",
    "supervisor_node",
    "supervisor_route_fn",
    "config",
    "AgentConfig",
]
