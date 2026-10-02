"""
FinOps Platform - Database Seeder Script
Initializes tables and populates a test organization, admin user, and sample FinOps / AIOps data.
"""

from __future__ import annotations
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from datetime import datetime, timedelta
from decimal import Decimal
import uuid

from dotenv import load_dotenv

load_dotenv()

from app.core.config import settings
from app.core.security import get_password_hash
from app.db.session import SessionLocal, engine
from app.models.all_models import (
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
)


def seed_database() -> None:
    print("=" * 60)
    print("AI FinOps Platform - Database Seeder")
    print("Database:", settings.SQLALCHEMY_DATABASE_URI)
    print("=" * 60)

    # 1. Create all schema tables
    print("[1/6] Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("[OK] Database tables verified/created successfully.")

    db = SessionLocal()
    try:
        # 2. Check / Create Tenant
        print("[2/6] Checking tenant organization...")
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
            print(f"[OK] Created Organization: '{tenant.name}' (ID: {tenant.id}, Slug: {tenant.slug})")
        else:
            print(f"[OK] Existing Organization found: '{tenant.name}' (ID: {tenant.id})")

        # 3. Check / Create Test User
        print("[3/6] Checking test user account...")
        test_email = "testuser@finops.com"
        test_password = "admin@123"

        user = (
            db.query(User)
            .filter(User.tenant_id == tenant.id, User.email == test_email)
            .first()
        )

        if not user:
            user = User(
                email=test_email,
                password_hash=get_password_hash(test_password),
                role="admin",
                tenant_id=tenant.id,
                is_active=True,
            )
            db.add(user)
            db.flush()
            print(f"[OK] Created Test User: {test_email} (Role: {user.role}, ID: {user.id})")
        else:
            user.password_hash = get_password_hash(test_password)
            user.is_active = True
            db.flush()
            print(f"[OK] Updated existing Test User: {test_email}")

        # 4. Seed Cloud Accounts
        print("[4/6] Seeding multi-cloud accounts...")
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
            print("[OK] Seeded 3 Cloud Accounts: AWS, GCP, Azure")
        else:
            print(f"[OK] Cloud accounts already present ({existing_accounts} accounts).")

        # 5. Seed Accelerators (GPU/TPU/LPU) & Kubernetes Infrastructure
        print("[5/6] Seeding AI Accelerators & K8s clusters...")
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

            # Pods
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

            # Accelerators
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
            print("[OK] Seeded K8s Clusters, Nodes, Pods, and AI Accelerators (H100, A100, TPU v5e).")

        # 6. Seed AI Agents, Jobs, Cost Items, Budgets, and Recommendations
        print("[6/6] Seeding AI Agents, Budgets, Recommendations, and Anomalies...")
        existing_agents = db.query(Agent).filter(Agent.tenant_id == tenant.id).count()
        if existing_agents == 0:
            agent1 = Agent(
                tenant_id=tenant.id,
                name="Cost-Anomaly-Guardian-Agent",
                framework="langgraph",
                model_id="claude-3-5-sonnet",
                version="2.4.0",
                status=AgentStatus.ACTIVE,
                config={"cadence": "continuous", "budget_limit": 500},
            )
            agent2 = Agent(
                tenant_id=tenant.id,
                name="LLM-Cache-Router-Agent",
                framework="custom",
                model_id="gpt-4o",
                version="1.1.2",
                status=AgentStatus.ACTIVE,
                config={"cache_hit_rate": "42%", "savings_pct": "35%"},
            )
            db.add_all([agent1, agent2])
            db.flush()

            # Orchestration Job
            job1 = OrchestrationJob(
                tenant_id=tenant.id,
                agent_id=agent1.id,
                name="nightly-finops-token-reconciliation",
                job_type="inference-eval",
                status=JobStatus.COMPLETED,
                prompt_tokens=850000,
                completion_tokens=600000,
                started_at=datetime.utcnow() - timedelta(hours=3),
                finished_at=datetime.utcnow() - timedelta(hours=2),
                tags={"environment": "production"},
                metadata_={"total_cost_usd": 14.85},
            )
            db.add(job1)

            # Budget
            budget = Budget(
                tenant_id=tenant.id,
                name="Q1 Global Cloud & AI Workload Budget",
                limit_usd=Decimal("45000.00"),
                current_spend_usd=Decimal("28430.50"),
                owner="FinOps Admin",
                status=BudgetStatus.UNDER_BUDGET,
            )
            db.add(budget)

            # Recommendations
            rec1 = Recommendation(
                tenant_id=tenant.id,
                title="Consolidate Underutilized H100 GPU Allocations",
                category="GPU Compute",
                description="Node gke-node-h100-pool-1 averaged < 18% SM utilization between 00:00 - 06:00 UTC. Auto-suspend saves ~$1,420/month.",
                impact=RecommendationImpact.HIGH,
                effort=RecommendationEffort.LOW,
                status=RecommendationStatus.OPEN,
                savings_usd=Decimal("1420.00"),
                resource_type="GPU",
                resource_id="h100-sxm5-01",
            )
            rec2 = Recommendation(
                tenant_id=tenant.id,
                title="Migrate Batch Inference to Spot TPU Instances",
                category="AI Accelerators",
                description="Move non-latency sensitive inference pipelines from On-Demand GPUs to Preemptible Google TPU v5e.",
                impact=RecommendationImpact.HIGH,
                effort=RecommendationEffort.MEDIUM,
                status=RecommendationStatus.OPEN,
                savings_usd=Decimal("2850.00"),
                resource_type="Compute",
                resource_id="batch-inference-queue",
            )
            db.add_all([rec1, rec2])

            # Anomaly
            now_utc = datetime.now()
            anomaly = Anomaly(
                tenant_id=tenant.id,
                service="OpenAI API Gateway",
                description="Unexpected 320% token consumption jump on gpt-4o endpoints from team 'data-science'.",
                spike_percentage=Decimal("320.50"),
                severity=AnomalySeverity.HIGH,
                status=AnomalyStatus.OPEN,
                detected_at=now_utc - timedelta(hours=5),
            )
            db.add(anomaly)
            print("[OK] Seeded AI Agents, Jobs, Budget, Recommendations, and Anomalies.")

        db.commit()
        print("\n" + "=" * 60)
        print("SEEDING COMPLETED SUCCESSFULLY!")
        print("=" * 60)
        print(f"Tenant Organization : {tenant.name} ({tenant.slug})")
        print(f"Admin Test User     : {test_email}")
        print(f"Password            : {test_password}")
        print("=" * 60)

    except Exception as exc:
        db.rollback()
        print(f"\n[ERROR] Seeding failed: {exc}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
