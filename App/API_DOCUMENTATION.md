# FinOps Dashboard — Complete API Documentation (78 Endpoints)

> **Base URL:** `http://localhost:5175` (set via `VITE_API_BASE_URL` in `.env`)
> **Mock Mode:** `VITE_USE_MOCK=true` intercepts all calls and returns `fakedata.json` slices
> **Auth Header:** `Authorization: Bearer <token>` (all modules except auth)  
> **Content-Type:** `application/json`

---

## Module 1 — Authentication & Authorization (6 endpoints)

### POST `/auth/login`
**Payload:**
```json
{ "email": "admin@finops.com", "password": "demo123" }
```
**Response `201`:**
```json
{ "token": "eyJ...", "user": { "id": "usr-1", "name": "Alice Johnson", "email": "admin@finops.com", "role": "admin" } }
```

---

### POST `/auth/logout`
**Payload:** None  
**Response `200`:**
```json
{ "message": "Logged out successfully" }
```

---

### POST `/auth/refresh-token`
**Payload:** None (uses existing Bearer token from header)  
**Response `201`:**
```json
{ "token": "eyJnew..." }
```

---

### POST `/auth/register`
**Payload:**
```json
{ "email": "newuser@company.com", "password": "Str0ng#Pass", "name": "John Doe" }
```
**Response `201`:**
```json
{ "message": "Registration successful. Please verify your email." }
```

---

### POST `/auth/verify-email`
**Payload:**
```json
{ "token": "email-verify-token-abc123" }
```
**Response `200`:**
```json
{ "message": "Email verified successfully." }
```

---

### POST `/auth/reset-password`
**Payload:**
```json
{ "email": "admin@finops.com" }
```
**Response `200`:**
```json
{ "message": "Password reset link sent to your email." }
```

---

## Module 2 — Dashboard (8 endpoints)

### GET `/dashboard/summary`
**Payload:** None  
**Response `200`:**
```json
{ "totalSpend": 284750.00, "monthOverMonthChange": 12.4, "forecastedSpend": 310000.00, "budgetLimit": 300000.00, "savingsOpportunity": 47200.00, "anomaliesDetected": 3 }
```

---

### GET `/dashboard/spend-trend`
**Payload:** None  
**Response `200`:**
```json
[
  { "month": "Apr 2025", "compute": 95000, "storage": 48000, "network": 30000, "kubernetes": 35000, "database": 22000 },
  { "month": "Mar 2026", "compute": 120000, "storage": 54000, "network": 38000, "kubernetes": 47000, "database": 25750 }
]
```

---

### GET `/dashboard/cost-by-category`
**Payload:** None  
**Response `200`:**
```json
[
  { "name": "Compute", "value": 120000, "change": 8.2 },
  { "name": "Storage", "value": 54000, "change": -3.1 }
]
```

---

### GET `/dashboard/top-services`
**Payload:** None  
**Response `200`:**
```json
[
  { "name": "EC2 Instances", "provider": "AWS", "cost": 68500, "usage": "1,240 vCPU-hours", "trend": 12.3 }
]
```

---

### GET `/dashboard/recommendations-widget`
**Payload:** None  
**Response `200`:** Top 3 recommendation objects (see Module 6 for full schema)

---

### GET `/dashboard/anomalies-widget`
**Payload:** None  
**Response `200`:** Top 3 anomaly objects (see Module 7 for full schema)

---

### GET `/dashboard/reports-widget`
**Payload:** None  
**Response `200`:** All report objects (see Module 8 for full schema)

---

### POST `/dashboard/refresh`
**Payload:** None  
**Response `200`:**
```json
{ "message": "Dashboard data refreshed.", "timestamp": "2026-03-25T13:00:00.000Z" }
```

---

## Module 3 — Cost Analyzer (8 endpoints)

### GET `/cost-analyzer/services`
**Payload:** None  
**Response `200`:**
```json
[
  { "name": "EC2 Instances", "provider": "AWS", "cost": 68500, "usage": "1,240 vCPU-hours", "trend": 12.3 },
  { "name": "GKE Clusters", "provider": "GCP", "cost": 34200, "usage": "8 clusters", "trend": 22.1 }
]
```

---

