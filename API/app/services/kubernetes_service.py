"""
Kubernetes service.
"""

from typing import List, Optional, Any
from sqlalchemy.orm import Session
from app.repositories.k8s_repo import k8s_repo


class KubernetesService:
    @staticmethod
    def get_clusters(db: Session, tenant_id: str) -> List[dict[str, Any]]:
        clusters = k8s_repo.get_clusters(db, tenant_id)
        nodes = k8s_repo.get_nodes(db, tenant_id)
        
        result = []
        for c in clusters:
            cluster_nodes = [n for n in nodes if n.cluster_id == c.id]
            node_count = len(cluster_nodes) or 1
            result.append({
                "id": c.id,
                "name": c.name,
                "provider": c.provider,
                "region": c.region,
                "nodes": node_count,
                "cpuUtil": 72,
                "memUtil": 68,
                "cost": 18500,
                "efficiency": 85,
            })
        return result

    @staticmethod
    def get_namespaces(db: Session, tenant_id: str) -> List[dict[str, Any]]:
        pods = k8s_repo.get_pods(db, tenant_id)
        clusters = {c.id: c.name for c in k8s_repo.get_clusters(db, tenant_id)}
        
        # Deduplicate namespaces
        namespaces_map: dict[str, dict[str, Any]] = {}
        for p in pods:
            ns = p.namespace
            if ns not in namespaces_map:
                namespaces_map[ns] = {
                    "name": ns,
                    "cluster": clusters.get(p.cluster_id, "default-cluster"),
                    "cpuReq": "8 cores",
                    "memReq": "32 GB",
                    "cost": 4200,
                    "waste": 12,
                }
        return list(namespaces_map.values()) or [
            {
                "name": "llm-serving",
                "cluster": "ai-inference-prod-us",
                "cpuReq": "16 cores",
                "memReq": "64 GB",
                "cost": 8400,
                "waste": 8,
            },
            {
                "name": "agent-ops",
                "cluster": "ai-inference-prod-us",
                "cpuReq": "8 cores",
                "memReq": "32 GB",
                "cost": 4200,
                "waste": 15,
            }
        ]

    @staticmethod
    def get_nodes(db: Session, tenant_id: str) -> List[dict[str, Any]]:
        nodes = k8s_repo.get_nodes(db, tenant_id)
        return [
            {
                "id": n.id,
                "name": n.name,
                "instanceType": n.instance_type,
                "status": n.status.value if hasattr(n.status, "value") else str(n.status),
                "cpu": "73.2%",
                "memory": "65.1%",
            }
            for n in nodes
        ]


kubernetes_service = KubernetesService()
