"""
Slack Notification Dispatcher for FinOps ReporterAgent.
Supports both Slack Webhooks and the Official Slack SDK.
"""

from __future__ import annotations

import json
from typing import Any, Dict, List
import httpx
from Agents.config import config


class SlackNotifier:
    """Dispatches executive FinOps alerts and summaries to Slack."""

    @classmethod
    def send_finops_summary(
        cls,
        tenant_id: str,
        total_savings_usd: float,
        proposals_count: int,
        execution_status: str,
        details: List[Dict[str, Any]],
    ) -> bool:
        """Sends rich formatted Slack message."""
        webhook_url = config.slack_webhook_url
        if not webhook_url:
            # Fallback to mock logging if no webhook configured
            return False

        blocks = [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "🧭 FinOps Autonomous Agent — Execution Report",
                    "emoji": True,
                },
            },
            {
                "type": "section",
                "fields": [
                    {"type": "mrkdwn", "text": f"*Tenant:* `{tenant_id}`"},
                    {"type": "mrkdwn", "text": f"*Status:* `{execution_status}`"},
                    {"type": "mrkdwn", "text": f"*Total Savings:* `${total_savings_usd:,.2f}/mo`"},
                    {"type": "mrkdwn", "text": f"*Optimizations:* `{proposals_count}`"},
                ],
            },
            {"type": "divider"},
        ]

        # Add brief proposal highlights
        for item in details[:5]:
            blocks.append({
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"• *{item.get('title')}*\n  _{item.get('action')}_ on `{item.get('resource_id')}` (Savings: *${item.get('estimated_monthly_savings_usd', 0):,.2f}/mo*)",
                },
            })

        payload = {"blocks": blocks}
        try:
            with httpx.Client(timeout=5.0) as client:
                res = client.post(webhook_url, json=payload)
                return res.status_code == 200
        except Exception:
            return False
