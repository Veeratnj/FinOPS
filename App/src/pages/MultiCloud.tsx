import { useState, useEffect } from "react";
import { 
  Cloud, 
  ArrowRightLeft, 
  TrendingUp, 
  DollarSign, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  ArrowUpRight,
  ExternalLink,
  Server,
  Zap
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  AreaChart, 
  Area, 
  CartesianGrid,
  Legend
} from "recharts";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";
import { PageSkeleton } from "@/components/ui/Skeletons";

export default function MultiCloud() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<"all" | "aws" | "gcp" | "azure">("all");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/fakedata.json");
        const json = await res.json();
        setData(json.multiCloud);
      } catch (e) {
        console.error("Failed to load multi-cloud data", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !data) return <PageSkeleton />;

  const { summary, trend, providers, crossCloudArbitrage } = data;

  const currentProviderData = selectedProvider !== "all" ? providers[selectedProvider] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Multi-Cloud Cost Monitoring</h1>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              AWS · GCP · Azure
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Unified billing ingestion, cross-cloud spend normalization, and pricing arbitrage.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Billing Connectors: Synchronized
          </span>
        </div>
      </div>

      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="finops-card p-4">
          <div className="text-xs text-muted-foreground mb-1">Total Multi-Cloud Spend</div>
          <div className="text-xl font-bold">{formatCurrency(summary.totalSpend)}</div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="h-3 w-3" /> +{summary.momGrowth}% MoM
          </div>
        </div>

        <div className="finops-card p-4 border-amber-500/20">
          <div className="text-xs text-muted-foreground mb-1 flex items-center justify-between">
            <span>AWS</span>
            <span className="text-[10px] font-bold text-amber-400">48.6%</span>
          </div>
          <div className="text-xl font-bold text-amber-400">{formatCurrency(summary.awsSpend)}</div>
          <div className="text-[11px] text-muted-foreground mt-1">
            EC2, EKS, Bedrock, S3
          </div>
        </div>

        <div className="finops-card p-4 border-sky-500/20">
          <div className="text-xs text-muted-foreground mb-1 flex items-center justify-between">
            <span>Google Cloud</span>
            <span className="text-[10px] font-bold text-sky-400">31.3%</span>
          </div>
          <div className="text-xl font-bold text-sky-400">{formatCurrency(summary.gcpSpend)}</div>
          <div className="text-[11px] text-muted-foreground mt-1">
            GKE, Vertex AI, TPU v5e
          </div>
        </div>

        <div className="finops-card p-4 border-blue-500/20">
          <div className="text-xs text-muted-foreground mb-1 flex items-center justify-between">
            <span>Microsoft Azure</span>
            <span className="text-[10px] font-bold text-blue-400">20.1%</span>
          </div>
          <div className="text-xl font-bold text-blue-400">{formatCurrency(summary.azureSpend)}</div>
          <div className="text-[11px] text-muted-foreground mt-1">
            Azure OpenAI, AKS, VMs
          </div>
        </div>

        <div className="finops-card p-4 border-rose-500/20">
          <div className="text-xs text-muted-foreground mb-1">Cross-Cloud Egress</div>
          <div className="text-xl font-bold text-rose-400">{formatCurrency(summary.crossCloudEgress)}</div>
          <div className="text-[11px] text-muted-foreground mt-1">
            Inter-cloud networking fees
          </div>
        </div>
      </div>

      {/* Cloud Provider Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border/60 pb-3">
        {[
          { id: "all", label: "Consolidated Multi-Cloud", badge: "Unified" },
          { id: "aws", label: "Amazon Web Services", badge: formatCurrency(summary.awsSpend) },
          { id: "gcp", label: "Google Cloud Platform", badge: formatCurrency(summary.gcpSpend) },
          { id: "azure", label: "Microsoft Azure", badge: formatCurrency(summary.azureSpend) },
        ].map((tab) => {
          const isActive = selectedProvider === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedProvider(tab.id as any)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 border",
                isActive 
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_16px_rgba(124,255,0,0.18)]"
                  : "border-border/60 bg-card hover:bg-accent text-muted-foreground hover:text-foreground"
              )}
            >
              <span>{tab.label}</span>
              <span className={cn(
                "rounded-full px-1.5 py-0.2 text-[10px]",
                isActive ? "bg-black/20 text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Consolidated View */}
      {selectedProvider === "all" && (
        <div className="space-y-6">
          {/* Monthly Trend Area Chart */}
          <div className="finops-card p-5">
            <h3 className="text-sm font-semibold mb-4">Multi-Cloud Monthly Spend Trend (USD)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="colorAws" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorGcp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAzure" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip 
                  formatter={(v: number) => formatCurrency(v)} 
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} 
                />
                <Legend />
                <Area type="monotone" dataKey="aws" name="AWS" stroke="#f59e0b" fillOpacity={1} fill="url(#colorAws)" />
                <Area type="monotone" dataKey="gcp" name="Google Cloud" stroke="#38bdf8" fillOpacity={1} fill="url(#colorGcp)" />
                <Area type="monotone" dataKey="azure" name="Azure" stroke="#60a5fa" fillOpacity={1} fill="url(#colorAzure)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Cross Cloud Arbitrage Opportunity Matrix */}
          <div className="finops-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Cross-Cloud Unit Cost Arbitrage</h3>
              </div>
              <span className="text-xs text-primary font-medium">Rate Optimization Engine</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-border/60 text-muted-foreground">
                  <tr>
                    <th className="py-2.5 px-3">Resource / Capacity Unit</th>
                    <th className="py-2.5 px-3">AWS Rate</th>
                    <th className="py-2.5 px-3">GCP Rate</th>
                    <th className="py-2.5 px-3">Azure Rate</th>
                    <th className="py-2.5 px-3">Seynova Arbitrage Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {crossCloudArbitrage.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-accent/40 transition">
                      <td className="py-3 px-3 font-medium text-foreground">{row.resource}</td>
                      <td className="py-3 px-3 font-mono text-amber-400">{row.aws}</td>
                      <td className="py-3 px-3 font-mono text-sky-400">{row.gcp}</td>
                      <td className="py-3 px-3 font-mono text-blue-400">{row.azure}</td>
                      <td className="py-3 px-3">
                        <span className="text-primary font-medium flex items-center gap-1">
                          <Sparkles className="h-3 w-3 shrink-0" /> {row.recommendation}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Individual Provider Drill-Down */}
      {selectedProvider !== "all" && currentProviderData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="finops-card p-4">
              <div className="text-xs text-muted-foreground">Provider Total Spend</div>
              <div className="text-2xl font-bold mt-1">{formatCurrency(currentProviderData.spend)}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{currentProviderData.change} vs prior month</div>
            </div>
            <div className="finops-card p-4">
              <div className="text-xs text-muted-foreground">Commitment / Discount Coverage</div>
              <div className="text-2xl font-bold mt-1 text-emerald-400">{currentProviderData.commitmentCoverage}%</div>
              <div className="text-xs text-muted-foreground mt-0.5">Reserved / Savings Plans / CUD</div>
            </div>
            <div className="finops-card p-4">
              <div className="text-xs text-muted-foreground">Provider Status</div>
              <div className="text-2xl font-bold mt-1 text-primary">Connected</div>
              <div className="text-xs text-muted-foreground mt-0.5">Automated Daily CUR / Billing Feed</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Services breakdown */}
            <div className="finops-card p-5 space-y-3">
              <h3 className="text-sm font-semibold">Service-Level Cost Breakdown</h3>
              <div className="space-y-2.5">
                {currentProviderData.services.map((svc: any) => (
                  <div key={svc.name} className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-card">
                    <div>
                      <div className="text-xs font-semibold text-foreground">{svc.name}</div>
                      <div className="text-[10px] text-muted-foreground">Share of provider spend: {svc.share}</div>
                    </div>
                    <div className="text-xs font-bold font-mono">{formatCurrency(svc.cost)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Workloads */}
            <div className="finops-card p-5 space-y-3">
              <h3 className="text-sm font-semibold">Top Cloud Workloads & Clusters</h3>
              <div className="space-y-2.5">
                {currentProviderData.topWorkloads.map((wl: any) => (
                  <div key={wl.workload} className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-card">
                    <div>
                      <div className="text-xs font-mono font-semibold text-foreground">{wl.workload}</div>
                      <div className="text-[10px] text-muted-foreground">Region: {wl.region}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold font-mono">{formatCurrency(wl.cost)}</div>
                      <span className={cn(
                        "text-[9px] font-bold px-1.5 py-0.2 rounded-full",
                        wl.status === "Optimized" || wl.status === "Healthy" ? "bg-emerald-500/15 text-emerald-400" :
                        wl.status === "Active" ? "bg-sky-500/15 text-sky-400" :
                        "bg-amber-500/15 text-amber-400"
                      )}>
                        {wl.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
