import { useState, useMemo } from "react";
import { useFinOpsData } from "@/hooks/useFinOpsData";
import { PageSkeleton } from "@/components/ui/Skeletons";
import { ProviderBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, formatPercent } from "@/utils/format";
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Lightbulb, 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  Bot, 
  Cpu, 
  Cloud, 
  Ship, 
  Boxes, 
  ArrowUpRight, 
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
  Lock
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, ComposedChart, Bar
} from "recharts";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#f59e0b", "#10b981"];

// Dual-axis unit economics trend data
const unitEconomicsTrend = [
  { month: "Oct 2025", spend: 242000, tokensM: 420, costPerM: 0.58, efficiency: 82 },
  { month: "Nov 2025", spend: 251000, tokensM: 580, costPerM: 0.43, efficiency: 86 },
  { month: "Dec 2025", spend: 262000, tokensM: 740, costPerM: 0.35, efficiency: 89 },
  { month: "Jan 2026", spend: 269000, tokensM: 920, costPerM: 0.29, efficiency: 91 },
  { month: "Feb 2026", spend: 278000, tokensM: 1140, costPerM: 0.24, efficiency: 94 },
  { month: "Mar 2026", spend: 284750, tokensM: 1420, costPerM: 0.20, efficiency: 96 },
];

// Multi-cloud 12-month comparative trend
const multiCloudTrend = [
  { month: "Apr", aws: 88000, gcp: 54000, azure: 38000, privateCloud: 18000 },
  { month: "May", aws: 92000, gcp: 57000, azure: 39500, privateCloud: 18000 },
  { month: "Jun", aws: 95000, gcp: 61000, azure: 41000, privateCloud: 18500 },
  { month: "Jul", aws: 99000, gcp: 64000, azure: 42000, privateCloud: 19000 },
  { month: "Aug", aws: 104000, gcp: 68000, azure: 44500, privateCloud: 19000 },
  { month: "Sep", aws: 108000, gcp: 71000, azure: 46000, privateCloud: 19500 },
  { month: "Oct", aws: 114000, gcp: 74500, azure: 48000, privateCloud: 20000 },
  { month: "Nov", aws: 120000, gcp: 78000, azure: 50500, privateCloud: 20500 },
  { month: "Dec", aws: 125000, gcp: 82000, azure: 52000, privateCloud: 21000 },
  { month: "Jan", aws: 130000, gcp: 85000, azure: 53500, privateCloud: 21000 },
  { month: "Feb", aws: 134500, gcp: 87500, azure: 55200, privateCloud: 21500 },
  { month: "Mar", aws: 138500, gcp: 89200, azure: 57050, privateCloud: 22000 },
];

// 24-Hour live burn rate
const liveHourlyBurn = [
  { hour: "00:00", spend: 320, tokensK: 120, status: "Normal" },
  { hour: "03:00", spend: 280, tokensK: 95, status: "Normal" },
  { hour: "06:00", spend: 310, tokensK: 110, status: "Normal" },
  { hour: "09:00", spend: 590, tokensK: 340, status: "Normal" },
  { hour: "12:00", spend: 820, tokensK: 520, status: "Normal" },
  { hour: "14:00", spend: 960, tokensK: 640, status: "Normal" },
  { hour: "16:00", spend: 1450, tokensK: 910, status: "Spike Intercepted" }, // Anomaly
  { hour: "18:00", spend: 780, tokensK: 480, status: "Normal" },
  { hour: "21:00", spend: 520, tokensK: 280, status: "Normal" },
];

