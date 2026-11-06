"""
Canonical seed dataset for Token-OPS (/api/token-ops).
Matches the exact contract consumed by App/src/pages/TokenOPS.tsx.
"""

from __future__ import annotations

import copy
from typing import Any

DEFAULT_TOKEN_OPS_DATA: dict[str, Any] = {
    "summaryCards": [
        {"label": "Total Tokens", "value": "16.4M", "delta": "+12%", "icon": "Sparkles"},
        {"label": "Prompt Tokens", "value": "9.8M", "delta": "+9%", "icon": "Lightbulb"},
        {"label": "Completion Tokens", "value": "4.6M", "delta": "+14%", "icon": "Layers"},
        {"label": "Cached Tokens", "value": "1.2M", "delta": "+19%", "icon": "Database"},
        {"label": "Embedding Tokens", "value": "820K", "delta": "+7%", "icon": "Cpu"},
        {"label": "Total Cost", "value": "$17.7K", "delta": "+8%", "icon": "TrendingUp"},
        {"label": "Avg Tokens / Request", "value": "1.4K", "delta": "-2%", "icon": "Users"},
        {"label": "Estimated Savings", "value": "$3.1K", "delta": "+22%", "icon": "Sparkles"},
    ],
    "usageTrend": [
        {"period": "Oct 30", "prompt": 1400, "completion": 620, "total": 2020},
        {"period": "Oct 31", "prompt": 1620, "completion": 740, "total": 2360},
        {"period": "Nov 1", "prompt": 1510, "completion": 680, "total": 2190},
        {"period": "Nov 2", "prompt": 1790, "completion": 810, "total": 2600},
        {"period": "Nov 3", "prompt": 1680, "completion": 760, "total": 2440},
        {"period": "Nov 4", "prompt": 1860, "completion": 910, "total": 2770},
        {"period": "Nov 5", "prompt": 1720, "completion": 840, "total": 2560},
    ],
    "distribution": [
        {"name": "Prompt", "value": 59, "tokens": 9800000, "cost": 9200},
        {"name": "Completion", "value": 28, "tokens": 4600000, "cost": 4200},
        {"name": "Embedding", "value": 8, "tokens": 820000, "cost": 760},
        {"name": "Cached", "value": 4, "tokens": 1200000, "cost": 180},
        {"name": "Reasoning", "value": 1, "tokens": 180000, "cost": 160},
    ],
    "providerData": [
        {
            "provider": "OpenAI",
            "requests": 82000,
            "tokens": 9100000,
            "cost": 10240.50,
            "latency": 240,
            "success": "99.2%",
            "trend": "+8%",
        },
        {
            "provider": "Anthropic",
            "requests": 36000,
            "tokens": 4200000,
            "cost": 4440.25,
            "latency": 310,
            "success": "98.7%",
            "trend": "+5%",
        },
        {
            "provider": "Google Gemini",
            "requests": 18000,
            "tokens": 1620000,
            "cost": 1680.00,
            "latency": 225,
            "success": "99.4%",
            "trend": "+10%",
        },
        {
            "provider": "Groq",
            "requests": 9000,
            "tokens": 860000,
            "cost": 720.80,
            "latency": 145,
            "success": "98.9%",
            "trend": "-2%",
        },
        {
            "provider": "Azure OpenAI",
            "requests": 7200,
            "tokens": 640000,
            "cost": 620.40,
            "latency": 290,
            "success": "99.1%",
            "trend": "+3%",
        },
    ],
    "modelComparison": [
        {
            "model": "gpt-4.1-mini",
            "requests": 36000,
            "prompt": 5200000,
            "completion": 2600000,
            "cost": 4200,
            "latency": 215,
            "quality": 91,
        },
        {
            "model": "gpt-4o",
            "requests": 22000,
            "prompt": 3200000,
            "completion": 1480000,
            "cost": 3740,
            "latency": 310,
            "quality": 95,
        },
        {
            "model": "claude-3.5-sonnet",
            "requests": 16000,
            "prompt": 2340000,
            "completion": 970000,
            "cost": 2900,
            "latency": 330,
            "quality": 96,
        },
        {
            "model": "gemini-2.5-flash",
            "requests": 18000,
            "prompt": 1740000,
            "completion": 690000,
            "cost": 1680,
            "latency": 195,
            "quality": 90,
        },
    ],
    "topConsumers": {
        "users": [
            {"name": "Nina Patel", "requests": 1820, "tokens": 290000, "cost": 310, "active": "12m ago"},
            {"name": "Alice Johnson", "requests": 1560, "tokens": 264000, "cost": 280, "active": "1h ago"},
            {"name": "Bob Smith", "requests": 1240, "tokens": 215000, "cost": 225, "active": "3h ago"},
            {"name": "Carol Williams", "requests": 940, "tokens": 148000, "cost": 155, "active": "5h ago"},
        ],
        "projects": [
            {"name": "AI FinOps Copilot", "requests": 3200, "tokens": 520000, "cost": 560, "active": "5m ago"},
            {"name": "Enterprise RAG Search", "requests": 2700, "tokens": 430000, "cost": 460, "active": "25m ago"},
            {"name": "Terraform Synthesizer", "requests": 1890, "tokens": 340000, "cost": 390, "active": "1h ago"},
        ],
        "agents": [
            {"name": "OptimizationSynthesizer", "requests": 1420, "tokens": 245000, "cost": 265, "active": "8m ago"},
            {"name": "CostCorrelatorAgent", "requests": 1180, "tokens": 190000, "cost": 210, "active": "30m ago"},
            {"name": "PromptRefiner", "requests": 980, "tokens": 170000, "cost": 170, "active": "2h ago"},
        ],
        "apiKeys": [
            {"name": "sk-prod-finops-core", "requests": 4830, "tokens": 733000, "cost": 840, "active": "2m ago"},
            {"name": "sk-prod-rag-pipeline", "requests": 3120, "tokens": 488000, "cost": 510, "active": "18m ago"},
            {"name": "sk-stg-agent-eval", "requests": 1520, "tokens": 218000, "cost": 192, "active": "4h ago"},
        ],
    },
    "promptAnalysis": [
        {"label": "Largest Prompt", "value": "14.8K tokens"},
        {"label": "Average Prompt Size", "value": "2.3K tokens"},
        {"label": "Longest Conversation", "value": "38 turns"},
        {"label": "Repeated Prompts", "value": "17%"},
        {"label": "Prompt Efficiency Score", "value": "84/100"},
    ],
    "contextStats": [
        {"label": "Current Context", "value": "9.2K"},
        {"label": "Maximum Context", "value": "16K"},
        {"label": "Remaining Context", "value": "6.8K"},
        {"label": "Usage %", "value": "58%"},
    ],
    "cacheStats": [
        {"label": "Cache Hit Rate", "value": "72%"},
        {"label": "Cache Miss", "value": "28%"},
        {"label": "Tokens Saved", "value": "1.2M"},
        {"label": "Money Saved", "value": "$1,840"},
    ],
    "recommendations": [
        {"title": "Route classification prompts from GPT-4o to GPT-4.1-mini", "savings": "63%", "priority": "High"},
        {"title": "Enable Anthropic & OpenAI prefix prompt caching on system instructions", "savings": "42%", "priority": "High"},
        {"title": "Compress retrieved RAG chunks with semantic reranking", "savings": "35%", "priority": "Medium"},
        {"title": "Summarize multi-turn agent history beyond 10 turns", "savings": "28%", "priority": "Medium"},
        {"title": "Strip duplicate JSON schema descriptions in tool definitions", "savings": "18%", "priority": "Medium"},
        {"title": "Cap max_completion_tokens on structured extraction endpoints", "savings": "16%", "priority": "Low"},
    ],
    "forecastData": [
        {"date": "Tomorrow", "tokens": 241000, "cost": 240},
        {"date": "Next Week", "tokens": 1640000, "cost": 1620},
        {"date": "Next Month", "tokens": 7400000, "cost": 7200},
        {"date": "Quarter", "tokens": 22800000, "cost": 22200},
    ],
    "anomalyCards": [
        {"title": "Abnormal Token Spike on gpt-4o (+320%)", "severity": "Critical"},
        {"title": "Oversized RAG Context (>14K tokens)", "severity": "High"},
        {"title": "Recursive Tool-Call Retry Loop", "severity": "Medium"},
        {"title": "Prompt Injection Guardrail Triggered", "severity": "High"},
        {"title": "Uncached Identical System Prompts", "severity": "Low"},
        {"title": "Hourly Spend Threshold Exceeded", "severity": "Critical"},
    ],
    "alerts": [
        {"rule": "Daily Tokens > 2 Million", "channel": "Email"},
        {"rule": "Monthly Cost > $15,000", "channel": "Slack"},
        {"rule": "Context Usage > 90%", "channel": "Webhook"},
        {"rule": "Prompt > 15K Tokens", "channel": "Teams"},
        {"rule": "Cache Hit < 40%", "channel": "Slack"},
    ],
    "costBreakdown": [
        {"category": "Provider", "value": 41},
        {"category": "Department", "value": 23},
        {"category": "Project", "value": 17},
        {"category": "Model", "value": 12},
        {"category": "User", "value": 10},
        {"category": "Agent", "value": 9},
    ],
    "ragAnalysis": [
        {"label": "Embedding Tokens", "value": "820K"},
        {"label": "Retrieved Chunks", "value": "1.9K"},
        {"label": "Average Chunk Size", "value": "320 tokens"},
        {"label": "Knowledge Hits", "value": "88%"},
        {"label": "Context Compression", "value": "64%"},
    ],
    "apiUsage": [
        {
            "key": "sk-prod-finops-core",
            "requests": 4830,
            "tokens": 733000,
            "cost": 840,
            "errors": 2,
            "rateLimit": "95%",
            "latency": 215,
        },
        {
            "key": "sk-prod-rag-pipeline",
            "requests": 3120,
            "tokens": 488000,
            "cost": 510,
            "errors": 1,
            "rateLimit": "98%",
            "latency": 240,
        },
        {
            "key": "sk-stg-agent-eval",
            "requests": 1520,
            "tokens": 218000,
            "cost": 192,
            "errors": 0,
            "rateLimit": "100%",
            "latency": 260,
        },
    ],
}


def get_default_token_ops_payload() -> dict[str, Any]:
    """Returns a deep copy of the canonical Token-OPS seed payload."""
    return copy.deepcopy(DEFAULT_TOKEN_OPS_DATA)

