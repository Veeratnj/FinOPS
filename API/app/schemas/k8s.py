"""
Kubernetes schemas.
"""

from pydantic import BaseModel
from typing import Optional, List


class K8sCluster(BaseModel):
    """Kubernetes cluster schema."""
    id: str
    name: str
    provider: str
    region: Optional[str]
    k8s_version: Optional[str]
    node_count: int = 0
    status: str = "healthy"


class K8sNamespace(BaseModel):
    """Kubernetes namespace schema."""
    name: str
    status: str
    pod_count: int = 0
    resource_usage: dict = {}


class ClusterSummary(BaseModel):
    """Cluster summary."""
    total_clusters: int
    healthy_clusters: int
    total_nodes: int
    total_pods: int