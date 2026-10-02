"""
Metrics repository for ingested samples and inference events.
"""

from sqlalchemy.orm import Session

from app.models import MetricSample, InferenceRequest


class MetricRepository:
    """Metric repository."""

    def create_samples(self, db: Session, samples: list[MetricSample]) -> list[MetricSample]:
        db.add_all(samples)
        db.commit()
        for sample in samples:
            db.refresh(sample)
        return samples

    def create_inference_requests(
        self, db: Session, requests: list[InferenceRequest]
    ) -> list[InferenceRequest]:
        db.add_all(requests)
        db.commit()
        for request in requests:
            db.refresh(request)
        return requests


metric_repo = MetricRepository()
