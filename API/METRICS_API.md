# Metrics API Endpoints

This document describes all available Metrics API endpoints for the Ctrls-API application.

## Base URL
```
http://localhost:8000/metrics
```

## Available Endpoints

### 1. **Get All Data**
Returns the complete fakedata JSON object.

```
GET /metrics/all
```

**Response:** Returns entire fakedata object with all sections.

---

### 2. **Cost Summary**
Get high-level cost summary information.

```
GET /metrics/summary
```

**Response:**
```json
{
  "totalSpend": 284750.00,
  "monthOverMonthChange": 12.4,
  "forecastedSpend": 310000.00,
  "budgetLimit": 300000.00,
  "savingsOpportunity": 47200.00,
  "anomaliesDetected": 3
}
```

---

### 3. **Cost by Category**
Get cost breakdown by service category (Compute, Storage, Network, etc.).

```
GET /metrics/cost-by-category
```

**Response:**
```json
[
  { "name": "Compute", "value": 120000, "change": 8.2 },
  { "name": "Storage", "value": 54000, "change": -3.1 },
  ...
]
```

---

### 4. **Cost Trend**
Get monthly cost trends from Apr 2025 to Mar 2026.

```
GET /metrics/cost-trend
```

**Response:**
```json
[
  {
    "month": "Apr 2025",
    "compute": 95000,
    "storage": 48000,
    "network": 30000,
    "kubernetes": 35000,
    "database": 22000
  },
  ...
]
```

---

### 5. **Top Services**
Get top 10 services by cost across AWS, GCP, and Azure.

```
GET /metrics/top-services
```

**Response:**
```json
[
  {
    "name": "EC2 Instances",
    "provider": "AWS",
    "cost": 68500,
    "usage": "1,240 vCPU-hours",
    "trend": 12.3
  },
  ...
]
```

---

### 6. **Recommendations**
Get cost optimization recommendations.

```
GET /metrics/recommendations
```

**Response:**
```json
[
  {
    "id": "rec-1",
    "title": "Right-size EC2 instances in us-east-1",
    "category": "Compute",
    "impact": "High",
    "effort": "Low",
    "savings": 18500,
    "status": "open",
    "steps": [...]
  },
  ...
]
```

---

### 7. **Anomalies**
Get detected cost anomalies.

```
GET /metrics/anomalies
```

**Response:**
```json
[
  {
    "id": "anom-1",
    "service": "Lambda Functions",
    "detectedAt": "2026-03-12T14:32:00Z",
    "severity": "Critical",
    "spike": 340,
    "description": "Sudden 340% spike in Lambda invocations...",
    "data": [...]
  },
  ...
]
```

---

### 8. **Kubernetes - All Data**
Get all Kubernetes metrics (clusters and namespaces).

```
GET /metrics/kubernetes
```

**Response:**
```json
{
  "clusters": [...],
  "namespaces": [...]
}
```

---

### 9. **Kubernetes - Clusters Only**
Get Kubernetes cluster metrics.

```
GET /metrics/kubernetes/clusters
```

**Response:**
```json
[
  {
    "name": "prod-us-east",
    "nodes": 24,
    "cpuUtil": 72,
    "memUtil": 68,
    "cost": 18500,
    "efficiency": 85
  },
  ...
]
```

---

### 10. **Kubernetes - Namespaces Only**
Get Kubernetes namespace data.

```
GET /metrics/kubernetes/namespaces
```

**Response:**
```json
[
  {
    "name": "api-gateway",
    "cluster": "prod-us-east",
    "cpuReq": "8 cores",
    "memReq": "32 GB",
    "cost": 4200,
    "waste": 12
  },
  ...
]
```

---

### 11. **Teams**
Get team-based cost allocation.

```
GET /metrics/teams
```

**Response:**
```json
[
  {
    "name": "Platform Engineering",
    "department": "Engineering",
    "allocated": 85000,
    "actual": 92400,
    "variance": 8.7,
    "services": 18
  },
  ...
]
```

---

### 12. **Unit Economics**
Get unit economics data (cost per user, per transaction).

```
GET /metrics/unit-economics
```

**Response:**
```json
[
  {
    "month": "Apr 2025",
    "costPerUser": 2.45,
    "costPerTransaction": 0.0032,
    "revenue": 890000,
    "margin": 74.2
  },
  ...
]
```

---

### 13. **Budgets**
Get budget data and status.

```
GET /metrics/budgets
```

**Response:**
```json
[
  {
    "name": "Compute Budget",
    "limit": 130000,
    "spent": 120000,
    "forecast": 135000,
    "status": "At Risk",
    "owner": "Platform Engineering"
  },
  ...
]
```

---

