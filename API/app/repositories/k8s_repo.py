"""
Kubernetes repository for clusters, nodes, and pods.
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from app.models import K8sCluster, K8sNode, K8sPod
from app.repositories.base import BaseRepository


class K8sRepository:
    """Kubernetes cluster and node repository."""

    def get_clusters(self, db: Session, tenant_id: str) -> List[K8sCluster]:
        return db.query(K8sCluster).filter(K8sCluster.tenant_id == tenant_id).all()

    def get_cluster_by_id(self, db: Session, cluster_id: str, tenant_id: str) -> Optional[K8sCluster]:
        return db.query(K8sCluster).filter(K8sCluster.id == cluster_id, K8sCluster.tenant_id == tenant_id).first()

    def get_nodes(self, db: Session, tenant_id: str, cluster_id: Optional[str] = None) -> List[K8sNode]:
        query = db.query(K8sNode).filter(K8sNode.tenant_id == tenant_id)
        if cluster_id:
            query = query.filter(K8sNode.cluster_id == cluster_id)
        return query.all()

    def get_pods(self, db: Session, tenant_id: str, cluster_id: Optional[str] = None) -> List[K8sPod]:
        query = db.query(K8sPod).filter(K8sPod.tenant_id == tenant_id)
        if cluster_id:
            query = query.filter(K8sPod.cluster_id == cluster_id)
        return query.all()


k8s_repo = K8sRepository()
