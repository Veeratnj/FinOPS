"""Forecasting controller."""

from typing import Any

from fastapi import APIRouter, Body

forecasting_controller = APIRouter(prefix="/forecasting", tags=["Forecasting"])


@forecasting_controller.get("/forecast")
def get_forecast() -> dict[str, Any]:
    return {
        "base": [{"month": "Apr 2026", "spend": 292000, "lower": 285000, "upper": 299000}],
        "optimistic": [{"month": "Apr 2026", "spend": 278000}],
        "pessimistic": [{"month": "Apr 2026", "spend": 308000}],
    }


@forecasting_controller.get("/forecast/{scenario}")
def get_forecast_by_scenario(scenario: str) -> list[dict[str, Any]]:
    return [{"month": "Apr 2026", "spend": 292000, "lower": 285000, "upper": 299000}]


@forecasting_controller.post("/what-if")
def what_if_forecast(payload: dict[str, Any] = Body(...)) -> dict[str, Any]:
    return {"scenario": "custom", "projectedSpend": 295000, "savings": 15000}


@forecasting_controller.get("/drivers")
def get_forecast_drivers() -> list[dict[str, Any]]:
    return [{"service": "GKE Clusters", "impact": 8200, "direction": "up", "reason": "New ML workloads"}]


@forecasting_controller.put("/drivers/{driver_id}/update")
def update_forecast_driver(driver_id: str, payload: dict[str, Any] = Body(...)) -> dict[str, Any]:
    return {"id": driver_id, "message": "Driver updated."}


@forecasting_controller.get("/accuracy")
def get_forecast_accuracy() -> dict[str, Any]:
    return {"mape": 4.2, "rmse": 8900, "lastEvaluated": "2026-03-01"}


@forecasting_controller.get("/historical-accuracy")
def get_historical_accuracy() -> list[dict[str, Any]]:
    return [{"month": "Oct 2025", "spend": 262700}, {"month": "Mar 2026", "spend": 284750}]


@forecasting_controller.get("/sample")
def sample_forecasting():
    return {
        'data': [],
        'msg': "Forecasting data fetched successfully"
    }