### 14. **Virtual Tags**
Get cloud provider tag mappings.

```
GET /metrics/virtual-tags
```

**Response:**
```json
[
  {
    "provider": "AWS",
    "rawKey": "aws:createdBy",
    "rawValue": "team-platform",
    "normalizedKey": "team",
    "normalizedValue": "Platform Engineering"
  },
  ...
]
```

---

### 15. **Reports**
Get scheduled reports.

```
GET /metrics/reports
```

**Response:**
```json
[
  {
    "name": "Weekly Cost Summary",
    "frequency": "Weekly",
    "recipients": ["cfo@company.com"],
    "lastRun": "2026-03-10T08:00:00Z",
    "format": "PDF"
  },
  ...
]
```

---

### 16. **Forecasting**
Get cost forecasting data (historical and projections).

```
GET /metrics/forecasting
```

**Response:**
```json
{
  "historical": [...],
  "forecast": {
    "base": [...],
    "optimistic": [...],
    "pessimistic": [...]
  },
  "drivers": [...]
}
```

---

### 17. **Users**
Get user data.

```
GET /metrics/users
```

**Response:**
```json
[
  {
    "id": "usr-1",
    "name": "Alice Johnson",
    "email": "admin@finops.com",
    "role": "admin",
    "department": "Engineering",
    "status": "active",
    "createdAt": "2025-01-10T09:00:00Z",
    "lastLogin": "2026-03-24T08:00:00Z",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=alice"
  },
  ...
]
```

---

### 18. **Tenants**
Get tenant/organization data.

```
GET /metrics/tenants
```

**Response:**
```json
[
  {
    "id": "ten-1",
    "name": "Acme Corp",
    "plan": "Enterprise",
    "status": "active",
    "usersCount": 45,
    "createdAt": "2024-06-01T00:00:00Z",
    "adminEmail": "admin@acme.com",
    "region": "us-east-1",
    "monthlySpend": 142000
  },
  ...
]
```

---

### 19. **Payment Receipts**
Get payment receipt data.

```
GET /metrics/payment-receipts
```

**Response:**
```json
[
  {
    "id": "rcpt-1",
    "vendor": "AWS",
    "amount": 68500,
    "currency": "USD",
    "date": "2026-03-01T00:00:00Z",
    "status": "paid",
    "invoiceNumber": "INV-AWS-2026-03",
    "description": "AWS Monthly Bill - March 2026",
    "category": "Compute",
    "downloadUrl": "/receipts/rcpt-1.pdf"
  },
  ...
]
```

---

### 20. **Agent Operations - All Data**
Get all agent operations metrics.

```
GET /metrics/agent-ops
```

**Response:** Complete agent ops data with summary, KPIs, cost trends, etc.

---

### 21. **Agent Operations - KPIs Only**
Get agent operations KPIs.

```
GET /metrics/agent-ops/kpis
```

**Response:**
```json
[
  { "label": "Active Agents", "value": "24", "delta": "+3", "trend": "up" },
  { "label": "Error Rate", "value": "1.8%", "delta": "-0.5%", "trend": "down" },
  ...
]
```

---

### 22. **LLM Operations - All Data**
Get all LLM operations metrics.

```
GET /metrics/llm-ops
```

**Response:** Complete LLM ops data with summary, KPIs, cost trends, etc.

---

### 23. **LLM Operations - KPIs Only**
Get LLM operations KPIs.

```
GET /metrics/llm-ops/kpis
```

**Response:**
```json
[
  { "label": "Total LLM Calls", "value": "89.2K", "delta": "+8.5%", "trend": "up" },
  { "label": "Success Rate", "value": "99.1%", "delta": "+0.3%", "trend": "up" },
  ...
]
```

---

## Usage Example

### Frontend (React/TypeScript)

**Before (Static File):**
```typescript
const response = await fetch('/fakedata.json');
const data = await response.json();
```

**After (API Endpoint):**
```typescript
// Get specific data section
const response = await fetch('http://localhost:8000/metrics/cost-by-category');
const costData = await response.json();

// Or get everything
const allData = await fetch('http://localhost:8000/metrics/all').then(r => r.json());
```

---

## Benefits

1. **Better Architecture**: API calls instead of static files
2. **Modularity**: Request only the data you need
3. **Future Ready**: Easy to replace with real database queries
4. **Maintainability**: Single source of truth for mock data
5. **Network Inspection**: Proper API endpoints show in Network tab (not static file references)

---

## Notes

- All endpoints return data as JSON
- The fakedata.json file is loaded once at application startup and cached in memory
- If fakedata.json is not found, endpoints will return empty objects/arrays
- All dates are in ISO 8601 format
- All costs are in USD

