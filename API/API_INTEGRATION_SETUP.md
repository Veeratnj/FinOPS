# API Integration Setup Guide

This guide explains how the frontend and backend are integrated to serve metrics/analytics data via API endpoints instead of static files.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│ CTRLS-BUI (Frontend - React/TypeScript)                     │
├─────────────────────────────────────────────────────────────┤
│ src/hooks/useFinOpsData.ts                                  │
│   └─> Calls: http://localhost:8000/metrics/all              │
│   └─> Fallback: /fakedata.json (if API unavailable)         │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP Request
                       │ GET /metrics/all
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ CTRLS-API (Backend - FastAPI/Python)                        │
├─────────────────────────────────────────────────────────────┤
│ app/controller/metrics.py                                   │
│   └─> Endpoints: /metrics/summary, /metrics/cost-trend, etc │
│   └─> Data source: fakedata.json (cached in memory)         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Loads once at startup
                       ▼
            public/fakedata.json
            (Shared test data)
```

## Components

### Backend: `/app/controller/metrics.py`
Professional metrics controller that serves data via `/metrics/*` endpoints.

**Key Features:**
- Endpoints are at `/metrics/` prefix (not `/fakedata/`)
- Caches data in memory for performance
- Loads from `fakedata.json` in Ctrls-BUI/public
- Returns data in JSON format

### Frontend: `src/hooks/useFinOpsData.ts`
React hook that fetches metrics from the API.

**Key Features:**
- Configurable API base URL via `VITE_API_BASE_URL` env var
- Automatic fallback to `/fakedata.json` if API is unavailable
- Error handling and loading states
- Works in development and production

## Environment Configuration

### Frontend (.env in Ctrls-BUI)

```bash
# For local development (API on same machine)
VITE_API_BASE_URL=http://localhost:8000

# For production
VITE_API_BASE_URL=https://api.yourdomain.com

# For Docker/remote API
VITE_API_BASE_URL=http://api-service:8000
```

### Backend (.env in Ctrls-API)
No special configuration needed. The API automatically finds `fakedata.json` from the Ctrls-BUI project.

## Available Endpoints

All endpoints are prefixed with `/metrics/`

| Endpoint | Purpose |
|----------|---------|
| `GET /metrics/all` | Get all metrics data |
| `GET /metrics/summary` | Cost summary |
| `GET /metrics/cost-by-category` | Cost breakdown |
| `GET /metrics/cost-trend` | Monthly trends |
| `GET /metrics/top-services` | Top services |
| `GET /metrics/recommendations` | Recommendations |
| `GET /metrics/anomalies` | Anomalies |
| `GET /metrics/kubernetes` | K8s data |
| `GET /metrics/teams` | Team allocations |
| `GET /metrics/agent-ops` | Agent metrics |
| `GET /metrics/llm-ops` | LLM metrics |
| + 12 more endpoints | See METRICS_API.md |

## Setup Instructions

### Step 1: Start the Backend

```bash
cd D:\workspace\ctrls\Ctrls-API
python -m uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### Step 2: Configure Frontend Environment

In Ctrls-BUI, ensure `.env` has:
```bash
VITE_API_BASE_URL=http://localhost:8000
```

### Step 3: Start the Frontend

```bash
cd D:\workspace\ctrls\Ctrls-BUI
npm run dev  # or bun run dev
```

### Step 4: Test the Integration

Open your browser console and:

```javascript
// Test if API is responding
fetch('http://localhost:8000/metrics/summary')
  .then(r => r.json())
  .then(data => console.log('API Response:', data));
```

Or check Network tab in DevTools:
- Should see `GET http://localhost:8000/metrics/all` 
- Should NOT see `/fakedata.json` anymore

## Development vs Production

### Development (Local)
- Both services run locally on different ports
- Frontend configured to call `http://localhost:8000`
- Fallback to static file if API unavailable

### Production (Docker)
```bash
# In docker-compose.yml
services:
  api:
    build: ./Ctrls-API
    ports:
      - "8000:8000"
    
  frontend:
    build: ./Ctrls-BUI
    environment:
      - VITE_API_BASE_URL=http://api:8000  # Internal Docker network

# Or with CORS and external URL
frontend:
  environment:
    - VITE_API_BASE_URL=https://api.example.com
```

## CORS Configuration

If frontend and backend are on different domains, ensure CORS is enabled in the API.

Currently, `app/main.py` has CORS enabled for all origins:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

For production, restrict to specific domains:
```python
allow_origins=[
    "https://yourdomain.com",
    "https://www.yourdomain.com",
]
```

## Data Flow

### User clicks on a chart/table:

```
1. LLMOps.tsx / AgentOps.tsx component renders
2. useFinOpsData() hook is called
3. Hook fetches from: ${API_BASE_URL}/metrics/all
4. API loads fakedata.json from memory cache
5. Returns JSON response to frontend
6. Component displays data
```

### Network Tab shows:

**Before (Static File):**
```
GET /fakedata.json        200 OK
```

**After (API):**
```
GET http://localhost:8000/metrics/all        200 OK
```

## Troubleshooting

### "Failed to fetch data"
1. Ensure API server is running: `python -m uvicorn app.main:app --reload`
2. Check if port 8000 is available
3. Check browser console for CORS errors
4. Try accessing `http://localhost:8000/docs` directly

### "API unavailable, attempting fallback..."
1. This is normal - it means API isn't running but fallback to static file worked
2. To use API, start the backend server

### "fakedata.json not found"
1. Ensure `Ctrls-BUI/public/fakedata.json` exists
2. Check file path in `metrics.py` controller

### Frontend shows old data
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check that `VITE_API_BASE_URL` is configured correctly

## Performance Tips

1. **Data Caching:** API caches data in memory - very fast responses
2. **Selective Loading:** Use specific endpoints (e.g., `/metrics/summary`) instead of `/all` when you only need partial data
3. **Error Handling:** Fallback to static file ensures app works even if API unavailable

## Demo Mode

When demoing to clients:
- They see API calls in Network tab (professional)
- No mention of "fakedata" anywhere (clean)
- Can easily swap fakedata.json with real data later
- Demonstrates proper architecture

## Future: Switch to Real Data

When ready to use real data:

1. **Replace data source in `metrics.py`:**
   ```python
   # Instead of loading fakedata.json
   def _load_metrics_data() -> dict[str, Any]:
       # Query real database
       summary = db.query(CostSummary).all()
       trends = db.query(CostTrend).all()
       return {
           "summary": summary,
           "costTrend": trends,
           # ... etc
       }
   ```

2. **Frontend code remains unchanged** - it just calls the same endpoints

3. **No frontend changes needed** ✨

## Summary

✅ Professional API architecture
✅ Frontend calls `/metrics/*` endpoints (not static files)
✅ Easy to demo and show proper implementation
✅ Configurable via environment variables
✅ Fallback to static files for resilience
✅ Ready for real data when needed