### GET `/cost-analyzer/services/filter`
**Query Params:** `?provider=AWS&minCost=10000`  
**Response `200`:** Filtered array of service objects

---

### GET `/cost-analyzer/services/{service_id}`
**Payload:** None  
**Response `200`:**
```json
{ "name": "EC2 Instances", "provider": "AWS", "cost": 68500, "usage": "1,240 vCPU-hours", "trend": 12.3 }
```

---

### GET `/cost-analyzer/cost-by-provider`
**Payload:** None  
**Response `200`:**
```json
[
  { "provider": "AWS", "cost": 125700 },
  { "provider": "GCP", "cost": 93400 },
  { "provider": "Azure", "cost": 65650 }
]
```

---

### GET `/cost-analyzer/cost-by-category`
**Payload:** None  
**Response `200`:** Same as `/dashboard/cost-by-category`

---

### GET `/cost-analyzer/usage-metrics`
**Payload:** None  
**Response `200`:**
```json
[{ "name": "EC2 Instances", "usage": "1,240 vCPU-hours", "cost": 68500 }]
```

---

### GET `/cost-analyzer/services/export`
**Payload:** None  
**Response `200`:**
```json
{ "downloadUrl": "/exports/services_export.csv", "generatedAt": "2026-03-25T13:00:00.000Z" }
```

---

### GET `/cost-analyzer/provider-comparison`
**Payload:** None  
**Response `200`:**
```json
[
  { "provider": "AWS", "services": [ { "name": "EC2 Instances", "cost": 68500 } ] },
  { "provider": "GCP", "services": [...] }
]
```

---

## Module 4 — Categories (6 endpoints)

### GET `/categories`
**Payload:** None  
**Response `200`:**
```json
[{ "name": "Compute", "value": 120000, "change": 8.2 }, ...]
```

---

### GET `/categories/{category_id}`
**Payload:** None  
**Response `200`:**
```json
{ "name": "Compute", "value": 120000, "change": 8.2 }
```

---

### GET `/categories/{category_id}/trend`
**Payload:** None  
**Response `200`:**
```json
[{ "month": "Apr 2025", "value": 95000 }, { "month": "Mar 2026", "value": 120000 }]
```

---

### GET `/categories/{category_id}/services`
**Payload:** None  
**Response `200`:** Array of service objects within that category

---

### GET `/categories/{category_id}/mom-change`
**Payload:** None  
**Response `200`:**
```json
{ "category": "Compute", "change": 8.2 }
```

---

### GET `/categories/{category_id}/export`
**Payload:** None  
**Response `200`:**
```json
{ "downloadUrl": "/exports/Compute_export.csv" }
```

---

## Module 5 — Kubernetes (12 endpoints)

### GET `/kubernetes/clusters`
**Payload:** None  
**Response `200`:**
```json
[
  { "name": "prod-us-east", "nodes": 24, "cpuUtil": 72, "memUtil": 68, "cost": 18500, "efficiency": 85 },
  { "name": "prod-eu-west", "nodes": 16, "cpuUtil": 58, "memUtil": 52, "cost": 12800, "efficiency": 71 }
]
```

---

### GET `/kubernetes/clusters/{cluster_id}`
**Payload:** None  
**Response `200`:** Single cluster object

---

### GET `/kubernetes/clusters/{cluster_id}/cost-breakdown`
**Payload:** None  
**Response `200`:**
```json
{ "cluster": "prod-us-east", "cost": 18500, "breakdown": { "compute": 11100, "storage": 3700, "network": 3700 } }
```

---

### GET `/kubernetes/namespaces`
**Payload:** None  
**Response `200`:**
```json
[{ "name": "api-gateway", "cluster": "prod-us-east", "cpuReq": "8 cores", "memReq": "32 GB", "cost": 4200, "waste": 12 }]
```

---

### GET `/kubernetes/namespaces/{namespace_id}`
**Payload:** None  
**Response `200`:** Single namespace object

---

### GET `/kubernetes/resource-waste`
**Payload:** None  
**Response `200`:**
```json
[{ "namespace": "ml-pipeline", "cluster": "prod-us-east", "waste": 35, "cost": 7800 }]
```

---

