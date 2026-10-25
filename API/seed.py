"""
FinOps Platform - Master Database Seeder Script
Initializes all 33 PostgreSQL schema tables and populates realistic, 100% dynamic FinOps & AIOps data.
Transfers and seeds structured records into PostgreSQL from App/public/fakedata.json.
"""

from __future__ import annotations
import json
from pathlib import Path
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from datetime import datetime, timedelta, timezone
from decimal import Decimal
import uuid

from dotenv import load_dotenv

load_dotenv()

from app.core.config import settings
from app.core.security import get_password_hash
from app.db.session import SessionLocal, engine
from app.models import (
    Base,
    Tenant,
    User,
    CloudAccount,
    K8sCluster,
    K8sNode,
    K8sPod,
    Accelerator,
    AcceleratorType,
    AcceleratorStatus,
    K8sNodeStatus,
    PodPhase,
    Agent,
    AgentStatus,
    OrchestrationJob,
    JobStatus,
    CostLineItem,
    CostLineItemType,
    Budget,
    BudgetStatus,
    Recommendation,
    RecommendationStatus,
    RecommendationImpact,
    RecommendationEffort,
    Anomaly,
    AnomalySeverity,
    AnomalyStatus,
    PaymentReceipt,
    Report,
    ReportFormat,
    ReportFrequency,
    VirtualTagRule,
    UnitEconomicsRecord,
    ForecastingDriver,
    ForecastingAccuracy,
    Team,
    DockerAnalyticsRecord,
    MultiCloudAnalyticsRecord,
    HardwareOrchestrationRecord,
    TokenOpsRecord,
    LLMOpsRecord,
)


