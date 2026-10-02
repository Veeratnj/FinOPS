# Frontend Data Flow Analysis

## Summary
⚠️ **MIXED IMPLEMENTATION** - Some pages use API, others use hardcoded data

---

## Page-by-Page Analysis

### ✅ Dashboard.tsx - GOOD (Uses API)
```typescript
const { data, loading } = useFinOpsData();
```
- **Data Source:** `/metrics/all` (via useFinOpsData hook)
- **Data Type:** Full fakedata.json via API
- **Status:** ✅ CORRECT - Gets data from backend API
- **Components:**
  - Cost summary
  - Cost trends
  - Cost by category
  - Top 5 services

---

### ❌ LLMOps.tsx - HARDCODED (Problem!)
```typescript
const API_URL = "http://localhost:8000/dashboard/llm-ops";
```
- **Data Source:** `/dashboard/llm-ops` endpoint
- **What the endpoint returns:** **HARDCODED DATA** (not from fakedata.json)
- **Status:** ❌ PROBLEM - Returns static hardcoded values
- **Hardcoded Data Example:**
  ```typescript
  "summary": {
      "requests": 12480,
      "tokens": 9875421,
      "cost": 218.9,          // ← HARDCODED
      "successRate": 98.7,    // ← HARDCODED
      "avgLatency": 812,      // ← HARDCODED
  }
  ```
- **Problem:** Different hardcoded values than LLM ops section in fakedata.json

---

### ❌ AgentOps.tsx - HARDCODED (Problem!)
```typescript
const API_URL = "http://localhost:8000/dashboard/agent-ops";
```
- **Data Source:** `/dashboard/agent-ops` endpoint
- **What the endpoint returns:** **HARDCODED DATA** (not from fakedata.json)
- **Status:** ❌ PROBLEM - Returns static hardcoded values
- **Hardcoded Data Example:**
  ```typescript
  "summary": {
      "requests": 15821,
      "tokens": 12849321,
      "cost": 324.62,          // ← HARDCODED
      "successRate": 99.2,     // ← HARDCODED
      "avgLatency": 934,       // ← HARDCODED
  }
  ```
- **Problem:** Different hardcoded values than agent ops section in fakedata.json

---

## All Other Pages (23 Total)

Let me check a few more:

| Page | API/Hardcoded | Data Source |
|------|---------------|-------------|
| Dashboard.tsx | ✅ API | `/metrics/all` |
| LLMOps.tsx | ❌ Hardcoded | `/dashboard/llm-ops` |
| AgentOps.tsx | ❌ Hardcoded | `/dashboard/agent-ops` |
| VirtualTags.tsx | ❓ TBD | Need to check |
| Kubernetes.tsx | ❓ TBD | Need to check |
| Anomalies.tsx | ❓ TBD | Need to check |
| ... | ... | ... |

---

## The Core Problem

### Dashboard Controller (app/controller/dashboard.py)

The `/dashboard/llm-ops` and `/dashboard/agent-ops` endpoints return **HARDCODED DATA**:

```python
@dashboard_controller.get("/llm-ops")
def llm_ops_dashboard() -> dict[str, Any]:
    """Return the LLM operations demo payload."""
    return get_llm_ops_dashboard()  # ← Returns HARDCODED dict
```

This `get_llm_ops_dashboard()` function has:
```python
def get_llm_ops_dashboard() -> dict[str, Any]:
    return {
        "summary": {
            "requests": 12480,           # ← HARDCODED
            "tokens": 9875421,           # ← HARDCODED
            "cost": 218.9,               # ← HARDCODED
            "successRate": 98.7,         # ← HARDCODED
            "avgLatency": 812,           # ← HARDCODED
        },
        # ... more hardcoded data
    }
```

---

## Data Source Comparison

### What Dashboard.tsx Should Show (from fakedata.json)
```json
{
  "llmOps": {
    "summary": {
      "requests": 89250,      // ← Actual fakedata value
      "tokens": 18750000,
      "cost": 3180.75,
      "successRate": 99.1,
      "avgLatency": 210
    }
  }
}
```

### What LLMOps.tsx Actually Shows (from dashboard.py)
```python
{
    "requests": 12480,        // ← DIFFERENT hardcoded value
    "tokens": 9875421,
    "cost": 218.9,
    "successRate": 98.7,
    "avgLatency": 812,
}
```

