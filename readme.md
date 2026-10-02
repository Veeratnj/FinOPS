# AI FinOps

> **AI-native FinOps, Observability & Cost Intelligence Platform**

AI FinOps is a platform for monitoring, analyzing, governing, and optimizing the cost and performance of modern AI workloads.

It combines traditional cloud FinOps with:

* LLM cost tracking
* Token usage
* GPU utilization
* Agent observability
* MCP/tool usage
* RAG costs
* Infrastructure observability
* Cost anomaly detection
* Cost forecasting
* AI-powered optimization recommendations
* Cost governance and guardrails

---

# 1. Vision

Traditional FinOps answers:

> "How much is my cloud infrastructure costing?"

AI FinOps answers:

> "Why is my AI system costing this much, which workload caused it, what did the user get for that cost, and how can I reduce it without reducing quality?"

Example:

```text
Customer Request
      │
      ▼
AI Agent
      │
      ├── Claude API
      │     ├── Input tokens: 2,400
      │     ├── Output tokens: 800
      │     └── Cost: $0.018
      │
      ├── MCP PostgreSQL
      │     └── Cost: $0.001
      │
      ├── RAG
      │     ├── Embedding
      │     └── Vector DB query
      │
      └── GPU inference
            ├── GPU utilization: 72%
            └── Cost: $0.024

TOTAL AI REQUEST COST = $0.043
```

The platform should be able to explain this entire execution.

---

# 2. Core Architecture

```text
                              ┌──────────────────────┐
                              │      AI USERS         │
                              └──────────┬───────────┘
                                         │
                                         ▼
                              ┌──────────────────────┐
                              │    AI APPLICATION    │
                              │                      │
                              │ Agents / APIs / RAG  │
                              │ LLM / MCP / Services │
                              └──────────┬───────────┘
                                         │
                              OpenTelemetry SDK
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
                    ▼                    ▼                    ▼
               Metrics                Traces                Logs
                    │                    │                    │
                    └────────────────────┼────────────────────┘
                                         │
                                         ▼
                              ┌──────────────────────┐
                              │ OTEL Collector       │
                              │                      │
                              │ Receive              │
                              │ Process              │
                              │ Enrich               │
                              │ Export               │
                              └──────────┬───────────┘
                                         │
                 ┌───────────────────────┼───────────────────────┐
                 │                       │                       │
                 ▼                       ▼                       ▼
          ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
          │ Prometheus   │       │ Tempo/Jaeger │       │ Loki / Logs  │
          │ Metrics      │       │ Traces       │       │              │
          └──────┬───────┘       └──────┬───────┘       └──────┬───────┘
                 │                      │                      │
                 └──────────────────────┼──────────────────────┘
                                        │
                                        ▼
                              ┌──────────────────────┐
                              │  AI FINOPS INGESTION │
                              │                      │
                              │ Go Services          │
                              └──────────┬───────────┘
                                         │
                   ┌─────────────────────┼─────────────────────┐
                   │                     │                     │
                   ▼                     ▼                     ▼
             Usage Engine          Cost Engine          Billing Engine
                   │                     │                     │
                   │                     │                     │
                   └─────────────────────┼─────────────────────┘
                                         │
                                         ▼
                              ┌──────────────────────┐
                              │    Event Stream      │
                              │       Kafka          │
                              └──────────┬───────────┘
                                         │
                       ┌─────────────────┼─────────────────┐
                       │                 │                 │
                       ▼                 ▼                 ▼
                Anomaly Engine     Forecast Engine   Recommendation
                       │                 │                 │
                       └─────────────────┼─────────────────┘
                                         │
                                         ▼
                              ┌──────────────────────┐
                              │    Python AI Engine  │
                              │                      │
                              │ ML / LLM / Agents    │
                              └──────────┬───────────┘
                                         │
                                         ▼
                              ┌──────────────────────┐
                              │     PostgreSQL       │
                              │      + pgvector      │
                              └──────────┬───────────┘
                                         │
                                         ▼
                              ┌──────────────────────┐
                              │     FinOps API       │
                              │        Go            │
                              └──────────┬───────────┘
                                         │
                                         ▼
                              ┌──────────────────────┐
                              │       Web UI         │
                              │ Angular / React      │
                              └──────────────────────┘
```

---

# 3. Architecture Principles

## 3.1 OpenTelemetry First

OpenTelemetry is the standard telemetry layer.

The platform should not depend on Datadog or Grafana to collect telemetry.

