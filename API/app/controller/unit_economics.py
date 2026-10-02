"""Unit economics controller."""

from typing import Any

from fastapi import APIRouter

unit_economics_controller = APIRouter(prefix="/unit-economics", tags=["Unit Economics"])


@unit_economics_controller.get("/summary")
def get_unit_economics_summary() -> dict[str, Any]:
    return {"month": "Mar 2026", "costPerUser": 2.78, "costPerTransaction": 0.0040, "revenue": 1260000, "margin": 71.8}


@unit_economics_controller.get("/cost-per-user")
def get_cost_per_user() -> list[dict[str, Any]]:
    return [{"month": "Apr 2025", "value": 2.45}, {"month": "Mar 2026", "value": 2.78}]


@unit_economics_controller.get("/cost-per-transaction")
def get_cost_per_transaction() -> list[dict[str, Any]]:
    return [{"month": "Apr 2025", "value": 0.0032}, {"month": "Mar 2026", "value": 0.0040}]


@unit_economics_controller.get("/gross-margin")
def get_gross_margin() -> list[dict[str, Any]]:
    return [{"month": "Apr 2025", "margin": 74.2, "revenue": 890000}]


@unit_economics_controller.get("/benchmark")
def get_benchmark() -> dict[str, Any]:
    return {"industry": {"costPerUser": 3.10, "grossMargin": 72.0}, "yours": {"costPerUser": 2.78, "grossMargin": 71.8}}


@unit_economics_controller.get("/trends")
def get_unit_economics_trends() -> list[dict[str, Any]]:
    return [{
  "month": "Apr 2025",
  "costPerUser": 2.45,
  "costPerTransaction": 0.0032,
  "revenue": 890000,
  "margin": 74.2
}]


@unit_economics_controller.get("/sample")
def sample_unit_economics():
    return {
        'data': [],
        'msg': "Unit economics data fetched successfully"
    }