**Result:** LLMOps page shows completely different (wrong) data!

---

## Summary of Issues

| Issue | Location | Severity | Impact |
|-------|----------|----------|--------|
| **Hardcoded llm-ops data** | `/dashboard/llm-ops` endpoint | 🔴 Critical | LLMOps page shows wrong data |
| **Hardcoded agent-ops data** | `/dashboard/agent-ops` endpoint | 🔴 Critical | AgentOps page shows wrong data |
| **Data mismatch** | Frontend vs Backend | 🔴 Critical | Inconsistent metrics across app |
| **Not using metrics API** | LLMOps & AgentOps | 🟡 Medium | Doesn't use new professional API |

---

## Solution

### Option 1: Update Dashboard Controller (RECOMMENDED)
Update `/dashboard/llm-ops` and `/dashboard/agent-ops` to use metrics data:

```python
# OLD - Hardcoded
@dashboard_controller.get("/llm-ops")
def llm_ops_dashboard() -> dict[str, Any]:
    return get_llm_ops_dashboard()  # Returns hardcoded data

# NEW - Use Metrics API
@dashboard_controller.get("/llm-ops")
def llm_ops_dashboard() -> dict[str, Any]:
    # Load from metrics/fakedata
    import json
    from pathlib import Path
    path = Path(__file__).parent.parent.parent / "Ctrls-BUI" / "public" / "fakedata.json"
    with open(path) as f:
        data = json.load(f)
    return data.get("llmOps", {})
```

### Option 2: Update Frontend Pages
Update LLMOps.tsx and AgentOps.tsx to call metrics API directly:

```typescript
// OLD
const API_URL = "http://localhost:8000/dashboard/llm-ops";

// NEW
const API_URL = "http://localhost:8000/metrics/llm-ops";
```

### Option 3: Create Shared Hooks
Create hooks similar to `useFinOpsData`:

```typescript
export function useLLMOpsData() {
  return useMetrics('/llm-ops');
}

export function useAgentOpsData() {
  return useMetrics('/agent-ops');
}
```

---

## Recommendation

**Option 1 is BEST** because:
1. ✅ Single source of truth (fakedata.json)
2. ✅ Frontend doesn't need changes
3. ✅ Easy to switch to real DB later
4. ✅ Consistent data across all pages
5. ✅ Professional API architecture

---

## Action Items

### Immediate (Fix the problem)
- [ ] Update dashboard.py endpoints to use metrics data
- [ ] Verify LLMOps and AgentOps show correct values from fakedata.json
- [ ] Check all 23 pages for hardcoded data

### Planned (Improve architecture)
- [ ] Consolidate all data loading to use metrics API
- [ ] Create reusable hooks for each data section
- [ ] Update documentation

---

## Files to Check/Update

```
❌ NEED UPDATE:
   app/controller/dashboard.py
      └─ /dashboard/llm-ops endpoint (has hardcoded data)
      └─ /dashboard/agent-ops endpoint (has hardcoded data)

✅ OK:
   src/hooks/useFinOpsData.ts (uses metrics API)
   src/pages/Dashboard.tsx (uses the hook)

❓ NEED TO CHECK:
   src/pages/VirtualTags.tsx
   src/pages/TokenOPS.tsx
   src/pages/UnitEconomics.tsx
   src/pages/Reports.tsx
   ... (18 more pages)
```

---

## Current State

```
Frontend Architecture:
├── Dashboard.tsx         ✅ API (metrics/all)
├── LLMOps.tsx           ❌ Hardcoded (dashboard/llm-ops)
├── AgentOps.tsx         ❌ Hardcoded (dashboard/agent-ops)
└── 20 other pages       ❓ Unknown (need to check)

Backend Data Sources:
├── metrics.py           ✅ Loads from fakedata.json (23 endpoints)
├── dashboard.py         ❌ Hardcoded values (6+ endpoints)
└── other controllers    ❓ Various patterns
```

---

## Next Steps

1. **Decide:** Use Option 1, 2, or 3?
2. **Update:** Fix dashboard.py or frontend based on decision
3. **Verify:** Check all 23 pages for data consistency
4. **Test:** Confirm all pages show same data from fakedata.json
5. **Document:** Update architecture docs with findings
