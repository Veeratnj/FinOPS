"""Recommendations controller."""

from typing import Any

from fastapi import APIRouter, Body

recommendations_controller = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@recommendations_controller.get("")
def get_recommendations() -> list[dict[str, Any]]:
    return [
        {"id": "rec-1", "title": "Right-size EC2 instances in us-east-1", "category": "Compute", "impact": "High", "effort": "Low", "savings": 18500, "status": "open", "steps": ["Identify underutilized instances", "Migrate to smaller types"]},
    ]


@recommendations_controller.get("/{recommendation_id}")
def get_recommendation(recommendation_id: str) -> dict[str, Any]:
    return {"id": recommendation_id, "title": "Right-size EC2 instances in us-east-1", "category": "Compute", "impact": "High", "effort": "Low", "savings": 18500, "status": "open", "steps": ["Identify underutilized instances", "Migrate to smaller types"]}


@recommendations_controller.get("/filter")
def filter_recommendations(category: str | None = None, impact: str | None = None) -> list[dict[str, Any]]:
    return [
        {"id": "rec-1", "title": "Right-size EC2 instances in us-east-1", "category": category or "Compute", "impact": impact or "High", "effort": "Low", "savings": 18500, "status": "open"}
    ]


@recommendations_controller.get("/category/{category}")
def get_recommendations_by_category(category: str) -> list[dict[str, Any]]:
    return [{"id": "rec-1", "title": "Right-size EC2 instances in us-east-1", "category": category, "impact": "High", "effort": "Low", "savings": 18500, "status": "open"}]


@recommendations_controller.put("/{recommendation_id}/status")
def update_recommendation_status(recommendation_id: str, payload: dict[str, Any] = Body(...)) -> dict[str, Any]:
    return {"id": recommendation_id, "status": payload.get("status", "in_progress")}


@recommendations_controller.post("/{recommendation_id}/apply")
def apply_recommendation(recommendation_id: str) -> dict[str, Any]:
    return {"message": "Recommendation applied successfully.", "steps": ["Step 1", "Step 2"]}


@recommendations_controller.get("/{recommendation_id}/impact")
def get_recommendation_impact(recommendation_id: str) -> dict[str, Any]:
    return {"id": recommendation_id, "savings": 18500, "impact": "High", "effort": "Low"}


@recommendations_controller.post("/{recommendation_id}/dismiss")
def dismiss_recommendation(recommendation_id: str) -> dict[str, Any]:
    return {"message": "Recommendation dismissed."}


@recommendations_controller.get("/savings-summary")
def get_savings_summary() -> dict[str, Any]:
    return {"totalSavings": 49200, "open": 4, "inProgress": 1, "done": 1}


@recommendations_controller.get("/sample")
def sample_recommendations():
    return {
        'data': [],
        'msg': "Recommendations fetched successfully"
    }

