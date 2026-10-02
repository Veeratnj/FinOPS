export interface Summary {
  totalSpend: number;
  monthOverMonthChange: number;
  forecastedSpend: number;
  budgetLimit: number;
  savingsOpportunity: number;
  anomaliesDetected: number;
}

export interface CostCategory {
  name: string;
  value: number;
  change: number;
}

export interface CostTrendItem {
  month: string;
  compute: number;
  storage: number;
  network: number;
  kubernetes: number;
  database: number;
}

export interface TopService {
  name: string;
  provider: "AWS" | "GCP" | "Azure";
  cost: number;
  usage: string;
  trend: number;
}

export interface Recommendation {
  id: string;
  title: string;
  category: string;
  impact: "High" | "Medium" | "Low";
  effort: "High" | "Medium" | "Low";
  savings: number;
  status: "open" | "in_progress" | "done";
  steps: string[];
}

export interface Anomaly {
  id: string;
  service: string;
  detectedAt: string;
  severity: "Critical" | "High" | "Medium";
  spike: number;
  description: string;
  data: number[];
}

export interface K8sCluster {
  name: string;
  nodes: number;
  cpuUtil: number;
  memUtil: number;
  cost: number;
  efficiency: number;
}

export interface K8sNamespace {
  name: string;
  cluster: string;
  cpuReq: string;
  memReq: string;
  cost: number;
  waste: number;
}

export interface Team {
  name: string;
  department: string;
  allocated: number;
  actual: number;
  variance: number;
  services: number;
}

export interface UnitEconomicsItem {
  month: string;
  costPerUser: number;
  costPerTransaction: number;
  revenue: number;
  margin: number;
}

export interface Budget {
  name: string;
  limit: number;
  spent: number;
  forecast: number;
  status: "On Track" | "At Risk" | "Exceeded";
  owner: string;
}

export interface VirtualTag {
  provider: "AWS" | "GCP" | "Azure";
  rawKey: string;
  rawValue: string;
  normalizedKey: string;
  normalizedValue: string;
}

export interface Report {
  name: string;
  frequency: "Daily" | "Weekly" | "Monthly" | "Quarterly";
  recipients: string[];
  lastRun: string;
  format: "PDF" | "CSV" | "Slack";
}

export interface ForecastPoint {
  month: string;
  spend: number;
  lower?: number;
  upper?: number;
}

export interface ForecastDriver {
  service: string;
  impact: number;
  direction: "up" | "down";
  reason: string;
}

export interface FinOpsData {
  summary: Summary;
  costByCategory: CostCategory[];
  costTrend: CostTrendItem[];
  topServices: TopService[];
  recommendations: Recommendation[];
  anomalies: Anomaly[];
  kubernetes: {
    clusters: K8sCluster[];
    namespaces: K8sNamespace[];
  };
  teams: Team[];
  unitEconomics: UnitEconomicsItem[];
  budgets: Budget[];
  virtualTags: VirtualTag[];
  reports: Report[];
  forecasting: {
    historical: ForecastPoint[];
    forecast: {
      base: ForecastPoint[];
      optimistic: ForecastPoint[];
      pessimistic: ForecastPoint[];
    };
    drivers: ForecastDriver[];
  };
  multiCloud?: any;
  dockerAnalytics?: any;
  hardwareOrchestration?: any;
}
