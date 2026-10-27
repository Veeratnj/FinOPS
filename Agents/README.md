# 🧭 FinOps Multi-Agent System (LangGraph)

Autonomous Cloud & AI Infrastructure Cost Optimization Multi-Agent Architecture built with **LangGraph**.

Directly implements the architecture shown in [`agent_mermaid.png`](../agent_mermaid.png).

---

## 🏗️ Architecture Overview

The system employs a **deterministic hub-and-spoke supervisor pattern**:

```mermaid
flowchart TD
    START([START<br/>initial state from entrypoint]) --> S[🧭 SupervisorAgent<br/><b>deterministic • no LLM</b><br/>guardrails + route_fn]

    S -- "① no inventory" --> A1[📦 TerraformInventoryAgent<br/><i>read-only</i><br/>.tf + tfplan.json]
    A1 --> S

    S -- "② no metrics" --> A2[📈 ObservabilityAgent<br/><i>read-only</i><br/>Prom / DD / Grafana]
    A2 --> S

    S -- "③ no waste" --> A3[💰 CostCorrelatorAgent<br/><i>read-only</i><br/>CostLineItem × metrics]
    A3 --> S

    S -- "④ no proposals" --> A4[🧠 OptimizationSynthesizer<br/><i>read-only • frontier LLM</i><br/>proposals + HCL diff]
    A4 --> S

    S -- "⑤ no approval yet" --> A5[✋ HitlGate<br/><b>interrupt() + checkpoint</b><br/>idempotent re-entry]
    A5 --> S

    S -- "⑥ approved • not executed" --> A6[🛠️ TerraformExecutorAgent<br/><b>🔒 ONLY WRITE AGENT</b><br/>4-layer guard • Phase 4+]
    A6 --> S

    S -- "⑦ executed • not verified" --> A7[✅ VerificationAgent<br/><i>read-only</i><br/>before/after]
    A7 --> S

    S -- "⑧ done OR error" --> A8[📄 ReporterAgent<br/><i>terminal</i><br/>OrchestrationJob + Recommendation + Anomaly + Slack]
    A8 --> END_NODE([END])
```

---

## 🧩 Agent Node Responsibilities

| Node | Name | Permissions | Core Functionality |
| :--- | :--- | :--- | :--- |
| **0** | `SupervisorAgent` | Read-only | **Deterministic Router (No LLM)**. Validates state invariants and evaluates `route_fn` across the 8 diagram branches. |
| **1** | `TerraformInventoryAgent` | Read-only | Ingests `.tf` files or `tfplan.json` using `python-hcl2`. Extracts instances, storage volumes, clusters, and tags. |
| **2** | `ObservabilityAgent` | Read-only | Gathers CPU, Memory, Disk IOPS, Network, and DCGM GPU utilization metrics (P95 and averages). |
| **3** | `CostCorrelatorAgent` | Read-only | Cross-references `CostLineItem` pricing with metrics to identify idle nodes, overprovisioned compute, unattached storage, and idle GPUs. |
| **4** | `OptimizationSynthesizer` | Read-only (LLM) | Uses Frontier LLMs (OpenAI GPT-4o / Anthropic Claude 3.5 Sonnet) or rule-engine to synthesize proposals with **unified HCL diffs**. |
| **5** | `HitlGate` | Interrupt | Yields control via LangGraph `interrupt()`. Pauses execution with persistent checkpointer until human decision is supplied. |
| **6** | `TerraformExecutorAgent` | **ONLY WRITE AGENT** | Enforces **4-layer guardrails** before applying HCL patches or simulating dry-run modifications. |
| **7** | `VerificationAgent` | Read-only | Post-execution verification. Compares before/after telemetry and confirms zero unexpected service degradation. |
| **8** | `ReporterAgent` | Terminal | Persists `OrchestrationJob`, `Recommendation`, and `Anomaly` in DB, dispatches Slack cards, and outputs executive Markdown report. |

---

## 🔒 4-Layer Guardrails (`TerraformExecutorAgent`)

The executor is strictly isolated behind four defense layers:

1. **Layer 1: Approval Verification Guard**
   - Asserts non-null cryptographic/identity signature of the human operator.
   - Verifies explicit `approved=True` status and valid timestamp.
2. **Layer 2: Scope & Blast Radius Guard**
   - Limits total changes per run to safe batch threshold (default: 10 resources).
   - Validates positive monthly savings.
   - Enforces regex blacklists on critical production resources (e.g. production DBs, VPCs, IAM roots).
3. **Layer 3: Terraform Plan & Syntax Guard**
   - Restricts mutations solely to allowed attributes (`instance_type`, `volume_type`, `desired_capacity`, etc.).
   - Disallows destructive tokens (`destroy`, `drop`, `0.0.0.0/0`).
4. **Layer 4: State Locking & Rollback Manifest Guard**
   - Pre-computes reverse HCL patches for deterministic instant rollback before applying any change.

---

## 🚀 Quickstart & Usage

### 1. Run the End-to-End Demo
```bash
python Agents/examples/run_sample.py
```

### 2. Run via CLI
```bash
# Scan a directory of Terraform files in dry-run mode:
python -m Agents.cli --tf-dir ./deploy/terraform --dry-run

# Scan a single file with auto-approval in staging:
python -m Agents.cli --tf-file ./main.tf --auto-approve
```

### 3. Programmatic Usage in Python
```python
from langgraph.types import Command
from Agents.graph import create_finops_graph

graph = create_finops_graph()
thread_config = {"configurable": {"thread_id": "job-101"}}

# Phase 1: Run until HITL Gate
state = graph.invoke({
    "tenant_id": "tenant-enterprise-1",
    "tf_files": {"main.tf": "resource \"aws_instance\" \"web\" { instance_type = \"m5.4xlarge\" }"},
    "cloud_provider": "aws",
    "dry_run": True,
}, config=thread_config)

# Phase 2: Resume with Human Sign-off
final_state = graph.invoke(Command(resume={
    "approved": True,
    "approved_by": "lead.architect@company.com",
    "comments": "Approved downsizing to m5.large",
}), config=thread_config)

print(final_state["report"]["markdown_report"])
```

### 4. REST API Endpoints (FastAPI)
The backend mounts the agent system under `/api/agents`:
- `POST /api/agents/scan`: Starts scan, returns proposals and `thread_id`
- `POST /api/agents/approve`: Resumes paused thread with approval payload
- `GET /api/agents/runs/{thread_id}`: Retrieves state and audit trail
