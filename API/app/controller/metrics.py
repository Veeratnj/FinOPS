"""Metrics controller - serves platform metrics and analytics data."""

import json
from typing import Any
from pathlib import Path
from fastapi import APIRouter

metrics_controller = APIRouter(prefix="/metrics", tags=["Metrics"])

# Load data once at startup
_metrics_cache = None


def _load_metrics_data() -> dict[str, Any]:
    """Load and cache the metrics data file."""
    global _metrics_cache

    if _metrics_cache is not None:
        return _metrics_cache

    # Try to find data file in the public directory
    possible_paths = [
        Path(__file__).parent.parent.parent / "App" / "public" / "fakedata.json",
        Path(__file__).parent.parent.parent.parent / "App" / "public" / "fakedata.json",
    ]

    for path in possible_paths:
        if path.exists():
            with open(path, 'r') as f:
                _metrics_cache = json.load(f)
                return _metrics_cache

    # Fallback: return empty dict if file not found
    print(f"Warning: metrics data file not found")
    return {}


@metrics_controller.get("/all")
async def get_all_metrics() -> dict[str, Any]:
    """Get all metrics and analytics data."""
    return _load_metrics_data()


@metrics_controller.get("/summary")
async def get_summary() -> dict[str, Any]:
    """Get cost summary data."""
    data = _load_metrics_data()
    return data.get("summary", {})


@metrics_controller.get("/cost-by-category")
async def get_cost_by_category() -> list[dict[str, Any]]:
    """Get cost breakdown by category."""
    data = _load_metrics_data()
    return data.get("costByCategory", [])


@metrics_controller.get("/cost-trend")
async def get_cost_trend() -> list[dict[str, Any]]:
    """Get cost trends over time."""
    data = _load_metrics_data()
    return data.get("costTrend", [])


@metrics_controller.get("/top-services")
async def get_top_services() -> list[dict[str, Any]]:
    """Get top services by cost."""
    data = _load_metrics_data()
    return data.get("topServices", [])


@metrics_controller.get("/recommendations")
async def get_recommendations() -> list[dict[str, Any]]:
    """Get cost optimization recommendations."""
    data = _load_metrics_data()
    return data.get("recommendations", [])


@metrics_controller.get("/anomalies")
async def get_anomalies() -> list[dict[str, Any]]:
    """Get detected anomalies."""
    data = _load_metrics_data()
    return data.get("anomalies", [])


@metrics_controller.get("/kubernetes")
async def get_kubernetes() -> dict[str, Any]:
    """Get Kubernetes metrics and cluster data."""
    data = _load_metrics_data()
    return data.get("kubernetes", {})


@metrics_controller.get("/kubernetes/clusters")
async def get_kubernetes_clusters() -> list[dict[str, Any]]:
    """Get Kubernetes cluster data."""
    data = _load_metrics_data()
    return data.get("kubernetes", {}).get("clusters", [])


@metrics_controller.get("/kubernetes/namespaces")
async def get_kubernetes_namespaces() -> list[dict[str, Any]]:
    """Get Kubernetes namespace data."""
    data = _load_metrics_data()
    return data.get("kubernetes", {}).get("namespaces", [])


@metrics_controller.get("/teams")
async def get_teams() -> list[dict[str, Any]]:
    """Get team cost allocation data."""
    data = _load_metrics_data()
    return data.get("teams", [])


@metrics_controller.get("/unit-economics")
async def get_unit_economics() -> list[dict[str, Any]]:
    """Get unit economics data."""
    data = _load_metrics_data()
    return data.get("unitEconomics", [])


@metrics_controller.get("/budgets")
async def get_budgets() -> list[dict[str, Any]]:
    """Get budget data."""
    data = _load_metrics_data()
    return data.get("budgets", [])


@metrics_controller.get("/virtual-tags")
async def get_virtual_tags() -> list[dict[str, Any]]:
    """Get virtual tags data."""
    data = _load_metrics_data()
    return data.get("virtualTags", [])


@metrics_controller.get("/reports")
async def get_reports() -> list[dict[str, Any]]:
    """Get reports data."""
    data = _load_metrics_data()
    return data.get("reports", [])


@metrics_controller.get("/forecasting")
async def get_forecasting() -> dict[str, Any]:
    """Get forecasting data."""
    data = _load_metrics_data()
    return data.get("forecasting", {})


@metrics_controller.get("/users")
async def get_users() -> list[dict[str, Any]]:
    """Get users data."""
    data = _load_metrics_data()
    return data.get("users", [])


@metrics_controller.get("/tenants")
async def get_tenants() -> list[dict[str, Any]]:
    """Get tenants data."""
    data = _load_metrics_data()
    return data.get("tenants", [])


@metrics_controller.get("/payment-receipts")
async def get_payment_receipts() -> list[dict[str, Any]]:
    """Get payment receipts data."""
    data = _load_metrics_data()
    return data.get("paymentReceipts", [])


@metrics_controller.get("/agent-ops")
async def get_agent_ops() -> dict[str, Any]:
    """Get agent operations metrics."""
    data = _load_metrics_data()
    return data.get("agentOps", {})


@metrics_controller.get("/llm-ops")
async def get_llm_ops() -> dict[str, Any]:
    """Get LLM operations metrics."""
    data = _load_metrics_data()
    return data.get("llmOps", {})


@metrics_controller.get("/agent-ops/kpis")
async def get_agent_ops_kpis() -> list[dict[str, Any]]:
    """Get agent ops KPIs."""
    data = _load_metrics_data()
    return data.get("agentOps", {}).get("kpis", [])


@metrics_controller.get("/llm-ops/kpis")
async def get_llm_ops_kpis() -> list[dict[str, Any]]:
    """Get LLM ops KPIs."""
    data = _load_metrics_data()
    return data.get("llmOps", {}).get("kpis", [])
