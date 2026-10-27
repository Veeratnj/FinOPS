"""
Configuration management for FinOps Multi-Agent System.
"""

import os
from typing import Optional
from pydantic import BaseModel, Field


class AgentConfig(BaseModel):
    """Global configuration settings for FinOps agents."""

    # LLM Settings
    openai_api_key: Optional[str] = Field(default_factory=lambda: os.getenv("OPENAI_API_KEY"))
    anthropic_api_key: Optional[str] = Field(default_factory=lambda: os.getenv("ANTHROPIC_API_KEY"))
    gemini_api_key: Optional[str] = Field(default_factory=lambda: os.getenv("GEMINI_API_KEY"))
    llm_model: str = Field(
        default_factory=lambda: os.getenv("FINOPS_LLM_MODEL", "gpt-4o")
    )
    llm_temperature: float = 0.1

    # Observability Provider Settings
    prometheus_url: Optional[str] = Field(
        default_factory=lambda: os.getenv("PROMETHEUS_URL", "http://localhost:9090")
    )
    grafana_url: Optional[str] = Field(
        default_factory=lambda: os.getenv("GRAFANA_URL", "http://localhost:3000")
    )
    datadog_api_key: Optional[str] = Field(
        default_factory=lambda: os.getenv("DATADOG_API_KEY")
    )

    # Slack Notifications
    slack_bot_token: Optional[str] = Field(
        default_factory=lambda: os.getenv("SLACK_BOT_TOKEN")
    )
    slack_channel: str = Field(
        default_factory=lambda: os.getenv("SLACK_CHANNEL", "#finops-alerts")
    )
    slack_webhook_url: Optional[str] = Field(
        default_factory=lambda: os.getenv("SLACK_WEBHOOK_URL")
    )

    # Safety Guardrails
    dry_run_default: bool = Field(
        default_factory=lambda: os.getenv("FINOPS_DRY_RUN", "true").lower() in ("true", "1", "yes")
    )
    max_resources_per_batch: int = 10
    max_monthly_spend_delta_usd: float = 50000.0
    protected_resource_patterns: list[str] = Field(
        default_factory=lambda: [
            r".*prod.*db.*",
            r".*rds.*primary.*",
            r".*vault.*",
            r".*vpc.*",
            r".*production-k8s-control-plane.*",
        ]
    )

    # Database integration
    postgres_dsn: Optional[str] = Field(
        default_factory=lambda: os.getenv("DATABASE_URL")
    )


# Default singleton instance
config = AgentConfig()
