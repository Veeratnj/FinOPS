-- Targeted PostgreSQL Seeder for Hardware Orchestration (/api/hardware-orchestration)
-- and Docker Fleet (/api/docker) for organization slug 'sangatna'.
-- Run with: psql -U finops -d finops_v2 -f seed_hardware_docker.sql

BEGIN;

-- 1. Seed hardware_orchestration for 'sangatna'
DELETE FROM hardware_orchestration
WHERE tenant_id IN (SELECT id FROM tenants WHERE slug = 'sangatna');

INSERT INTO hardware_orchestration (
    id, tenant_id, summary, accelerators, recommendations, created_at, updated_at
)
SELECT
    gen_random_uuid(),
    t.id,
    $hw_sum${"totalAccelerators": 64, "activeCount": 56, "idleCount": 8, "totalHourlyBurn": 128.4, "avgComputeUtilization": 76.8, "monthlyHardwareSpend": 92448, "potentialMonthlySavings": 18200}$hw_sum$::jsonb,
    $hw_acc${"gpu": {"overview": {"count": 36, "avgUtilization": 81.4, "totalVRAM_GB": 2880, "allocatedVRAM_GB": 2360, "hourlyCost": 88.5}, "devices": [{"id": "gpu-h100-node-01-a", "type": "NVIDIA H100 SXM5 80GB", "cluster": "us-east-ai-training", "smUtil": 92, "vramAllocatedGB": 78, "vramTotalGB": 80, "tempC": 67, "powerW": 640, "costPerHour": 3.85, "status": "Saturated", "model": "Llama-3.3-70B-FP8"}, {"id": "gpu-h100-node-01-b", "type": "NVIDIA H100 SXM5 80GB", "cluster": "us-east-ai-training", "smUtil": 94, "vramAllocatedGB": 78, "vramTotalGB": 80, "tempC": 69, "powerW": 655, "costPerHour": 3.85, "status": "Saturated", "model": "Llama-3.3-70B-FP8"}, {"id": "gpu-a100-inference-02", "type": "NVIDIA A100 SXM4 80GB", "cluster": "us-central-serving", "smUtil": 58, "vramAllocatedGB": 44, "vramTotalGB": 80, "tempC": 58, "powerW": 310, "costPerHour": 2.65, "status": "Healthy", "model": "Mistral-Large-Instruct"}, {"id": "gpu-l40s-rag-embed-01", "type": "NVIDIA L40S 48GB", "cluster": "eu-west-embeddings", "smUtil": 38, "vramAllocatedGB": 18, "vramTotalGB": 48, "tempC": 48, "powerW": 180, "costPerHour": 1.45, "status": "Underutilized", "model": "BGE-Large-En-v1.5"}, {"id": "gpu-a100-standby-03", "type": "NVIDIA A100 SXM4 80GB", "cluster": "us-central-serving", "smUtil": 4, "vramAllocatedGB": 12, "vramTotalGB": 80, "tempC": 36, "powerW": 95, "costPerHour": 2.65, "status": "Idle / Zombie", "model": "None (Warm Pool)"}, {"id": "gpu-l40s-vision-04", "type": "NVIDIA L40S 48GB", "cluster": "ap-south-inference", "smUtil": 73, "vramAllocatedGB": 36, "vramTotalGB": 48, "tempC": 61, "powerW": 265, "costPerHour": 1.45, "status": "Healthy", "model": "Qwen2.5-VL-32B"}]}, "mpu": {"overview": {"count": 16, "avgUtilization": 74.2, "podSlices": 4, "hourlyCost": 28.8}, "devices": [{"id": "tpu-v5e-slice-16a", "type": "Google Cloud TPU v5e (16 chips)", "region": "us-central1-a", "mxuDutyCycle": 82, "hbmThroughputGBs": 680, "costPerHour": 19.2, "status": "Training Active", "workload": "Multimodal-Embedding-Distillation"}, {"id": "tpu-v4-pod-slice-8", "type": "Google Cloud TPU v4 (8 chips)", "region": "us-central2-b", "mxuDutyCycle": 66, "hbmThroughputGBs": 510, "costPerHour": 9.6, "status": "Fine-Tuning", "workload": "Domain-RAG-Adapter-LoRA"}]}, "cpu": {"overview": {"totalCores": 512, "avgUtilization": 68.5, "architectureBreakdown": "65% ARM Graviton4 / 35% AMD EPYC", "hourlyCost": 7.4}, "devices": [{"id": "arm-graviton4-pool-01", "type": "AWS c8g.8xlarge (ARM Graviton4)", "cores": 32, "utilization": 78, "memoryGB": 64, "costPerHour": 1.16, "status": "High Efficiency", "role": "Vector Tokenization & ETL"}, {"id": "epyc-genoa-pool-02", "type": "AMD EPYC 9654 (x86_64)", "cores": 64, "utilization": 59, "memoryGB": 256, "costPerHour": 2.45, "status": "Healthy", "role": "Inference Gateway & Routing"}, {"id": "arm-graviton4-pool-03", "type": "AWS r8g.4xlarge (ARM Graviton4)", "cores": 16, "utilization": 71, "memoryGB": 128, "costPerHour": 0.98, "status": "High Efficiency", "role": "Semantic Prompt Cache Store"}]}, "lpu": {"overview": {"count": 12, "avgTokensPerSec": 560, "sramBandwidthTBps": 80, "hourlyCost": 3.7}, "devices": [{"id": "groq-lpu-node-alpha", "type": "Groq LPU Inference Rack", "targetModel": "Llama-3.1-8B-Instant", "throughputTokSec": 620, "latencyFirstTokenMs": 95, "costPerMillionTokens": 0.08, "status": "Ultra-Fast"}, {"id": "groq-lpu-node-beta", "type": "Groq LPU Inference Rack", "targetModel": "Mixtral-8x7B-32k", "throughputTokSec": 480, "latencyFirstTokenMs": 130, "costPerMillionTokens": 0.24, "status": "Ultra-Fast"}, {"id": "groq-lpu-node-gamma", "type": "Groq LPU SpecDec Rack", "targetModel": "Llama-3.3-70B-SpecDec", "throughputTokSec": 580, "latencyFirstTokenMs": 112, "costPerMillionTokens": 0.59, "status": "Ultra-Fast"}]}}$hw_acc$::jsonb,
    $hw_rec$[{"type": "GPU Idle Shutdown", "severity": "High", "impact": "$1,908 / mo", "description": "gpu-a100-standby-03 has had < 5% SM utilization for 72 hours. Auto-hibernate or return to spot pool."}, {"type": "LPU Routing Arbitrage", "severity": "Medium", "impact": "$2,850 / mo", "description": "Route low-complexity agent classification steps from H100 to Groq LPU (4x lower latency, 65% cheaper)."}, {"type": "ARM CPU Migration", "severity": "Low", "impact": "$980 / mo", "description": "Migrate remaining x86 tokenizers to AWS Graviton4 for 22% better price-performance."}]$hw_rec$::jsonb,
    NOW(),
    NOW()
