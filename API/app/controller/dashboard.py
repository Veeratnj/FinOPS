"""Dashboard controller."""

import json
from typing import Any
from pathlib import Path

from fastapi import APIRouter

dashboard_controller = APIRouter(prefix="/dashboard", tags=["Dashboard"])

# Load metrics data once at startup
_metrics_cache = None


def _load_metrics_data() -> dict[str, Any]:
    """Load and cache the metrics data from fakedata.json."""
    global _metrics_cache

    if _metrics_cache is not None:
        return _metrics_cache

    # Try to find data file in the public directory
    possible_paths = [
        Path(__file__).parent.parent.parent / "Ctrls-BUI" / "public" / "fakedata.json",
        Path(__file__).parent.parent.parent.parent / "Ctrls-BUI" / "public" / "fakedata.json",
    ]

    for path in possible_paths:
        if path.exists():
            with open(path, 'r') as f:
                _metrics_cache = json.load(f)
                return _metrics_cache

    print(f"Warning: metrics data file not found")
    return {}


def get_client_demo_dashboard() -> dict[str, Any]:
    """Return agent operations data from metrics."""
    data = _load_metrics_data()
    return data.get("agentOps", {})


def get_llm_ops_dashboard() -> dict[str, Any]:
    """Return LLM operations data from metrics."""
    data = _load_metrics_data()
    return data.get("llmOps", {})


@dashboard_controller.get("/summary")
def get_dashboard_summary() -> dict[str, Any]:
    """Get cost summary from metrics data."""
    data = _load_metrics_data()
    return data.get("summary", {})


@dashboard_controller.get("/spend-trend")
def get_spend_trend() -> list[dict[str, Any]]:
    """Get cost trends from metrics data."""
    data = _load_metrics_data()
    return data.get("costTrend", [])


@dashboard_controller.get("/cost-by-category")
def get_cost_by_category() -> list[dict[str, Any]]:
    """Get cost breakdown by category from metrics data."""
    data = _load_metrics_data()
    return data.get("costByCategory", [])


@dashboard_controller.get("/top-services")
def get_top_services() -> list[dict[str, Any]]:
    """Get top services from metrics data."""
    data = _load_metrics_data()
    return data.get("topServices", [])


@dashboard_controller.get("/recommendations-widget")
def get_recommendations_widget() -> list[dict[str, Any]]:
    """Get recommendations from metrics data."""
    data = _load_metrics_data()
    return data.get("recommendations", [])


@dashboard_controller.get("/anomalies-widget")
def get_anomalies_widget() -> list[dict[str, Any]]:
    """Get anomalies from metrics data."""
    data = _load_metrics_data()
    return data.get("anomalies", [])


@dashboard_controller.get("/reports-widget")
def get_reports_widget() -> list[dict[str, Any]]:
    """Get reports from metrics data."""
    data = _load_metrics_data()
    return data.get("reports", [])


@dashboard_controller.post("/refresh")
def refresh_dashboard() -> dict[str, Any]:
    return {"message": "Dashboard data refreshed.", "timestamp": "2026-03-25T13:00:00.000Z"}


@dashboard_controller.get("/sample")
def sample_dashboard():
    """Get sample/all dashboard data from metrics."""
    data = _load_metrics_data()
    return {
        'data': data,
        'msg': "Dashboard data fetched successfully"
    }


@dashboard_controller.get("/agent-ops")
def agent_ops_dashboard() -> dict[str, Any]:
    """Return the agent operations demo payload."""
    return get_client_demo_dashboard()


@dashboard_controller.get("/llm-ops")
def llm_ops_dashboard() -> dict[str, Any]:
    """Return the LLM operations demo payload."""
    return get_llm_ops_dashboard()