### GET `/kubernetes/clusters/{cluster_id}/efficiency`
**Payload:** None  
**Response `200`:**
```json
{ "cluster": "prod-us-east", "efficiency": 85, "cpuUtil": 72, "memUtil": 68 }
```

---

### GET `/kubernetes/pods`
**Payload:** None  
**Response `200`:**
```json
[{ "namespace": "api-gateway", "cpuReq": "8 cores", "memReq": "32 GB" }]
```

---

### GET `/kubernetes/namespaces/{namespace_id}/trend`
**Payload:** None  
**Response `200`:**
```json
[{ "month": "Apr 2025", "cost": "3840" }, { "month": "Mar 2026", "cost": "4200" }]
```

---

### GET `/kubernetes/clusters/{cluster_id}/nodes`
**Payload:** None  
**Response `200`:**
```json
[{ "id": "node-1", "cluster": "prod-us-east", "cpu": "73.2%", "memory": "65.1%" }]
```

---

### GET `/kubernetes/clusters/{cluster_id}/export`
**Payload:** None  
**Response `200`:**
```json
{ "downloadUrl": "/exports/cluster_prod-us-east_export.csv" }
```

---

### GET `/kubernetes/right-sizing`
**Payload:** None  
**Response `200`:** Array of Kubernetes-category recommendations

---

## Module 6 — Recommendations (9 endpoints)

### GET `/recommendations`
**Payload:** None  
**Response `200`:**
```json
[
  { "id": "rec-1", "title": "Right-size EC2 instances in us-east-1", "category": "Compute", "impact": "High", "effort": "Low", "savings": 18500, "status": "open", "steps": ["Identify underutilized instances", "Migrate to smaller types"] }
]
```

---

### GET `/recommendations/{recommendation_id}`
**Payload:** None  
**Response `200`:** Single recommendation object

---

### GET `/recommendations/filter`
**Query Params:** `?category=Compute&impact=High`  
**Response `200`:** Filtered recommendations array

---

### GET `/recommendations/category/{category}`
**Payload:** None  
**Response `200`:** Recommendations filtered by category

---

### PUT `/recommendations/{recommendation_id}/status`
**Payload:**
```json
{ "status": "in_progress" }
```
**Response `200`:**
```json
{ "id": "rec-1", "status": "in_progress", ... }
```

---

### POST `/recommendations/{recommendation_id}/apply`
**Payload:** None  
**Response `200`:**
```json
{ "message": "Recommendation applied successfully.", "steps": ["Step 1", "Step 2"] }
```

---

### GET `/recommendations/{recommendation_id}/impact`
**Payload:** None  
**Response `200`:**
```json
{ "id": "rec-1", "savings": 18500, "impact": "High", "effort": "Low" }
```

---

### POST `/recommendations/{recommendation_id}/dismiss`
**Payload:** None  
**Response `200`:**
```json
{ "message": "Recommendation dismissed." }
```

---

### GET `/recommendations/savings-summary`
**Payload:** None  
**Response `200`:**
```json
{ "totalSavings": 49200, "open": 4, "inProgress": 1, "done": 1 }
```

---

## Module 7 — Anomalies (10 endpoints)

### GET `/anomalies`
**Payload:** None  
**Response `200`:**
```json
[
  { "id": "anom-1", "service": "Lambda Functions", "detectedAt": "2026-03-12T14:32:00Z", "severity": "Critical", "spike": 340, "description": "Sudden 340% spike in Lambda invocations.", "data": [10, 12, 11, 13, 12, 45, 48] }
]
```

---

### GET `/anomalies/{anomaly_id}`
**Payload:** None  
**Response `200`:** Single anomaly object

---

### GET `/anomalies/filter`
**Query Params:** `?severity=Critical`  
**Response `200`:** Filtered anomalies array

---

### GET `/anomalies/severity`
**Payload:** None  
**Response `200`:**
```json
[{ "severity": "Critical", "count": 1 }, { "severity": "High", "count": 2 }, { "severity": "Medium", "count": 2 }]
```

---

### PUT `/anomalies/{anomaly_id}/acknowledge`
**Payload:** None  
**Response `200`:**
```json
{ "id": "anom-1", "status": "acknowledged", ... }
```

