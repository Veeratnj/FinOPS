"""Kubernetes controller."""

from typing import Any

from fastapi import APIRouter

kubernetes_controller = APIRouter(prefix="/kubernetes", tags=["Kubernetes"])


@kubernetes_controller.get("/clusters")
def get_kubernetes_clusters() -> list[dict[str, Any]]:
    return [
        {"name": "prod-us-east", "nodes": 24, "cpuUtil": 72, "memUtil": 68, "cost": 18500, "efficiency": 85},
        {"name": "prod-eu-west", "nodes": 16, "cpuUtil": 58, "memUtil": 52, "cost": 12800, "efficiency": 71},
    ]


@kubernetes_controller.get("/clusters/{cluster_id}")
def get_cluster(cluster_id: str) -> dict[str, Any]:
    return {"name": "prod-us-east", "nodes": 24, "cpuUtil": 72, "memUtil": 68, "cost": 18500, "efficiency": 85}


@kubernetes_controller.get("/clusters/{cluster_id}/cost-breakdown")
def get_cluster_cost_breakdown(cluster_id: str) -> dict[str, Any]:
    return {"cluster": "prod-us-east", "cost": 18500, "breakdown": {"compute": 11100, "storage": 3700, "network": 3700}}


@kubernetes_controller.get("/namespaces")
def get_kubernetes_namespaces() -> list[dict[str, Any]]:
    return [{"name": "api-gateway", "cluster": "prod-us-east", "cpuReq": "8 cores", "memReq": "32 GB", "cost": 4200, "waste": 12}]


@kubernetes_controller.get("/namespaces/{namespace_id}")
def get_namespace(namespace_id: str) -> dict[str, Any]:
    return {"name": "api-gateway", "cluster": "prod-us-east", "cpuReq": "8 cores", "memReq": "32 GB", "cost": 4200, "waste": 12}


@kubernetes_controller.get("/resource-waste")
def get_resource_waste() -> list[dict[str, Any]]:
    return [{"namespace": "ml-pipeline", "cluster": "prod-us-east", "waste": 35, "cost": 7800}]


@kubernetes_controller.get("/clusters/{cluster_id}/efficiency")
def get_cluster_efficiency(cluster_id: str) -> dict[str, Any]:
    return {"cluster": "prod-us-east", "efficiency": 85, "cpuUtil": 72, "memUtil": 68}


@kubernetes_controller.get("/pods")
def get_pods() -> list[dict[str, Any]]:
    return [{"namespace": "api-gateway", "cpuReq": "8 cores", "memReq": "32 GB"}]


@kubernetes_controller.get("/namespaces/{namespace_id}/trend")
def get_namespace_trend(namespace_id: str) -> list[dict[str, Any]]:
    return [{"month": "Apr 2025", "cost": "3840"}, {"month": "Mar 2026", "cost": "4200"}]


@kubernetes_controller.get("/clusters/{cluster_id}/nodes")
def get_cluster_nodes(cluster_id: str) -> list[dict[str, Any]]:
    return [{"id": "node-1", "cluster": "prod-us-east", "cpu": "73.2%", "memory": "65.1%"}]


@kubernetes_controller.get("/clusters/{cluster_id}/export")
def export_cluster(cluster_id: str) -> dict[str, Any]:
    return {"downloadUrl": f"/exports/cluster_{cluster_id}_export.csv"}


@kubernetes_controller.get("/right-sizing")
def get_right_sizing() -> list[dict[str, Any]]:
    return [{"recommendation": "Right-size CPU cores", "savings": 12200, "category": "Kubernetes"}]


@kubernetes_controller.get("/sample")
def sample_kubernetes():
    return {
        'data': [],
        'msg': "Kubernetes data fetched successfully"
    }

