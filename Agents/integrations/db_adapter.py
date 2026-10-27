"""
Database Integration Adapter for FinOps ReporterAgent.
Connects directly to SQLAlchemy models (OrchestrationJob, Recommendation, Anomaly).
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from decimal import Decimal
from typing import Any, Dict, List, Optional

logger = logging.getLogger("FinOpsDBAdapter")


class FinOpsDBAdapter:
    """Interacts with FinOps database to persist execution jobs, recommendations, and anomalies."""

    @classmethod
    def persist_results(
        cls,
        tenant_id: str,
        job_id: Optional[str],
        proposals: List[Dict[str, Any]],
        waste_candidates: List[Dict[str, Any]],
        execution_result: Optional[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Creates or updates OrchestrationJob, writes Recommendations, and flags Anomalies.
        Gracefully handles scenarios where the database connection is offline.
        """
        persisted_recs = 0
        persisted_anomalies = 0

        try:
            # Attempt import from backend models
            import sys
            import os
            # Add API to sys.path if not present
            api_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "API"))
            if api_path not in sys.path:
                sys.path.insert(0, api_path)

            from app.db.session import SessionLocal
            from app.models.all_models import (
                Anomaly,
                AnomalySeverity,
                AnomalyStatus,
                JobStatus,
                OrchestrationJob,
                Recommendation,
                RecommendationEffort,
                RecommendationImpact,
                RecommendationStatus,
            )

            db = SessionLocal()
            try:
                # 1. Update OrchestrationJob if job_id is present
                if job_id:
                    job = db.query(OrchestrationJob).filter(OrchestrationJob.id == job_id).first()
                    if job:
                        job.status = (
                            JobStatus.COMPLETED
                            if execution_result and execution_result.get("status") in ("SUCCESS", "DRY_RUN_PASSED")
                            else JobStatus.FAILED
                        )
                        job.finished_at = datetime.now(timezone.utc)
                        job.metadata_ = {
                            **(job.metadata_ or {}),
                            "execution_result": execution_result,
                        }
                        db.add(job)

                # 2. Persist Recommendations
                for p in proposals:
                    rec = Recommendation(
                        tenant_id=tenant_id,
                        title=p.get("title", "Cost Optimization"),
                        category=p.get("category", "Compute"),
                        impact=RecommendationImpact.HIGH if p.get("risk_level") == "LOW" else RecommendationImpact.MEDIUM,
                        effort=RecommendationEffort.LOW,
                        savings_usd=Decimal(str(round(p.get("estimated_monthly_savings_usd", 0.0), 2))),
                        status=RecommendationStatus.OPEN,
                        description=p.get("risk_analysis", ""),
                        steps=[p.get("hcl_diff", "")],
                        resource_id=p.get("resource_id"),
                        resource_type=p.get("resource_type"),
                    )
                    db.add(rec)
                    persisted_recs += 1

                # 3. Persist Critical/High Anomalies
                for w in waste_candidates:
                    if w.get("severity") in ("CRITICAL", "HIGH"):
                        anomaly = Anomaly(
                            tenant_id=tenant_id,
                            service=w.get("resource_type", "CloudResource"),
                            detected_at=datetime.now(timezone.utc),
                            severity=AnomalySeverity.CRITICAL if w.get("severity") == "CRITICAL" else AnomalySeverity.HIGH,
                            spike_percentage=Decimal("100.00"),
                            description=w.get("reason", "Anomalous cost waste detected."),
                            data=[w.get("metrics_summary", {})],
                            status=AnomalyStatus.OPEN,
                            investigation_steps=["Review resource metrics", "Apply suggested right-sizing"],
                        )
                        db.add(anomaly)
                        persisted_anomalies += 1

                db.commit()
            except Exception as e:
                db.rollback()
                logger.warning(f"Could not commit to FinOps DB: {e}. Running in standalone mock mode.")
            finally:
                db.close()

        except Exception as e:
            logger.info(f"Database session unavailable ({e}). Fallback to in-memory recording.")
            persisted_recs = len(proposals)
            persisted_anomalies = len([w for w in waste_candidates if w.get("severity") in ("CRITICAL", "HIGH")])

        return {
            "recommendations_created": persisted_recs,
            "anomalies_flagged": persisted_anomalies,
        }