```text
Application
    │
    ▼
OpenTelemetry
    │
    ▼
OTEL Collector
    │
    ├── Prometheus
    ├── Tempo
    ├── Loki
    ├── Datadog
    └── AI FinOps
```

This allows customers to continue using their existing observability platforms.

---

# 4. Supported Observability Sources

## Application

```text
Python
Go
Node.js
Java
.NET
```

## AI Frameworks

```text
LangChain
LangGraph
Agno
OpenAI SDK
Anthropic SDK
Google Gemini
AWS Bedrock
Azure OpenAI
Ollama
vLLM
Hugging Face
```

## Infrastructure

```text
AWS
Azure
GCP
Kubernetes
Docker
VMs
Bare Metal
```

## Databases

```text
PostgreSQL
Redis
MySQL
MongoDB
```

## AI Infrastructure

```text
NVIDIA GPU
CUDA
NVIDIA DCGM
GPU Kubernetes workloads
```

---

# 5. Observability Data Model

The platform collects three primary telemetry types.

## 5.1 Metrics

Examples:

```text
cpu_usage_percent
memory_usage_percent

gpu_utilization_percent
gpu_memory_used_bytes
gpu_memory_total_bytes
gpu_power_usage_watts
gpu_temperature_celsius

llm_requests_total
llm_tokens_input_total
llm_tokens_output_total

agent_requests_total
agent_execution_duration
tool_calls_total

rag_queries_total
embedding_tokens_total
```

---

# 6. Traces

Every AI request should ideally have a trace.

Example:

```text
TRACE: abc-123

Agent Request
│
├── LLM Call
│   ├── provider = anthropic
│   ├── model = claude
│   ├── input_tokens = 2400
│   ├── output_tokens = 800
│   ├── latency = 1.8s
│   └── cost = $0.018
│
├── MCP Tool
│   ├── tool = postgres_query
│   ├── latency = 120ms
│   └── cost = $0.001
│
├── RAG
│   ├── embedding
│   ├── vector_search
│   └── reranking
│
└── Final Response
```

This allows the platform to calculate:

```text
Total execution time
Total token usage
Total tool usage
Total infrastructure usage
Total AI cost
Cost per agent
Cost per customer
Cost per request
```

---

# 7. GPU Observability

GPU monitoring is a major component of AI FinOps.

Recommended stack:

```text
NVIDIA GPU
     │
     ▼
NVIDIA DCGM
     │
     ▼
DCGM Exporter
     │
     ▼
Prometheus
     │
     ▼
AI FinOps
```

Important metrics:

```text
GPU utilization
GPU memory utilization
GPU memory allocation
GPU temperature
GPU power consumption
GPU clock
GPU energy consumption
GPU idle time
GPU active time
```

Derived metrics:

```text
GPU cost/hour
GPU cost/request
GPU cost/model
GPU idle cost
GPU utilization efficiency
GPU waste
```

Example:

```text
GPU hourly price             $2.50
Utilization                  42%
Active workload              10 hours
Idle workload                14 hours

Estimated idle cost:

14 × $2.50 = $35
```

The platform can then generate:

> "GPU is running at only 42% average utilization. Estimated monthly waste: $350."

---

# 8. LLM Observability

Each LLM call should generate a standardized record.

```json
{
  "provider": "anthropic",
  "model": "claude",
  "input_tokens": 2400,
  "output_tokens": 800,
  "total_tokens": 3200,
  "latency_ms": 1800,
  "status": "success"
}
```

The Cost Engine applies the appropriate pricing model.

```text
Input tokens
      +
Output tokens
      +
Provider pricing
      ↓
LLM Cost
```

This allows:

```text
Cost per request
Cost per model
Cost per agent
Cost per application
Cost per customer
Cost per team
Cost per token
```

---

# 9. Agent Observability

Agent execution is represented as a trace.

```text
Agent
│
├── Planning
│
├── LLM
│
├── Tool
│
├── MCP
│
├── RAG
│
├── LLM
│
└── Final response
```

Track:

```text
agent_name
agent_version
execution_time
llm_calls
tool_calls
mcp_calls
tokens
errors
total_cost
```

Derived metrics:

```text
Cost per agent run
Average agent cost
Cost by agent
Most expensive tool
Most expensive workflow
Failed execution cost
```

---

# 10. MCP Observability

MCP should be treated as a first-class component.