FROM tenants t
WHERE t.slug = 'sangatna';

-- 2. Seed docker_analytics for 'sangatna'
DELETE FROM docker_analytics
WHERE tenant_id IN (SELECT id FROM tenants WHERE slug = 'sangatna');

INSERT INTO docker_analytics (
    id, tenant_id, summary, host_nodes, containers, storage_waste, created_at, updated_at
)
SELECT
    gen_random_uuid(),
    t.id,
    $dk_sum${"totalHosts": 18, "runningContainers": 142, "stoppedContainers": 28, "zombieContainers": 9, "danglingStorageGB": 384, "monthlyContainerSpend": 18450, "potentialMonthlySavings": 3920}$dk_sum$::jsonb,
    $dk_hst$[{"host": "prod-docker-worker-01", "ip": "10.0.4.12", "os": "Ubuntu 22.04 LTS", "containers": 18, "cpuUsage": 74, "memUsage": 82, "diskUsage": 68, "status": "Healthy"}, {"host": "prod-docker-worker-02", "ip": "10.0.4.13", "os": "Ubuntu 22.04 LTS", "containers": 16, "cpuUsage": 62, "memUsage": 71, "diskUsage": 59, "status": "Healthy"}, {"host": "ai-inference-sidecar-01", "ip": "10.0.8.20", "os": "Amazon Linux 2023", "containers": 8, "cpuUsage": 89, "memUsage": 91, "diskUsage": 84, "status": "High Load"}, {"host": "build-runner-daemon-01", "ip": "10.0.12.5", "os": "Debian 12", "containers": 12, "cpuUsage": 18, "memUsage": 32, "diskUsage": 94, "status": "Storage Alert"}]$dk_hst$::jsonb,
    $dk_cnt$[{"name": "vllm-mistral-inference", "image": "vllm/vllm-openai:v0.6.2", "host": "ai-inference-sidecar-01", "status": "running", "cpu": "380%", "mem": "28.4 GB", "costPerHour": 1.42, "category": "AI Inference"}, {"name": "qdrant-vector-db-primary", "image": "qdrant/qdrant:v1.12.0", "host": "prod-docker-worker-01", "status": "running", "cpu": "120%", "mem": "14.2 GB", "costPerHour": 0.65, "category": "Vector DB"}, {"name": "redis-agent-cache-cluster", "image": "redis:7.2-alpine", "host": "prod-docker-worker-02", "status": "running", "cpu": "25%", "mem": "4.1 GB", "costPerHour": 0.18, "category": "Cache & Queues"}, {"name": "celery-token-aggregator", "image": "finops/worker:latest", "host": "prod-docker-worker-02", "status": "running", "cpu": "85%", "mem": "3.8 GB", "costPerHour": 0.22, "category": "Workers"}, {"name": "litellm-proxy-gateway", "image": "ghcr.io/berriai/litellm:main-v1.52", "host": "prod-docker-worker-01", "status": "running", "cpu": "64%", "mem": "2.6 GB", "costPerHour": 0.19, "category": "AI Gateway"}, {"name": "stale-langchain-eval-runner", "image": "evaluation/eval-harness:v2", "host": "build-runner-daemon-01", "status": "zombie", "cpu": "2%", "mem": "6.2 GB", "costPerHour": 0.35, "category": "Orphaned"}, {"name": "abandoned-notebook-jupyter", "image": "jupyter/scipy-notebook:latest", "host": "ai-inference-sidecar-01", "status": "zombie", "cpu": "1%", "mem": "8.4 GB", "costPerHour": 0.48, "category": "Orphaned"}, {"name": "dev-sandbox-embedding-test", "image": "text-embeddings-inference:1.5", "host": "prod-docker-worker-01", "status": "exited", "cpu": "0%", "mem": "0 GB", "costPerHour": 0.0, "category": "Stopped"}]$dk_cnt$::jsonb,
    $dk_wst$[{"item": "Dangling image layers (<none>:<none>)", "count": 142, "sizeGB": 194.5, "costPerMonth": 48.6, "action": "docker image prune -a"}, {"item": "Orphaned persistent volumes", "count": 19, "sizeGB": 112.0, "costPerMonth": 33.6, "action": "docker volume prune"}, {"item": "BuildKit cache-mount blobs", "count": 64, "sizeGB": 77.5, "costPerMonth": 23.25, "action": "docker builder prune"}]$dk_wst$::jsonb,
    NOW(),
    NOW()
FROM tenants t
WHERE t.slug = 'sangatna';

COMMIT;
