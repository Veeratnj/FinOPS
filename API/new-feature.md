
{
  "summary": {
    "requests": 15821,
    "tokens": 12849321,
    "cost": 324.62,
    "successRate": 99.2,
    "avgLatency": 934
  },
  "providers": [
    {
      "name": "OpenAI",
      "requests": 8421,
      "cost": 182.4,
      "latency": 840
    },
    {
      "name": "Anthropic",
      "requests": 3211,
      "cost": 64.2,
      "latency": 910
    },
    {
      "name": "Gemini",
      "requests": 4189,
      "cost": 78.0,
      "latency": 720
    }
  ],
  "modelUsage": [
    {
      "model": "gpt-5",
      "requests": 6421,
      "tokens": 5234121,
      "cost": 148.3
    },
    {
      "model": "claude-sonnet",
      "requests": 4123,
      "tokens": 3421122,
      "cost": 94.6
    }
  ],
  "router": {
    "fallbacks": 32,
    "cacheHitRate": 47,
    "failover": 4
  },
  "safety": {
    "blocked": 82,
    "moderated": 71,
    "policyViolations": 11
  }
}

Build a modern enterprise React dashboard (TypeScript) .

Theme:
- Dark mode by default
- Glassmorphism cards with subtle blur
- Purple/Blue gradient accents
- Responsive layout
- Professional AI Operations look similar to Datadog, Grafana, LangSmith, Azure AI Foundry, and Vercel dashboards

Layout:
- Left collapsible sidebar
- Top navigation bar
- Main content area

Dashboard sections:
1. KPI cards (6 cards)
   - Total Requests
   - Active Agents
   - Total Cost
   - Avg Latency
   - Success Rate
   - Token Usage

2. Cost trend line chart

3. Provider usage donut chart

4. Recent execution table

5. Tool Registry status cards

6. Guardrails summary cards

7. RAG statistics cards

8. Quick Action buttons

Requirements:
- Functional React components
- TypeScript
- Recharts for charts
- Lucide React icons
- React Query ready (mock API)
- Axios service layer
- Use mock JSON data
- Loading skeletons
- Empty states
- Responsive grid
- Modern animations using Framer Motion
- Clean enterprise UI with rounded corners and soft shadows











