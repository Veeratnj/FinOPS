import { useState } from "react";
import { useFinOpsData } from "@/hooks/useFinOpsData";
import { PageSkeleton } from "@/components/ui/Skeletons";
import { formatCurrency, formatCurrencyExact } from "@/utils/format";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

type Metric = "costPerUser" | "costPerTransaction" | "margin";

const metricConfig: Record<Metric, { label: string; format: (v: number) => string; benchmark: number }> = {
  costPerUser: { label: "Cost per User", format: (v) => `$${v.toFixed(2)}`, benchmark: 2.50 },
  costPerTransaction: { label: "Cost per Transaction", format: (v) => `$${v.toFixed(4)}`, benchmark: 0.0035 },
  margin: { label: "Gross Margin %", format: (v) => `${v.toFixed(1)}%`, benchmark: 75.0 },
};

export default function UnitEconomics() {
  const { data, loading } = useFinOpsData();
  const [metric, setMetric] = useState<Metric>("costPerUser");

  if (loading || !data) return <PageSkeleton />;

  const config = metricConfig[metric];
  const latest = data.unitEconomics[data.unitEconomics.length - 1];
  const totalCost = data.summary.totalSpend;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Unit Economics</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="finops-card p-5"><p className="text-xs text-muted-foreground">Revenue</p><p className="text-2xl font-bold">{formatCurrency(latest.revenue)}</p></div>
        <div className="finops-card p-5"><p className="text-xs text-muted-foreground">Cloud Cost</p><p className="text-2xl font-bold">{formatCurrency(totalCost)}</p></div>
        <div className="finops-card p-5"><p className="text-xs text-muted-foreground">Margin</p><p className="text-2xl font-bold">{latest.margin.toFixed(1)}%</p></div>
        <div className="finops-card p-5"><p className="text-xs text-muted-foreground">Cost % of Revenue</p><p className="text-2xl font-bold">{((totalCost / latest.revenue) * 100).toFixed(1)}%</p></div>
      </div>

      <div className="flex gap-1 rounded-lg bg-accent p-1">
        {(Object.keys(metricConfig) as Metric[]).map((m) => (
          <button key={m} onClick={() => setMetric(m)} className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${metric === m ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
            {metricConfig[m].label}
          </button>
        ))}
      </div>

      <div className="finops-card p-5">
        <h3 className="mb-4 text-sm font-semibold">{config.label} — 12 Month Trend</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data.unitEconomics}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tickFormatter={config.format} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip formatter={(v: number) => config.format(v)} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <ReferenceLine y={config.benchmark} stroke="hsl(var(--warning))" strokeDasharray="5 5" label={{ value: "Benchmark", position: "right", fill: "hsl(var(--warning))", fontSize: 11 }} />
            <Line type="monotone" dataKey={metric} stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="finops-card p-5">
        <h3 className="mb-4 text-sm font-semibold">Benchmark Comparison</h3>
        <div className="flex items-end gap-8">
          <div className="text-center">
            <div className="mx-auto mb-2 w-16 rounded-t-lg bg-primary" style={{ height: `${(data.unitEconomics[data.unitEconomics.length - 1][metric] as number / config.benchmark) * 80}px` }} />
            <p className="text-xs font-medium">You</p>
            <p className="text-xs text-muted-foreground">{config.format(latest[metric])}</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-2 w-16 rounded-t-lg bg-muted" style={{ height: "80px" }} />
            <p className="text-xs font-medium">Industry</p>
            <p className="text-xs text-muted-foreground">{config.format(config.benchmark)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