```text
Agent
  │
  ▼
MCP Client
  │
  ├── Tool
  ├── Resource
  └── Prompt
        │
        ▼
    MCP Server
```

Track:

```text
mcp_server
tool_name
request_count
latency
error_count
payload_size
execution_cost
```

Example:

```text
MCP Tool: postgres_query

Calls:             25,421
Average latency:   94 ms
Errors:            0.8%
Estimated cost:    $12.40
```

---

# 11. RAG Observability

RAG pipelines should expose:

```text
Embedding
    │
    ▼
Vector Database
    │
    ▼
Retriever
    │
    ▼
Reranker
    │
    ▼
LLM
```

Track:

```text
embedding_tokens
embedding_cost
vector_queries
vector_query_latency
documents_retrieved
reranking_latency
llm_tokens
total_rag_cost
```

This allows:

> "Your RAG pipeline represents 31% of total AI cost."

---

# 12. Cloud Billing Integration

Observability tells us:

> "What happened?"

Billing tells us:

> "What did it cost?"

The platform combines both.

```text
AWS Billing ───────┐
Azure Billing ─────┤
GCP Billing ───────┤
                   ▼
              Billing Engine
                   │
                   ▼
              Cost Database
```

Supported integrations:

```text
AWS Cost Explorer
AWS CUR

Azure Cost Management
Azure Cost Details

GCP Cloud Billing
BigQuery Billing Export
```

---

# 13. Cost Engine

The Cost Engine converts usage into money.

```text
Usage
 │
 ├── Tokens
 ├── GPU hours
 ├── CPU hours
 ├── Storage
 ├── Network
 ├── API calls
 └── Database usage
       │
       ▼
 Pricing Engine
       │
       ▼
 Cost
```

Example:

```text
Input Tokens:     10,000
Output Tokens:     4,000

Provider pricing
       ↓

Input Cost:       $0.03
Output Cost:      $0.12

Total:            $0.15
```

Pricing should be versioned.

```text
provider
model
pricing_version
input_price
output_price
effective_from
effective_to
currency
```

---

# 14. Cost Attribution

Every cost should be attributable.

Dimensions:

```text
Cloud
Account
Region
Cluster
Namespace
Application
Service
Environment
Team
Project
Customer
Agent
Model
Provider
Tool
MCP Server
```

Example:

```text
Company
│
├── Engineering
│   ├── AI Platform
│   │   ├── Agent A
│   │   ├── Agent B
│   │   └── RAG Service
│
└── Marketing
    └── AI Content Generator
```

---

# 15. AI Cost Intelligence

This is the intelligence layer.

## Anomaly Detection

Detect:

```text
Sudden token increase
Unexpected GPU usage
Cost spike
Unusual API calls
Agent loop
Abnormal tool usage
```

Example:

```text
Normal daily cost: $120

Today: $470

Increase: +291%

Possible cause:
Agent "ResearchBot"
```

---

# 16. Forecasting

Predict:

```text
Daily cost
Weekly cost
Monthly cost
Cloud bill
LLM bill
GPU bill
Team spending
```

Example:

```text
Current monthly spend:

$4,820

Projected month-end:

$7,240

Expected increase:

+50.2%
```

---

# 17. Recommendation Engine

Recommendations should be actionable.

Example:

```text
Recommendation #001

Problem:
GPU utilization is 28%.

Estimated waste:
$820/month.

Recommendation:
Move inference workload to a smaller GPU
or enable autoscaling.

Estimated saving:
$510–$680/month.
```

Other recommendations:

```text
Use smaller LLM
Use model routing
Reduce prompt size
Cache repeated requests
Batch embeddings
Scale GPU automatically
Terminate idle resources
Change instance type
Move workload to cheaper region
Optimize RAG retrieval
Reduce unnecessary agent steps
```

---

# 18. AI FinOps Assistant

Users should be able to ask:

```text
Why did our AI cost increase yesterday?
```

```text
Which agent is most expensive?
```

```text
How much are we spending on Claude?
```

```text
Which GPU is wasting money?
```

```text
How much can we save this month?
```

```text
Show me our top 10 expensive workloads.
```

Architecture:

```text
User
 │
 ▼
AI FinOps Assistant
 │
 ├── Cost Database
 ├── Metrics
 ├── Traces
 ├── Billing
 ├── Recommendations
 └── Knowledge Base
```

---

# 19. Guardrails

AI FinOps should prevent runaway costs.

Example:

```text
Team: AI Research

Monthly Budget: $5,000

Current: $4,700

Remaining: $300
```

Policies:

```text
Maximum daily spend
Maximum agent cost
Maximum tokens/request
Maximum GPU hours
Maximum model usage
Maximum MCP calls
```

Actions:

```text
Alert
Warn
Throttle
Block
Require approval
Switch to cheaper model
```

---

# 20. Technology Stack

## Frontend

Recommended:

```text
Angular
TypeScript
Tailwind CSS
ECharts / Apache ECharts
```

Alternative:

```text
React
Next.js
```

---

# 21. Backend

## Go

Use Go for high-throughput services.

```text
Go
├── API Gateway
├── Telemetry Ingestion
├── Cost Engine
├── Billing Integrations
├── Usage Metering
├── Policy Engine
├── Alert Service
└── Authentication
```

Recommended framework:

```text
Gin / Fiber / Chi
```

Prefer:

```text
Chi
```

for a lightweight production API.

---

# 22. Python AI Engine

Python handles intelligence and ML workloads.

```text
Python
├── Anomaly Detection
├── Forecasting
├── Recommendation Engine
├── AI Assistant
├── Cost Optimization
├── LLM Evaluation
└── Data Science
```

Possible libraries:

```text
FastAPI
Pandas
NumPy
scikit-learn
PyTorch
LangGraph
Agno
Pydantic
```

---

# 23. Database

Primary database:

```text
PostgreSQL
```

Extensions:

```text
pgvector
TimescaleDB (optional)
```

PostgreSQL stores:

```text
Users
Organizations
Projects
Cloud Accounts
Applications
Services
Agents
Models
LLM Usage
GPU Usage
Costs
Budgets
Policies
Recommendations
Alerts
Pricing
```

---

# 24. Event Streaming

Use Kafka for high-volume telemetry and events.

```text
Telemetry
   │
   ▼
Kafka
   │
   ├── usage.events
   ├── llm.events
   ├── gpu.events
   ├── agent.events
   ├── billing.events
   ├── cost.events
   └── anomaly.events
```

For a small MVP, Kafka can initially be replaced by:

```text
PostgreSQL
Redis Streams
```

Then migrate to Kafka when ingestion volume requires it.

---

# 25. Observability Stack

Recommended open-source stack:

```text
OpenTelemetry
      │
      ▼
OTEL Collector
      │
 ┌────┼─────────┐
 ▼    ▼         ▼
Prometheus Tempo Loki
   │      │       │
   └──────┼───────┘
          ▼
       Grafana
```

### Why Grafana?

Grafana is excellent for:

```text
Infrastructure dashboards
GPU dashboards
Prometheus metrics
Logs
Traces
Alerts
```

### Why not make Grafana the product?

Because your product's differentiation is:

```text
Telemetry
    +
Billing
    +
Cost Attribution
    +
AI Analysis
    +
Recommendations
    +
Governance
```

Grafana is primarily the observability visualization layer.

---

# 26. Datadog Integration

Datadog should be an optional enterprise integration.

```text
Customer Application
       │
       ├──────────► Datadog
       │
       └──────────► OpenTelemetry
                         │
                         ▼
                     AI FinOps
```

Customers who already use Datadog should not need to replace it.

Possible integration:

```text
Datadog Metrics
Datadog Logs
Datadog Traces
Datadog LLM Observability
```

---

# 27. Deployment Architecture

## Kubernetes

Production deployment:

```text
                         Internet
                            │
                            ▼
                       Load Balancer
                            │
                            ▼
                       API Gateway
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             ▼              ▼              ▼
          Go API       Ingestion API    Auth Service
             │              │
             │              ▼
             │            Kafka
             │              │
             │       ┌──────┼──────┐
             │       ▼      ▼      ▼
             │     Cost   Usage   AI
             │
             ▼
        PostgreSQL
             │
             ▼
        FinOps UI
```

---

# 28. Local Development

Everything should run through Docker Compose.

```text
docker-compose.yml

Services:

postgres
redis
kafka
zookeeper / kraft
otel-collector
prometheus
grafana
tempo
loki
go-api
python-ai
frontend
```

Example:

```text
docker compose up -d
```

---

# 29. Repository Structure