def seed_database() -> None:
    print("=" * 60)
    print("AI FinOps Platform - PostgreSQL Database Seeder")
    print("Database:", settings.SQLALCHEMY_DATABASE_URI)
    print("=" * 60)

    # 1. Create all schema tables
    print("[1/10] Verifying and creating all PostgreSQL tables...")
    Base.metadata.create_all(bind=engine)
    print("[OK] All PostgreSQL tables verified/created.")

    db = SessionLocal()
    try:
        # Load fakedata.json if available
        repo_root = Path(__file__).resolve().parents[1]
        fake_data_path = repo_root / "App" / "public" / "fakedata.json"
        fake_data = {}
        if fake_data_path.is_file():
            with open(fake_data_path, "r", encoding="utf-8") as f:
                fake_data = json.load(f)
            print(f"[OK] Loaded base dataset from {fake_data_path}")

        # 2. Check / Create Tenant
        print("[2/10] Seeding tenant organization...")
        tenant_slug = "finops-corp"
        tenant = db.query(Tenant).filter(Tenant.slug == tenant_slug).first()

        if not tenant:
            tenant = Tenant(
                name="FinOps Enterprise Corp",
                slug=tenant_slug,
                plan="enterprise",
                is_active=True,
                metadata_={
                    "industry": "Artificial Intelligence / Cloud Infrastructure",
                    "region": "Global",
                    "admin_name": "FinOps Admin",
                },
            )
            db.add(tenant)
            db.flush()
            print(f"[OK] Created Organization: '{tenant.name}' (ID: {tenant.id})")
        else:
            print(f"[OK] Existing Organization found: '{tenant.name}' (ID: {tenant.id})")

        # 3. Check / Create Users
        print("[3/10] Seeding user accounts...")
        users_to_seed = [
            {"email": "testuser@finops.com", "name": "FinOps Test User", "role": "admin", "department": "FinOps & Cloud Strategy"},
            {"email": "admin@finops.com", "name": "Alice Johnson", "role": "admin", "department": "Engineering"},
            {"email": "bob@finops.com", "name": "Bob Smith", "role": "manager", "department": "Data Science"},
            {"email": "carol@finops.com", "name": "Carol Williams", "role": "analyst", "department": "Finance"},
        ]
        test_password_hash = get_password_hash("admin@123")
        for u_data in users_to_seed:
            existing_user = db.query(User).filter(User.tenant_id == tenant.id, User.email == u_data["email"]).first()
            if not existing_user:
                new_user = User(
                    email=u_data["email"],
                    password_hash=test_password_hash,
                    role=u_data["role"],
                    tenant_id=tenant.id,
                    is_active=True,
                    name=u_data["name"],
                    department=u_data["department"],
                )
                db.add(new_user)
            else:
                existing_user.password_hash = test_password_hash
                existing_user.name = u_data["name"]
                existing_user.department = u_data["department"]
        db.flush()
        print("[OK] Seeded user accounts in PostgreSQL.")

        # 4. Seed Cloud Accounts
        print("[4/10] Seeding cloud accounts...")
        existing_accounts = db.query(CloudAccount).filter(CloudAccount.tenant_id == tenant.id).count()
        if existing_accounts == 0:
            aws_acc = CloudAccount(
                tenant_id=tenant.id,
                provider="aws",
                account_id="123456789012",
                alias="AWS AI Production",
                currency="USD",
                is_active=True,
            )
            gcp_acc = CloudAccount(
                tenant_id=tenant.id,
                provider="gcp",
                account_id="gcp-finops-prod-01",
                alias="GCP Vertex & TPU Cluster",
                currency="USD",
                is_active=True,
            )
            azure_acc = CloudAccount(
                tenant_id=tenant.id,
                provider="azure",
                account_id="sub-8899-2211-azure",
                alias="Azure OpenAI Services",
                currency="USD",
                is_active=True,
            )
            db.add_all([aws_acc, gcp_acc, azure_acc])
            db.flush()
            print("[OK] Seeded Cloud Accounts: AWS, GCP, Azure.")
        else:
            print(f"[OK] Cloud accounts already present ({existing_accounts} accounts).")

        cloud_acc = db.query(CloudAccount).filter(CloudAccount.tenant_id == tenant.id).first()

        # 5. Seed Accelerators & Kubernetes Infrastructure
        print("[5/10] Seeding AI Accelerators & K8s clusters...")
        existing_clusters = db.query(K8sCluster).filter(K8sCluster.tenant_id == tenant.id).count()
        if existing_clusters == 0:
            cluster = K8sCluster(
                tenant_id=tenant.id,
                name="ai-inference-prod-us",
                provider="gcp",
                region="us-central1",
                k8s_version="1.29.2",
                labels={"env": "production", "tier": "gpu-accelerated"},
            )
            db.add(cluster)
            db.flush()

            node1 = K8sNode(
                tenant_id=tenant.id,
                cluster_id=cluster.id,
                name="gke-node-h100-pool-1",
                instance_type="a3-highgpu-8g",
                status=K8sNodeStatus.READY,
            )
            node2 = K8sNode(
                tenant_id=tenant.id,
                cluster_id=cluster.id,
                name="gke-node-a100-pool-2",
                instance_type="a2-highgpu-4g",
                status=K8sNodeStatus.READY,
            )
            db.add_all([node1, node2])
            db.flush()

            pod1 = K8sPod(
                tenant_id=tenant.id,
                cluster_id=cluster.id,
                node_id=node1.id,
                namespace="llm-serving",
                name="vllm-deepseek-r1-70b-worker-0",
                phase=PodPhase.RUNNING,
            )
            pod2 = K8sPod(
                tenant_id=tenant.id,
                cluster_id=cluster.id,
                node_id=node2.id,
                namespace="agent-ops",
                name="agent-orchestrator-service-1",
                phase=PodPhase.RUNNING,
            )
            db.add_all([pod1, pod2])

            h100_gpu = Accelerator(
                tenant_id=tenant.id,
                node_id=node1.id,
                accelerator_type=AcceleratorType.GPU,
                model="NVIDIA H100 SXM5",
                vendor="NVIDIA",
                device_id="GPU-H100-001",
                vram_gb=80,
                compute_units=132,
                status=AcceleratorStatus.IN_USE,
                hourly_cost_usd=Decimal("3.85"),
                extra={"pcie_id": "0000:00:04.0"},
            )
            a100_gpu = Accelerator(
                tenant_id=tenant.id,
                node_id=node2.id,
                accelerator_type=AcceleratorType.GPU,
                model="NVIDIA A100-SXM4-80GB",
                vendor="NVIDIA",
                device_id="GPU-A100-002",
                vram_gb=80,
                compute_units=108,
                status=AcceleratorStatus.IN_USE,
                hourly_cost_usd=Decimal("2.95"),
                extra={"instance": "p4d.24xlarge"},
            )
            tpu_v5 = Accelerator(
                tenant_id=tenant.id,
                accelerator_type=AcceleratorType.TPU,
                model="Google TPU v5e",
                vendor="Google",
                device_id="TPU-V5E-001",
                vram_gb=32,
                compute_units=4,
                status=AcceleratorStatus.AVAILABLE,
                hourly_cost_usd=Decimal("1.20"),
                extra={"chip_count": 4},
            )
            db.add_all([h100_gpu, a100_gpu, tpu_v5])
            print("[OK] Seeded K8s Clusters, Nodes, Pods, and AI Accelerators.")

        # 6. Seed AI Agents, Jobs, Recommendations, Anomalies, Budgets, and Teams
        print("[6/10] Seeding Agents, Recommendations, Anomalies, Budgets, and Teams...")
        if db.query(Team).filter(Team.tenant_id == tenant.id).count() == 0:
            teams_data = fake_data.get("teams", [
                {"name": "Platform Engineering", "department": "Engineering", "allocated": 85000},
                {"name": "Data Science", "department": "Analytics", "allocated": 65000},
                {"name": "Core AI & LLMs", "department": "AI Research", "allocated": 120000},
                {"name": "Security & Infra", "department": "Operations", "allocated": 40000},
            ])
            for t in teams_data:
                db.add(Team(
                    tenant_id=tenant.id,
                    name=t.get("name", "Team"),
                    department=t.get("department", "Engineering"),
                    allocated_budget_usd=Decimal(str(t.get("allocated", 50000))),
                ))
            db.flush()

        if db.query(Recommendation).filter(Recommendation.tenant_id == tenant.id).count() == 0:
            recs_data = fake_data.get("recommendations", [
                {
                    "title": "Consolidate Underutilized H100 GPU Allocations",
                    "category": "GPU Compute",
                    "description": "Node gke-node-h100-pool-1 averaged < 18% SM utilization between 00:00 - 06:00 UTC.",
                    "impact": "high",
                    "effort": "low",
                    "status": "open",
                    "savings": 1420.00,
                    "service": "GPU Compute",
                },
                {
                    "title": "Migrate Batch Inference to Spot TPU Instances",
                    "category": "AI Accelerators",
                    "description": "Move non-latency sensitive inference pipelines from On-Demand GPUs to Preemptible TPU v5e.",
                    "impact": "high",
                    "effort": "medium",
                    "status": "open",
                    "savings": 2850.00,
                    "service": "AI Accelerators",
                },
            ])
            for r in recs_data:
                impact_enum = RecommendationImpact.HIGH if str(r.get("impact", "")).lower() == "high" else RecommendationImpact.MEDIUM
                effort_enum = RecommendationEffort.LOW if str(r.get("effort", "")).lower() == "low" else RecommendationEffort.MEDIUM
                db.add(Recommendation(
                    tenant_id=tenant.id,
                    title=r.get("title", "Recommendation"),
                    category=r.get("category", "Optimization"),
                    description=r.get("description", ""),
                    impact=impact_enum,
                    effort=effort_enum,
                    status=RecommendationStatus.OPEN,
                    savings_usd=Decimal(str(r.get("savings", 500))),
                    resource_type=r.get("category", "Compute"),
                    resource_id=r.get("service", "res-01"),
                ))
            db.flush()

        if db.query(Anomaly).filter(Anomaly.tenant_id == tenant.id).count() == 0:
            anomalies_data = fake_data.get("anomalies", [
                {
                    "service": "OpenAI API Gateway",
                    "description": "Unexpected 320% token consumption jump on gpt-4o endpoints from team 'data-science'.",
                    "percentage": 320.5,
                    "severity": "high",
                }
            ])
            now_utc = datetime.now()
            for a in anomalies_data:
                sev_enum = AnomalySeverity.HIGH if str(a.get("severity", "")).lower() == "high" else AnomalySeverity.MEDIUM
                db.add(Anomaly(
                    tenant_id=tenant.id,
                    service=a.get("service", "Cloud Service"),
                    description=a.get("description", "Spike detected"),
                    spike_percentage=Decimal(str(a.get("percentage", 150))),
                    severity=sev_enum,
                    status=AnomalyStatus.OPEN,
                    detected_at=now_utc - timedelta(hours=6),
                ))
            db.flush()

        if db.query(Budget).filter(Budget.tenant_id == tenant.id).count() == 0:
            db.add(Budget(
                tenant_id=tenant.id,
                name="Q1 Global Cloud & AI Workload Budget",
                limit_usd=Decimal("450000.00"),
                current_spend_usd=Decimal("284300.50"),
                owner="FinOps Admin",
                status=BudgetStatus.UNDER_BUDGET,
            ))
            db.flush()

        # 7. Seed Payment Receipts, Reports, Virtual Tags, Unit Economics, Forecasting
        print("[7/10] Seeding Payment Receipts, Reports, Virtual Tags, and Unit Economics...")
        if db.query(PaymentReceipt).filter(PaymentReceipt.tenant_id == tenant.id).count() == 0:
            rcpts = fake_data.get("paymentReceipts", [])
            for r in rcpts:
                p_date = datetime.now()
                if "date" in r:
                    try:
                        p_date = datetime.fromisoformat(r["date"].replace("Z", "+00:00"))
                    except Exception:
                        pass
                db.add(PaymentReceipt(
                    tenant_id=tenant.id,
                    vendor=r.get("vendor", "Cloud Vendor"),
                    amount_usd=Decimal(str(r.get("amount", 1000))),
                    currency=r.get("currency", "USD"),
                    status=r.get("status", "paid"),
                    invoice_number=r.get("invoiceNumber", f"INV-{uuid.uuid4().hex[:8]}"),
                    description=r.get("description", ""),
                    category=r.get("category", "Cloud Infrastructure"),
                    download_url=r.get("downloadUrl", "/receipts/sample.pdf"),
                    payment_date=p_date,
                ))
            db.flush()

        if db.query(Report).filter(Report.tenant_id == tenant.id).count() == 0:
            reports_list = fake_data.get("reports", [])
            for rep in reports_list:
                fmt_str = str(rep.get("format", "PDF")).upper()
                fmt_enum = ReportFormat.PDF
                if "CSV" in fmt_str:
                    fmt_enum = ReportFormat.CSV
                elif "JSON" in fmt_str:
                    fmt_enum = ReportFormat.JSON

                freq_str = str(rep.get("frequency", "Weekly")).upper()
                freq_enum = ReportFrequency.WEEKLY
                if "ONCE" in freq_str:
                    freq_enum = ReportFrequency.ONCE
                elif "DAILY" in freq_str:
                    freq_enum = ReportFrequency.DAILY
                elif "MONTHLY" in freq_str:
                    freq_enum = ReportFrequency.MONTHLY

                db.add(Report(
                    tenant_id=tenant.id,
                    name=rep.get("name", "FinOps Report"),
                    frequency=freq_enum,
                    recipients=rep.get("recipients", ["admin@finops.com"]),
                    format=fmt_enum,
                    last_run_at=datetime.now() - timedelta(days=2),
                    next_run_at=datetime.now() + timedelta(days=5),
                    download_url="/reports/latest.pdf",
                    is_active=True,
                ))
            db.flush()

        if db.query(VirtualTagRule).filter(VirtualTagRule.tenant_id == tenant.id).count() == 0:
            vtags = fake_data.get("virtualTags", [])
            for vt in vtags:
                db.add(VirtualTagRule(
                    tenant_id=tenant.id,
                    provider=vt.get("provider", "AWS"),
                    raw_key=vt.get("rawKey", "tag"),
                    raw_value=vt.get("rawValue", "*"),
                    normalized_key=vt.get("normalizedKey", "cost_center"),
                    normalized_value=vt.get("normalizedValue", "engineering"),
                ))
            db.flush()

        if db.query(UnitEconomicsRecord).filter(UnitEconomicsRecord.tenant_id == tenant.id).count() == 0:
            ue_list = fake_data.get("unitEconomics", [])
            for ue in ue_list:
                db.add(UnitEconomicsRecord(
                    tenant_id=tenant.id,
                    month=ue.get("month", "2026-03"),
                    cost_per_user=Decimal(str(ue.get("costPerUser", 1.50))),
                    cost_per_transaction=Decimal(str(ue.get("costPerTransaction", 0.005))),
                    revenue=Decimal(str(ue.get("revenue", 100000))),
                    margin=Decimal(str(ue.get("margin", 70.0))),
                ))
            db.flush()

        if db.query(ForecastingDriver).filter(ForecastingDriver.tenant_id == tenant.id).count() == 0:
            drivers = fake_data.get("forecasting", {}).get("drivers", [])
            for d in drivers:
                db.add(ForecastingDriver(
                    tenant_id=tenant.id,
                    service=d.get("service", "Cloud Service"),
                    impact_usd=Decimal(str(d.get("impact", 5000))),
                    direction=d.get("direction", "up"),
                    reason=d.get("reason", "Workload expansion"),
                ))
            db.add(ForecastingAccuracy(
                tenant_id=tenant.id,
                mape=Decimal("4.2"),
                rmse=Decimal("1250.00"),
                last_evaluated_at=datetime.now(),
            ))
            db.flush()

        # 8. Seed CostLineItems for dynamic metrics aggregation
        print("[8/10] Seeding CostLineItems for dynamic metric queries...")
        if db.query(CostLineItem).filter(CostLineItem.tenant_id == tenant.id).count() == 0 and cloud_acc:
            cost_trend = fake_data.get("costTrend", [])
            top_services = fake_data.get("topServices", [])

            # Generate monthly items
            now = datetime.now()
            for idx, trend in enumerate(cost_trend):
                date_offset = (len(cost_trend) - idx) * 30
                p_start = now - timedelta(days=date_offset)
                p_end = p_start + timedelta(days=30)

                for svc, cat_enum in [
                    ("compute", CostLineItemType.COMPUTE),
                    ("storage", CostLineItemType.STORAGE),
                    ("network", CostLineItemType.NETWORK),
                    ("kubernetes", CostLineItemType.OTHER),
                    ("database", CostLineItemType.OTHER),
                ]:
                    cost_val = trend.get(svc, 10000)
                    db.add(CostLineItem(
                        tenant_id=tenant.id,
                        cloud_account_id=cloud_acc.id,
                        resource_id=f"res-{svc}-{idx}",
                        service=svc.capitalize(),
                        line_item_type=cat_enum,
                        cost_usd=Decimal(str(cost_val)),
                        usage_amount=Decimal("1000.00"),
                        usage_unit="units",
                        usage_start=p_start,
                        usage_end=p_end,
                        tags={"environment": "production", "month": trend.get("month", "2025")},
                    ))
            # Seed current top services line items
            for s in top_services:
                db.add(CostLineItem(
                    tenant_id=tenant.id,
                    cloud_account_id=cloud_acc.id,
                    resource_id=f"res-top-{s.get('name', 'service')}",
                    service=s.get("name", "Compute Engine"),
                    line_item_type=CostLineItemType.COMPUTE,
                    cost_usd=Decimal(str(s.get("cost", 25000))),
                    usage_amount=Decimal("1500.00"),
                    usage_unit="hours",
                    usage_start=now - timedelta(days=30),
                    usage_end=now,
                    tags={"provider": s.get("provider", "AWS")},
                ))
            db.flush()

        # 9. Seed Dedicated Intelligence & Operations Records (Docker, MultiCloud, Hardware, TokenOps)
        print("[9/10] Seeding Docker, Multi-Cloud, Hardware, and TokenOPS analytics...")
        if db.query(DockerAnalyticsRecord).filter(DockerAnalyticsRecord.tenant_id == tenant.id).count() == 0:
            docker_data = fake_data.get("dockerAnalytics", {})
            db.add(DockerAnalyticsRecord(
                tenant_id=tenant.id,
                summary=docker_data.get("summary", {}),
                host_nodes=docker_data.get("hostNodes", []),
                containers=docker_data.get("containers", []),
                storage_waste=docker_data.get("storageWaste", {}),
            ))

        if db.query(MultiCloudAnalyticsRecord).filter(MultiCloudAnalyticsRecord.tenant_id == tenant.id).count() == 0:
            mc_data = fake_data.get("multiCloud", {})
            db.add(MultiCloudAnalyticsRecord(
                tenant_id=tenant.id,
                summary=mc_data.get("summary", {}),
                trend=mc_data.get("trend", []),
                providers=mc_data.get("providers", []),
                cross_cloud_arbitrage=mc_data.get("crossCloudArbitrage", []),
            ))

        if db.query(HardwareOrchestrationRecord).filter(HardwareOrchestrationRecord.tenant_id == tenant.id).count() == 0:
            hw_data = fake_data.get("hardwareOrchestration", {})
            db.add(HardwareOrchestrationRecord(
                tenant_id=tenant.id,
                summary=hw_data.get("summary", {}),
                accelerators=hw_data.get("accelerators", []),
                recommendations=hw_data.get("recommendations", []),
            ))

        t_data = fake_data.get("tokenOps", {})
        existing_t = db.query(TokenOpsRecord).filter(TokenOpsRecord.tenant_id == tenant.id).first()
        if not existing_t:
            db.add(TokenOpsRecord(
                tenant_id=tenant.id,
                summary=t_data.get("summary", {}),
                kpis=t_data.get("kpis", {}),
                cost_trend=t_data.get("costTrend", []),
                top_consumers=t_data.get("topConsumers", {}),
                model_breakdown=t_data.get("modelBreakdown", []),
                prompt_analytics=t_data.get("promptAnalytics", []),
                data=t_data,
            ))
        else:
            existing_t.data = t_data
            db.add(existing_t)

        l_data = fake_data.get("llmOps", {})
        existing_l = db.query(LLMOpsRecord).filter(LLMOpsRecord.tenant_id == tenant.id).first()
        if not existing_l:
            db.add(LLMOpsRecord(
                tenant_id=tenant.id,
                summary=l_data.get("summary", {}),
                kpis=l_data.get("kpis", []),
                cost_trend=l_data.get("costTrend", []),
                provider_usage=l_data.get("providerUsage", []),
                recent_executions=l_data.get("recentExecutions", []),
                tool_registry=l_data.get("toolRegistry", []),
                guardrails=l_data.get("guardrails", []),
                rag_stats=l_data.get("ragStats", []),
                quick_actions=l_data.get("quickActions", []),
                data=l_data,
            ))
        else:
            existing_l.data = l_data
            db.add(existing_l)


        # 10. Commit all changes
        print("[10/10] Committing all transactions to PostgreSQL...")
        db.commit()
        print("\n" + "=" * 60)
        print("MASTER SEEDING COMPLETED SUCCESSFULLY!")
        print("=" * 60)
        print(f"Tenant Organization : {tenant.name} ({tenant.slug})")
        print(f"Test Admin Email    : testuser@finops.com")
        print(f"Test Admin Password : admin@123")
        print("=" * 60)

    except Exception as exc:
        db.rollback()
        print(f"\n[ERROR] Master seeding failed: {exc}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