---

### PUT `/anomalies/{anomaly_id}/resolve`
**Payload:** None  
**Response `200`:**
```json
{ "id": "anom-1", "status": "resolved", ... }
```

---

### GET `/anomalies/{anomaly_id}/investigate`
**Payload:** None  
**Response `200`:**
```json
{ "id": "anom-1", "investigation": { "steps": ["Review CloudWatch logs", "Check billing dashboard", "Notify team lead"] } }
```

---

### GET `/anomalies/timeline`
**Payload:** None  
**Response `200`:**
```json
[{ "id": "anom-1", "service": "Lambda Functions", "detectedAt": "2026-03-12T14:32:00Z", "severity": "Critical", "spike": 340 }]
```

---

### GET `/anomalies/statistics`
**Payload:** None  
**Response `200`:**
```json
{ "total": 5, "avgSpike": 150, "bySeverity": { "Critical": 1, "High": 2, "Medium": 2 } }
```

---

### GET `/anomalies/alerts-summary`
**Payload:** None  
**Response `200`:**
```json
{ "active": 5, "acknowledged": 0, "resolved": 0 }
```

---

## Module 8 — Reports (8 endpoints)

### GET `/reports`
**Payload:** None  
**Response `200`:**
```json
[
  { "name": "Weekly Cost Summary", "frequency": "Weekly", "recipients": ["cfo@company.com"], "lastRun": "2026-03-10T08:00:00Z", "format": "PDF" }
]
```

---

### GET `/reports/{report_id}`
**Payload:** None  
**Response `200`:** Single report object

---

### POST `/reports/create`
**Payload:**
```json
{ "name": "Monthly K8s Report", "frequency": "Monthly", "recipients": ["devops@company.com"], "format": "CSV" }
```
**Response `201`:**
```json
{ "id": "rpt-1711361400000", "message": "Report created successfully." }
```

---

### PUT `/reports/{report_id}/update`
**Payload:**
```json
{ "recipients": ["cfo@company.com", "cto@company.com"] }
```
**Response `200`:**
```json
{ "name": "Weekly Cost Summary", "updated": true, ... }
```

---

### DELETE `/reports/{report_id}`
**Payload:** None  
**Response `200`:**
```json
{ "message": "Report rpt-1 deleted." }
```

---

### POST `/reports/{report_id}/generate`
**Payload:** None  
**Response `200`:**
```json
{ "message": "Report generation started.", "jobId": "job-1711361400000" }
```

---

### GET `/reports/{report_id}/download`
**Payload:** None  
**Response `200`:**
```json
{ "downloadUrl": "/exports/rpt-1_report.pdf" }
```

---

### GET `/reports/schedules`
**Payload:** None  
**Response `200`:**
```json
[{ "name": "Weekly Cost Summary", "frequency": "Weekly", "lastRun": "2026-03-10T08:00:00Z" }]
```

---

## Module 9 — Virtual Tags (7 endpoints)

### GET `/virtual-tags`
**Payload:** None  
**Response `200`:**
```json
[{ "provider": "AWS", "rawKey": "aws:createdBy", "rawValue": "team-platform", "normalizedKey": "team", "normalizedValue": "Platform Engineering" }]
```

---

### GET `/virtual-tags/coverage`
**Payload:** None  
**Response `200`:**
```json
{ "covered": 8, "total": 12, "percentage": 67 }
```

---

### POST `/virtual-tags/rules/create`
**Payload:**
```json
{ "provider": "AWS", "rawKey": "env", "rawValue": "staging", "normalizedKey": "environment", "normalizedValue": "Staging" }
```
**Response `201`:**
```json
{ "id": "rule-1711361400000", "message": "Tag rule created." }
```

---

### PUT `/virtual-tags/rules/{rule_id}/update`
**Payload:**
```json
{ "normalizedValue": "Pre-Production" }
```
**Response `200`:**
```json
{ "id": "rule-1", "message": "Rule updated." }
```

---

### DELETE `/virtual-tags/rules/{rule_id}`
**Payload:** None  
**Response `200`:**
```json
{ "message": "Rule rule-1 deleted." }
```

---

