from app.controller.dashboard import get_client_demo_dashboard, get_llm_ops_dashboard


def test_client_demo_payload_has_expected_sections():
    payload = get_client_demo_dashboard()

    assert payload["summary"]["requests"] == 15821
    assert payload["summary"]["cost"] == 324.62
    assert payload["kpis"][0]["label"] == "Total Requests"
    assert payload["providerUsage"][0]["name"] == "OpenAI"
    assert payload["recentExecutions"][0]["id"] == "exec-1042"
    assert payload["quickActions"][0]["title"] == "Run cost scan"


def test_llm_ops_payload_has_expected_sections():
    payload = get_llm_ops_dashboard()

    assert payload["summary"]["requests"] == 12480
    assert payload["summary"]["cost"] == 218.9
    assert payload["kpis"][0]["label"] == "Prompt Volume"
    assert payload["providerUsage"][0]["name"] == "Azure OpenAI"
    assert payload["recentExecutions"][0]["id"] == "llm-2001"
    assert payload["quickActions"][0]["title"] == "Review prompt pack"