export default function Dashboard() {
  const { data, loading } = useFinOpsData();
  const [chartView, setChartView] = useState<"unitEconomics" | "multiCloud" | "category" | "hourly">("unitEconomics");
  const [circuitBreakerActive, setCircuitBreakerActive] = useState(true);

  if (loading || !data) return <PageSkeleton />;

  const { summary, costTrend, costByCategory, topServices } = data;
  const budgetPercent = Math.round((summary.totalSpend / summary.budgetLimit) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Executive Intelligence Dashboard</h1>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              Seynova Real-Time
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Multi-cloud spend correlation, AI token unit economics, and autonomous circuit-breaker status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Telemetry: 100% Operational
          </span>
        </div>
      </div>

      {/* Meaningful Feature 1: Autonomous AI Circuit Breaker & Safety Shield Banner */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/[0.08] via-card to-card p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">Seynova Autonomous Circuit Breaker</span>
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[10px] font-bold border border-emerald-500/30">
                  ARMED & ACTIVE
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Automatically monitors runaway agent loops, zombie GPU allocations, and token burn rate anomalies.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="rounded-xl border border-border/60 bg-background/60 px-3 py-1.5">
              <span className="text-muted-foreground">Intercepted Incidents: </span>
              <span className="font-bold text-foreground">3 Runaway Loops</span>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/60 px-3 py-1.5">
              <span className="text-muted-foreground">Capital Protected: </span>
              <span className="font-bold text-primary">$14,820</span>
            </div>
            <button 
              onClick={() => setCircuitBreakerActive(!circuitBreakerActive)}
              className={cn(
                "px-3 py-1.5 rounded-xl font-semibold transition border",
                circuitBreakerActive 
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-border"
              )}
            >
              {circuitBreakerActive ? "Guardrails Enforced" : "Paused"}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Row (5 Cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="finops-card p-5 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Total Cloud Spend</span>
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalSpend)}</div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
            <ArrowUpRight className="h-3.5 w-3.5" /> +{summary.monthOverMonthChange}% MoM
          </div>
        </div>

        <div className="finops-card p-5 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">AI Accelerator Burn</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold">$128.40/hr</div>
          <div className="text-xs text-muted-foreground">
            64 Accelerators (GPU/MPU/LPU)
          </div>
        </div>

        <div className="finops-card p-5 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Forecasted Spend</span>
            <Target className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold">{formatCurrency(summary.forecastedSpend)}</div>
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>{budgetPercent}% of {formatCurrency(summary.budgetLimit)} budget</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all",
                  budgetPercent > 90 ? "bg-amber-500" : "bg-primary"
                )} 
                style={{ width: `${Math.min(budgetPercent, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="finops-card p-5 space-y-1 border-primary/20 bg-primary/[0.02]">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider text-primary">Identified Savings</span>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-primary">{formatCurrency(summary.savingsOpportunity)}/mo</div>
          <div className="text-xs text-muted-foreground">
            Idle GPUs, pod rightsizing & pruning
          </div>
        </div>

        <div className="finops-card p-5 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Active Anomalies</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400">{summary.anomaliesDetected} Alerts</div>
          <div className="text-xs text-muted-foreground">
            1 Intercepted · 2 Under Review
          </div>
        </div>
      </div>

      {/* Multi-Graph Trend Intelligence Center */}
      <div className="finops-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3">
          <div>
            <h3 className="text-base font-semibold tracking-tight">Intelligence Trend Center</h3>
            <p className="text-xs text-muted-foreground">
              Cross-correlate multi-cloud costs, unit economics efficiency, and real-time workload burn.
            </p>
          </div>

          {/* Interactive Chart View Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-muted/60 p-1 rounded-xl border border-border/40">
            {[
              { id: "unitEconomics", label: "Unit Economics (Tokens vs Cost)" },
              { id: "multiCloud", label: "Multi-Cloud Comparison (AWS·GCP·Azure)" },
              { id: "category", label: "Category Breakdown" },
              { id: "hourly", label: "24h Real-Time Burn" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setChartView(tab.id as any)}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-lg font-medium transition",
                  chartView === tab.id 
                    ? "bg-card text-foreground shadow-sm font-semibold border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart View 1: Unit Economics Dual-Axis Multi-Graph */}
        {chartView === "unitEconomics" && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-primary/70 inline-block" /> Total Monthly Spend ($)</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sky-400 inline-block" /> Token Volume (Millions of Tokens)</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400 inline-block" /> Unit Cost ($ per 1M Tokens)</span>
              </div>
              <span className="text-emerald-400 font-medium">Unit cost dropped 65% while token volume tripled!</span>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={unitEconomicsTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="left" tickFormatter={(v) => `$${v/1000}k`} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}M`} tick={{ fontSize: 11 }} stroke="#38bdf8" />
                <Tooltip 
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} 
                />
                <Legend />
                <Bar yAxisId="left" dataKey="spend" name="Monthly Spend ($)" fill="#7cff00" opacity={0.5} radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="tokensM" name="Token Volume (Millions)" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line yAxisId="left" type="monotone" dataKey="efficiency" name="Efficiency Score (%)" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Chart View 2: Multi-Cloud Multi-Line Comparative Trend */}
        {chartView === "multiCloud" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>12-Month spend trajectory across cloud providers</span>
              <span className="text-primary">AWS (48.6%) · GCP (31.3%) · Azure (20.1%)</span>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={multiCloudTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tickFormatter={(v) => `$${v/1000}k`} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  formatter={(v: number) => formatCurrency(v)}
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} 
                />
                <Legend />
                <Line type="monotone" dataKey="aws" name="Amazon Web Services" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="gcp" name="Google Cloud Platform" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="azure" name="Microsoft Azure" stroke="#818cf8" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="privateCloud" name="Private Cloud / Bare Metal" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Chart View 3: Category Breakdown Stacked Area */}
        {chartView === "category" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Stacked resource category allocation</span>
              <span>Compute, Storage, Network, Kubernetes, Database</span>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={costTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Legend />
                {["compute", "storage", "network", "kubernetes", "database"].map((key, i) => (
                  <Area key={key} type="monotone" dataKey={key} stackId="1" fill={CATEGORY_COLORS[i]} stroke={CATEGORY_COLORS[i]} fillOpacity={0.6} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Chart View 4: 24h Real-Time Burn */}
        {chartView === "hourly" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Today's real-time burn curve (updated every 15m)</span>
              <span className="text-rose-400 font-semibold">Anomaly detected at 16:00 (Killed via Circuit Breaker)</span>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={liveHourlyBurn}>
                <defs>
                  <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7cff00" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#7cff00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  formatter={(v: number) => `$${v}`}
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} 
                />
                <Area type="monotone" dataKey="spend" name="Hourly Spend ($)" stroke="#7cff00" fillOpacity={1} fill="url(#hourlyGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Mid Section: Hardware Silicon Heatbars + Category Donut */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Silicon Fleet Heatbars (2 cols) */}
        <div className="finops-card p-5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">AI Accelerator Silicon Saturation</h3>
            </div>
            <Link to="/hardware-orchestration" className="text-xs text-primary hover:underline">
              View Hardware Fleet →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/60 bg-card p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-foreground">NVIDIA GPUs (H100 / A100)</span>
                <span className="font-mono text-emerald-400 font-bold">81.4% Util</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: "81.4%" }} />
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>36 GPUs Active</span>
                <span>$88.50/hr burn</span>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-foreground">Google MPUs / TPUs (v4/v5e)</span>
                <span className="font-mono text-sky-400 font-bold">74.2% MXU</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-sky-400 rounded-full" style={{ width: "74.2%" }} />
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>4 Pod Slices</span>
                <span>$28.80/hr burn</span>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-foreground">ARM / x86 CPUs (Graviton4)</span>
                <span className="font-mono text-amber-400 font-bold">68.5% Core</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: "68.5%" }} />
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>512 Cores</span>
                <span>$7.40/hr burn</span>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-foreground">Groq LPUs (Deterministic)</span>
                <span className="font-mono text-primary font-bold">560 tok/s</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "88%" }} />
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>12 LPU Racks</span>
                <span>$0.08 / 1M tokens</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cost by Category Donut (1 col) */}
        <div className="finops-card p-5 space-y-3">
          <h3 className="text-sm font-semibold">Cost Distribution</h3>
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie 
                data={costByCategory} 
                cx="50%" 
                cy="50%" 
                innerRadius={55} 
                outerRadius={80} 
                dataKey="value" 
                paddingAngle={4}
              >
                {costByCategory.map((_, i) => (
                  <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {costByCategory.slice(0, 4).map((c, i) => (
              <div key={c.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[i] }} />
                <span className="text-muted-foreground truncate">{c.name}:</span>
                <span className="font-semibold">{formatCurrency(c.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top 5 Services with Efficiency Ratings */}
      <div className="finops-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Top Cloud & AI Services</h3>
            <p className="text-xs text-muted-foreground">Highest impact infrastructure components</p>
          </div>
          <Link to="/cost-analyzer" className="text-xs text-primary hover:underline">View all services →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="pb-2 font-medium">Service Name</th>
                <th className="pb-2 font-medium">Cloud Provider</th>
                <th className="pb-2 font-medium">Usage Allocation</th>
                <th className="pb-2 font-medium text-right">Monthly Spend</th>
                <th className="pb-2 font-medium text-right">Trend</th>
                <th className="pb-2 font-medium text-right">Efficiency Grade</th>
              </tr>
            </thead>
            <tbody>
              {topServices.slice(0, 5).map((s, idx) => (
                <tr key={s.name} className="border-b border-border/50 hover:bg-accent/50 transition">
                  <td className="py-3 font-medium flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">#{idx+1}</span>
                    <span>{s.name}</span>
                  </td>
                  <td className="py-3"><ProviderBadge provider={s.provider} /></td>
                  <td className="py-3 text-xs text-muted-foreground font-mono">{s.usage}</td>
                  <td className="py-3 text-right tabular-nums font-semibold">{formatCurrency(s.cost)}</td>
                  <td className={`py-3 text-right text-xs font-medium ${s.trend > 0 ? "trend-up" : "trend-down"}`}>
                    {formatPercent(s.trend)}
                  </td>
                  <td className="py-3 text-right">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[11px] font-bold",
                      idx === 0 ? "bg-emerald-500/15 text-emerald-400" :
                      idx === 1 ? "bg-sky-500/15 text-sky-400" :
                      idx === 2 ? "bg-amber-500/15 text-amber-400" :
                      "bg-muted text-foreground"
                    )}>
                      {idx === 0 ? "A+ (96%)" : idx === 1 ? "A (91%)" : idx === 2 ? "B+ (84%)" : "B (78%)"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6 Core Pillars Direct Jump Cards */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider text-xs">
          Seynova Core Pillars Navigation
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {[
            { to: "/multi-cloud", label: "Multi-Cloud", sub: "AWS · GCP · Azure", icon: Cloud, color: "text-amber-400" },
            { to: "/agent-ops", label: "Agent Ops", sub: "Traces & Tool DAGs", icon: Bot, color: "text-primary" },
            { to: "/token-ops", label: "Token-OPS", sub: "Prompt Economics", icon: Cpu, color: "text-sky-400" },
            { to: "/hardware-orchestration", label: "Hardware", sub: "GPU · MPU · LPU", icon: Zap, color: "text-emerald-400" },
            { to: "/kubernetes", label: "Kubernetes", sub: "Cluster & Pods", icon: Ship, color: "text-indigo-400" },
            { to: "/docker", label: "Docker Fleet", sub: "Container Hosts", icon: Boxes, color: "text-rose-400" },
          ].map((item) => (
            <Link 
              key={item.to} 
              to={item.to} 
              className="rounded-xl border border-border/60 bg-card p-3.5 hover:border-primary/40 hover:bg-accent/40 transition flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <item.icon className={cn("h-4 w-4", item.color)} />
                <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground">{item.label}</div>
                <div className="text-[10px] text-muted-foreground truncate">{item.sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