```text
ai-finops/
│
├── frontend/
│   ├── web/
│   └── shared/
│
├── services/
│   │
│   ├── api-gateway/
│   │   └── Go
│   │
│   ├── ingestion/
│   │   └── Go
│   │
│   ├── cost-engine/
│   │   └── Go
│   │
│   ├── billing-engine/
│   │   └── Go
│   │
│   ├── usage-engine/
│   │   └── Go
│   │
│   ├── policy-engine/
│   │   └── Go
│   │
│   ├── alert-service/
│   │   └── Go
│   │
│   └── ai-engine/
│       └── Python
│
├── collectors/
│   ├── aws/
│   ├── azure/
│   ├── gcp/
│   ├── gpu/
│   ├── kubernetes/
│   ├── llm/
│   └── agents/
│
├── telemetry/
│   ├── otel/
│   ├── prometheus/
│   ├── tempo/
│   └── loki/
│
├── database/
│   ├── migrations/
│   └── seeds/
│
├── infrastructure/
│   ├── docker/
│   ├── kubernetes/
│   └── terraform/
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── observability.md
│   ├── cost-model.md
│   └── security.md
│
├── tests/
│
├── docker-compose.yml
├── Makefile
├── README.md
└── LICENSE
```

---

# 30. MVP

The first version should NOT attempt to support everything.

## MVP Scope

### Observability

```text
OpenTelemetry
Prometheus
Grafana
```

### Infrastructure

```text
Docker
Kubernetes
NVIDIA GPU
```

### Cloud

```text
AWS
```

### AI

```text
OpenAI
Anthropic
Ollama
```

### Frameworks

```text
Python
Go
LangChain
Agno
```

### Core features

```text
✓ Application registration
✓ OpenTelemetry integration
✓ LLM token tracking
✓ LLM cost calculation
✓ GPU monitoring
✓ Cloud cost ingestion
✓ Cost attribution
✓ Agent tracing
✓ Dashboard
✓ Cost alerts
✓ Basic anomaly detection
✓ Basic recommendations
```

---

# 31. MVP Exclusions

Do NOT initially build:

```text
Multi-cloud optimization
Complex ML forecasting
Automatic infrastructure modification
Automatic model switching
Full enterprise IAM
Full Datadog replacement
Full SIEM
Full APM replacement
Global billing support
Every LLM provider
Every cloud provider
```

These can be added later.

---

# 32. Phase 2

```text
Azure
GCP

Advanced GPU optimization

LLM model routing

Advanced anomaly detection

Cost forecasting

AI FinOps Assistant

MCP observability

RAG cost optimization

Budget policies

Team-level chargeback
```

---

# 33. Phase 3

```text
Autonomous FinOps Agent

Automatic cost optimization

AI model routing

Spot GPU optimization

Cross-cloud optimization

Enterprise governance

FinOps-as-Code

AI infrastructure recommendations

Predictive cost control
```

---

# 34. Key Product Metrics

The dashboard should expose:

```text
Total Cloud Cost
Total AI Cost
LLM Cost
GPU Cost
Infrastructure Cost

Cost / Request
Cost / Agent Run
Cost / Customer
Cost / Team
Cost / Model

Token Usage
GPU Utilization
Agent Latency
LLM Latency

Cost Anomalies
Potential Savings
Budget Usage
Forecasted Cost
```

---

# 35. Example Executive Dashboard

```text
┌─────────────────────────────────────────────────────────────┐
│                     AI FINOPS                               │
├─────────────────┬─────────────────┬─────────────────────────┤
│ Total Cost      │ AI Cost         │ Potential Savings       │
│ $12,420         │ $8,320          │ $2,140                  │
├─────────────────┼─────────────────┼─────────────────────────┤
│ LLM Cost        │ GPU Cost        │ Infrastructure           │
│ $4,120          │ $3,210          │ $4,090                  │
├─────────────────┴─────────────────┴─────────────────────────┤
│                                                             │
│ Cost Trend                                                  │
│                                                             │
│       ╱╲                                                   │
│      ╱  ╲      ╱╲                                          │
│  ___╱    ╲____╱  ╲________                                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Top Expensive Workloads                                     │
│                                                             │
│ Agent Research       $1,240                                │
│ RAG Platform          $980                                 │
│ GPU Inference         $820                                 │
│ Content Generator     $610                                 │
├─────────────────────────────────────────────────────────────┤
│ AI Recommendations                                          │
│                                                             │
│ ⚠ GPU utilization below 35%                                │
│ ⚠ Agent Research token usage increased 42%                 │
│ ✓ Estimated savings: $2,140/month                          │
└─────────────────────────────────────────────────────────────┘
```