### GET `/virtual-tags/mappings`
**Payload:** None  
**Response `200`:**
```json
[{ "from": "AWS:aws:createdBy=team-platform", "to": "team=Platform Engineering" }]
```

---

### POST `/virtual-tags/mappings/create`
**Payload:**
```json
{ "from": "GCP:labels.env=dev", "to": "environment=Development" }
```
**Response `201`:**
```json
{ "id": "map-1711361400000", "message": "Tag mapping created." }
```

---

## Module 10 — Cost Allocation (8 endpoints)

### GET `/cost-allocation/teams`
**Payload:** None  
**Response `200`:**
```json
[{ "name": "Platform Engineering", "department": "Engineering", "allocated": 85000, "actual": 92400, "variance": 8.7, "services": 18 }]
```

---

### GET `/cost-allocation/teams/{team_id}`
**Payload:** None  
**Response `200`:** Single team object

---

### GET `/cost-allocation/teams/{team_id}/breakdown`
**Payload:** None  
**Response `200`:**
```json
{ "team": "Platform Engineering", "breakdown": { "compute": 46200, "storage": 18480, "network": 13860, "kubernetes": 9240, "database": 4620 } }
```

---

### POST `/cost-allocation/rules/create`
**Payload:**
```json
{ "name": "Tag-Based Compute Rule", "tag": "team", "target": "Platform Engineering", "category": "Compute" }
```
**Response `201`:**
```json
{ "id": "alloc-rule-1711361400000", "message": "Allocation rule created." }
```

---

### PUT `/cost-allocation/rules/{rule_id}/update`
**Payload:**
```json
{ "category": "Storage" }
```
**Response `200`:**
```json
{ "id": "alloc-rule-1", "message": "Rule updated." }
```

---

### GET `/cost-allocation/treemap`
**Payload:** None  
**Response `200`:**
```json
[{ "name": "Platform Engineering", "value": 92400, "department": "Engineering" }]
```

---

### GET `/cost-allocation/chargeback`
**Payload:** None  
**Response `200`:**
```json
[{ "team": "Platform Engineering", "chargeback": 92400 }]
```

---

### GET `/cost-allocation/variance-analysis`
**Payload:** None  
**Response `200`:**
```json
[{ "team": "Platform Engineering", "allocated": 85000, "actual": 92400, "variance": 8.7 }]
```

---

## Module 11 — Unit Economics (6 endpoints)

### GET `/unit-economics/summary`
**Payload:** None  
**Response `200`:**
```json
{ "month": "Mar 2026", "costPerUser": 2.78, "costPerTransaction": 0.0040, "revenue": 1260000, "margin": 71.8 }
```

---

### GET `/unit-economics/cost-per-user`
**Payload:** None  
**Response `200`:**
```json
[{ "month": "Apr 2025", "value": 2.45 }, { "month": "Mar 2026", "value": 2.78 }]
```

---

### GET `/unit-economics/cost-per-transaction`
**Payload:** None  
**Response `200`:**
```json
[{ "month": "Apr 2025", "value": 0.0032 }, { "month": "Mar 2026", "value": 0.0040 }]
```

---

### GET `/unit-economics/gross-margin`
**Payload:** None  
**Response `200`:**
```json
[{ "month": "Apr 2025", "margin": 74.2, "revenue": 890000 }]
```

---

### GET `/unit-economics/benchmark`
**Payload:** None  
**Response `200`:**
```json
{ "industry": { "costPerUser": 3.10, "grossMargin": 72.0 }, "yours": { "costPerUser": 2.78, "grossMargin": 71.8 } }
```

---

### GET `/unit-economics/trends`
**Payload:** None  
**Response `200`:** Full 12-month array of unit economics data

---

## Module 12 — Forecasting (7 endpoints)

### GET `/forecasting/forecast`
**Payload:** None  
**Response `200`:**
```json
{
  "base": [{ "month": "Apr 2026", "spend": 292000, "lower": 285000, "upper": 299000 }],
  "optimistic": [{ "month": "Apr 2026", "spend": 278000 }],
  "pessimistic": [{ "month": "Apr 2026", "spend": 308000 }]
}
```

---

