import { useState, useMemo } from "react";
import { useFinOpsData } from "@/hooks/useFinOpsData";
import { PageSkeleton } from "@/components/ui/Skeletons";
import { ProviderBadge } from "@/components/ui/StatusBadge";
import { Sparkline } from "@/components/charts/Sparkline";
import { formatCurrency, formatPercent, csvExport } from "@/utils/format";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Download } from "lucide-react";

type Dimension = "provider" | "category";

export default function CostAnalyzer() {
  const { data, loading } = useFinOpsData();
  const [providerFilter, setProviderFilter] = useState<string[]>([]);
  const [dimension, setDimension] = useState<Dimension>("provider");

  const filteredServices = useMemo(() => {
    if (!data) return [];
    return providerFilter.length === 0
      ? data.topServices
      : data.topServices.filter((s) => providerFilter.includes(s.provider));
  }, [data, providerFilter]);

  if (loading || !data) return <PageSkeleton />;

  const providers = ["AWS", "GCP", "Azure"] as const;

  const barData = data.costByCategory.map((cat) => ({
    name: cat.name,
    AWS: Math.round(cat.value * 0.45),
    GCP: Math.round(cat.value * 0.30),
    Azure: Math.round(cat.value * 0.25),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cost Analyzer</h1>
        <button onClick={() => csvExport(filteredServices as unknown as Record<string, unknown>[], "cost-analysis.csv")} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-medium text-muted-foreground">Provider:</span>
        {providers.map((p) => (
          <button key={p} onClick={() => setProviderFilter((f) => f.includes(p) ? f.filter((x) => x !== p) : [...f, p])}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${providerFilter.includes(p) ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground hover:bg-accent/80"}`}>
            {p}
          </button>
        ))}
        <div className="ml-auto flex gap-1 rounded-lg bg-accent p-0.5">
          {(["provider", "category"] as Dimension[]).map((d) => (
            <button key={d} onClick={() => setDimension(d)} className={`rounded-md px-3 py-1 text-xs font-medium capitalize ${dimension === d ? "bg-card shadow-sm" : "text-muted-foreground"}`}>{d}</button>
          ))}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="finops-card p-5">
        <h3 className="mb-4 text-sm font-semibold">Cost by Provider per Category</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Legend />
            <Bar dataKey="AWS" fill="hsl(var(--aws))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="GCP" fill="hsl(var(--gcp))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Azure" fill="hsl(var(--azure))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="finops-card p-5">
        <h3 className="mb-4 text-sm font-semibold">All Services</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="pb-2 font-medium">Service</th>
                <th className="pb-2 font-medium">Provider</th>
                <th className="pb-2 font-medium">Usage</th>
                <th className="pb-2 font-medium text-right">Cost</th>
                <th className="pb-2 font-medium text-right">Trend</th>
                <th className="pb-2 font-medium w-24"></th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((s) => (
                <tr key={s.name} className="border-b border-border/50 hover:bg-accent/50">
                  <td className="py-3 font-medium">{s.name}</td>
                  <td className="py-3"><ProviderBadge provider={s.provider} /></td>
                  <td className="py-3 text-muted-foreground">{s.usage}</td>
                  <td className="py-3 text-right tabular-nums">{formatCurrency(s.cost)}</td>
                  <td className={`py-3 text-right text-xs font-medium ${s.trend > 0 ? "trend-up" : "trend-down"}`}>{formatPercent(s.trend)}</td>
                  <td className="py-3"><Sparkline data={[s.cost * 0.8, s.cost * 0.85, s.cost * 0.9, s.cost * 0.95, s.cost]} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