---

# 36. Security

Security is mandatory because telemetry can contain sensitive information.

Requirements:

```text
TLS
Authentication
Authorization
Tenant isolation
Encryption at rest
Encryption in transit
Secret management
RBAC
Audit logs
PII filtering
Prompt redaction
Token redaction
```

Never store raw prompts by default.

Provide:

```text
Prompt capture: OFF by default

Optional:
Prompt capture: ON
Redaction: ON
```

---

# 37. Multi-Tenancy

The platform should be multi-tenant from the beginning.

```text
Organization
│
├── Users
├── Teams
├── Projects
├── Cloud Accounts
├── Applications
└── AI Workloads
```

Every important record should have:

```text
organization_id
project_id
environment
```

Example:

```text
organization_id
project_id
service_id
agent_id
trace_id
```

---

# 38. Design Goal

AI FinOps should not become another dashboard.

The ultimate goal is:

```text
Observe
   ↓
Understand
   ↓
Attribute
   ↓
Analyze
   ↓
Predict
   ↓
Recommend
   ↓
Optimize
   ↓
Govern
```

---

# 39. Product Positioning

### Traditional Monitoring

```text
"What is happening?"
```

### Traditional FinOps

```text
"How much are we spending?"
```

### AI Observability

```text
"What is the AI system doing?"
```

### AI FinOps

```text
"How much does every AI operation cost,
why does it cost that much,
and how can we optimize it?"
```

---

# 40. Final Architecture

```text
                         ┌────────────────────────┐
                         │     AI APPLICATIONS    │
                         │                        │
                         │ LLM / Agents / RAG     │
                         │ MCP / APIs / GPU       │
                         └───────────┬────────────┘
                                     │
                              OpenTelemetry
                                     │
                                     ▼
                         ┌────────────────────────┐
                         │    OTEL COLLECTOR      │
                         └───────────┬────────────┘
                                     │
                 ┌───────────────────┼───────────────────┐
                 │                   │                   │
                 ▼                   ▼                   ▼
            Prometheus             Tempo               Loki
             Metrics              Traces               Logs
                 │                   │                   │
                 └───────────────────┼───────────────────┘
                                     │
                                     ▼
                         ┌────────────────────────┐
                         │    AI FINOPS INGEST    │
                         │          GO            │
                         └───────────┬────────────┘
                                     │
                                     ▼
                                  Kafka
                                     │
              ┌──────────────────────┼─────────────────────┐
              │                      │                     │
              ▼                      ▼                     ▼
        Usage Engine            Cost Engine          Billing Engine
              │                      │                     │
              └──────────────────────┼─────────────────────┘
                                     │
                                     ▼
                              PostgreSQL
                               + pgvector
                                     │
                       ┌─────────────┼─────────────┐
                       │             │             │
                       ▼             ▼             ▼
                  Anomaly        Forecast      Recommendation
                   Engine         Engine           Engine
                       │             │             │
                       └─────────────┼─────────────┘
                                     │
                                     ▼
                              Python AI Engine
                                     │
                                     ▼
                            AI FinOps Assistant
                                     │
                                     ▼
                              Go API Gateway
                                     │
                                     ▼
                              Angular / React
                                  Dashboard
```

---

# 41. Core Technology Decision

The recommended foundation is:

```text
Frontend
    Angular + TypeScript

Backend
    Go

AI / ML
    Python

Telemetry
    OpenTelemetry

Metrics
    Prometheus

Tracing
    Tempo

Logs
    Loki

Visualization
    Grafana

Streaming
    Kafka

Database
    PostgreSQL + pgvector

GPU
    NVIDIA DCGM + DCGM Exporter

Container
    Docker

Orchestration
    Kubernetes

Cloud
    AWS → Azure → GCP

AI
    OpenAI
    Anthropic
    Bedrock
    Gemini
    Ollama
    vLLM
```

### Most important architectural decision

**Do not build AI FinOps around Datadog or Grafana.**

Build it around:

```text
              OpenTelemetry
                    │
                    ▼
             Your Data Layer
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
     Observability          Billing
          │                   │
          └─────────┬─────────┘
                    ▼
              AI FinOps
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
       Analyze   Predict   Optimize
```

That gives you the flexibility to integrate **Grafana, Datadog, CloudWatch, Azure Monitor, Google Cloud Monitoring, Prometheus, and other observability systems** without making any one vendor a dependency.