### GET `/forecasting/forecast/{scenario}`
**Path Params:** `scenario` = `base` | `optimistic` | `pessimistic`  
**Response `200`:**
```json
[{ "month": "Apr 2026", "spend": 292000, "lower": 285000, "upper": 299000 }]
```

---

### POST `/forecasting/what-if`
**Payload:**
```json
{ "assumptions": { "computeGrowth": 5, "k8sReduction": 10 } }
```
**Response `200`:**
```json
{ "scenario": "custom", "projectedSpend": 295000, "savings": 15000 }
```

---

### GET `/forecasting/drivers`
**Payload:** None  
**Response `200`:**
```json
[{ "service": "GKE Clusters", "impact": 8200, "direction": "up", "reason": "New ML workloads" }]
```

---

### PUT `/forecasting/drivers/{driver_id}/update`
**Payload:**
```json
{ "impact": 9500, "reason": "Updated ML pipeline expansion" }
```
**Response `200`:**
```json
{ "id": "drv-1", "message": "Driver updated." }
```

---

### GET `/forecasting/accuracy`
**Payload:** None  
**Response `200`:**
```json
{ "mape": 4.2, "rmse": 8900, "lastEvaluated": "2026-03-01" }
```

---

### GET `/forecasting/historical-accuracy`
**Payload:** None  
**Response `200`:**
```json
[{ "month": "Oct 2025", "spend": 262700 }, { "month": "Mar 2026", "spend": 284750 }]
```

---

## Module 13 — Budgeting (8 endpoints)

### GET `/budgets`
**Payload:** None  
**Response `200`:**
```json
[{ "name": "Compute Budget", "limit": 130000, "spent": 120000, "forecast": 135000, "status": "At Risk", "owner": "Platform Engineering" }]
```

---

### GET `/budgets/{budget_id}`
**Payload:** None  
**Response `200`:** Single budget object

---

### POST `/budgets/create`
**Payload:**
```json
{ "name": "ML Budget", "limit": 50000, "owner": "Data Science" }
```
**Response `201`:**
```json
{ "id": "bgt-1711361400000", "message": "Budget created." }
```

---

### PUT `/budgets/{budget_id}/update`
**Payload:**
```json
{ "limit": 140000 }
```
**Response `200`:**
```json
{ "name": "Compute Budget", "limit": 140000, "updated": true }
```

---

### DELETE `/budgets/{budget_id}`
**Payload:** None  
**Response `200`:**
```json
{ "message": "Budget bgt-1 deleted." }
```

---

### GET `/budgets/status`
**Payload:** None  
**Response `200`:**
```json
[{ "name": "Compute Budget", "status": "At Risk" }, { "name": "K8s Budget", "status": "Exceeded" }]
```

---

### GET `/budgets/daily-burn-rate`
**Payload:** None  
**Response `200`:**
```json
[{ "name": "Compute Budget", "dailyBurnRate": "4000.00" }]
```

---

### POST `/budgets/{budget_id}/alerts`
**Payload:**
```json
{ "threshold": 90, "notifyEmails": ["cfo@company.com"] }
```
**Response `201`:**
```json
{ "message": "Alert set for budget bgt-1." }
```

---

## Module 14 — Payment Receipts (6 endpoints)

### GET `/payment-receipts`
**Payload:** None  
**Response `200`:**
```json
[
  { "id": "rcpt-1", "vendor": "AWS", "amount": 68500, "currency": "USD", "date": "2026-03-01T00:00:00Z", "status": "paid", "invoiceNumber": "INV-AWS-2026-03", "description": "AWS Monthly Bill - March 2026", "category": "Compute", "downloadUrl": "/receipts/rcpt-1.pdf" }
]
```

---

### GET `/payment-receipts/{receipt_id}`
**Payload:** None  
**Response `200`:** Single receipt object

---

### GET `/payment-receipts/vendor/{vendor}`
**Payload:** None  
**Response `200`:** Receipts filtered by vendor (`AWS`, `GCP`, `Azure`)

---

### GET `/payment-receipts/{receipt_id}/download`
**Payload:** None  
**Response `200`:**
```json
{ "downloadUrl": "/receipts/rcpt-1.pdf" }
```

---

### POST `/payment-receipts/upload`
**Payload:** `multipart/form-data` with `file` field  
**Response `201`:**
```json
{ "id": "rcpt-1711361400000", "message": "Receipt uploaded." }
```

---

### GET `/payment-receipts/summary`
**Payload:** None  
**Response `200`:**
```json
{ "total": 237700, "paid": 4, "pending": 1 }
```

---

## Module 15 — Tenant Management (6 endpoints)

### GET `/tenants`
**Payload:** None  
**Response `200`:**
```json
[{ "id": "ten-1", "name": "Acme Corp", "plan": "Enterprise", "status": "active", "usersCount": 45, "region": "us-east-1", "monthlySpend": 142000 }]
```

---

### GET `/tenants/{tenant_id}`
**Payload:** None  
**Response `200`:** Single tenant object

---

### POST `/tenants/create`
**Payload:**
```json
{ "name": "NewCorp Ltd", "plan": "Pro", "adminEmail": "admin@newcorp.com", "region": "us-west-2" }
```
**Response `201`:**
```json
{ "id": "ten-1711361400000", "message": "Tenant created." }
```

---

### PUT `/tenants/{tenant_id}/update`
**Payload:**
```json
{ "plan": "Enterprise" }
```
**Response `200`:**
```json
{ "id": "ten-1", "plan": "Enterprise", "updated": true }
```

---

### DELETE `/tenants/{tenant_id}`
**Payload:** None  
**Response `200`:**
```json
{ "message": "Tenant ten-1 deleted." }
```

---

### GET `/tenants/{tenant_id}/users`
**Payload:** None  
**Response `200`:** Array of user objects belonging to that tenant

---

## Module 16 — User Management (8 endpoints)

### GET `/users`
**Payload:** None  
**Response `200`:**
```json
[{ "id": "usr-1", "name": "Alice Johnson", "email": "admin@finops.com", "role": "admin", "department": "Engineering", "status": "active", "createdAt": "2025-01-10T09:00:00Z", "lastLogin": "2026-03-24T08:00:00Z" }]
```

---

### GET `/users/{user_id}`
**Payload:** None  
**Response `200`:** Single user object

---

### POST `/users/create`
**Payload:**
```json
{ "name": "Emma Lee", "email": "emma@company.com", "role": "analyst", "department": "Finance" }
```
**Response `201`:**
```json
{ "id": "usr-1711361400000", "message": "User created." }
```

---

### PUT `/users/{user_id}/update`
**Payload:**
```json
{ "department": "Operations" }
```
**Response `200`:**
```json
{ "id": "usr-1", "department": "Operations", "updated": true }
```

---

### DELETE `/users/{user_id}`
**Payload:** None  
**Response `200`:**
```json
{ "message": "User usr-4 deleted." }
```

---

### PUT `/users/{user_id}/role`
**Payload:**
```json
{ "role": "manager" }
```
**Response `200`:**
```json
{ "id": "usr-2", "role": "manager", ... }
```

---

### POST `/users/{user_id}/change-password`
**Payload:**
```json
{ "oldPassword": "OldPass#1", "newPassword": "NewPass#2" }
```
**Response `200`:**
```json
{ "message": "Password changed successfully." }
```

---

### GET `/users/{user_id}/activity`
**Payload:** None  
**Response `200`:**
```json
[{ "action": "login", "timestamp": "2026-03-24T08:00:00Z" }, { "action": "viewed dashboard", "timestamp": "2026-03-24T08:01:00Z" }]
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | OK — Successful GET / PUT / DELETE |
| `201` | Created — Successful POST |
| `404` | Not Found — Unknown endpoint |
| `500` | Internal Server Error — Mock data load failure |

---

## Total API Count: 123

| Module | Count |
|--------|-------|
| Authentication | 6 |
| Dashboard | 8 |
| Cost Analyzer | 8 |
| Categories | 6 |
| Kubernetes | 12 |
| Recommendations | 9 |
| Anomalies | 10 |
| Reports | 8 |
| Virtual Tags | 7 |
| Cost Allocation | 8 |
| Unit Economics | 6 |
| Forecasting | 7 |
| Budgeting | 8 |
| Payment Receipts | 6 |
| Tenant Management | 6 |
| User Management | 8 |
| **Total** | **123** |
