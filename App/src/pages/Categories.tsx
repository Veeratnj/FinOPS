import { useState } from "react";
import { useFinOpsData } from "@/hooks/useFinOpsData";
import { PageSkeleton } from "@/components/ui/Skeletons";
import { formatCurrency, formatPercent } from "@/utils/format";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

const tabs = ["Compute", "Storage", "Network", "Kubernetes"] as const;
type Tab = typeof tabs[number];

const categoryKeyMap: Record<Tab, string> = {
  Compute: "compute",
  Storage: "storage",
  Network: "network",
  Kubernetes: "kubernetes",
};

export default function Categories() {
  const { data, loading } = useFinOpsData();
  const [activeTab, setActiveTab] = useState<Tab>("Compute");

  if (loading || !data) return <PageSkeleton />;

  const key = categoryKeyMap[activeTab];
  const category = data.costByCategory.find((c) => c.name === activeTab);
  const trendData = data.costTrend.map((t) => ({ month: t.month, value: t[key as keyof typeof t] as number }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Categories</h1>

      <div className="flex gap-1 rounded-lg bg-accent p-1">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={cn("rounded-md px-4 py-2 text-sm font-medium transition-all", activeTab === tab ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground")}>
            {tab}
          </button>
        ))}
      </div>

      {category && (
        <div className="finops-card p-5">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{activeTab} Spend</p>
              <p className="text-3xl font-bold">{formatCurrency(category.value)}</p>
            </div>
            <span className={`text-sm font-medium ${category.change > 0 ? "trend-up" : "trend-down"}`}>{formatPercent(category.change)} MoM</span>
          </div>
        </div>
      )}

      <div className="finops-card p-5">
        <h3 className="mb-4 text-sm font-semibold">{activeTab} Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {activeTab === "Kubernetes" && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {data.kubernetes.clusters.map((c) => (
              <div key={c.name} className="finops-card p-5 space-y-3">
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.nodes} nodes · {formatCurrency(c.cost)}/mo</p>
                {[{ label: "CPU", value: c.cpuUtil }, { label: "Memory", value: c.memUtil }].map((g) => (
                  <div key={g.label}>
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1"><span>{g.label}</span><span>{g.value}%</span></div>
                    <div className="h-1.5 rounded-full bg-muted">
                      <div className={cn("h-full rounded-full transition-all", g.value > 70 ? "bg-warning" : g.value > 40 ? "bg-primary" : "bg-success")} style={{ width: `${g.value}%` }} />
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Efficiency:</span>
                  <span className={cn("text-xs font-bold", c.efficiency >= 80 ? "text-success" : c.efficiency >= 60 ? "text-warning" : "text-destructive")}>{c.efficiency}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="finops-card p-5">
            <h3 className="mb-4 text-sm font-semibold">Namespaces</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">Namespace</th>
                  <th className="pb-2 font-medium">Cluster</th>
                  <th className="pb-2 font-medium">CPU</th>
                  <th className="pb-2 font-medium">Memory</th>
                  <th className="pb-2 font-medium text-right">Cost</th>
                  <th className="pb-2 font-medium text-right">Waste</th>
                </tr>
              </thead>
              <tbody>
                {data.kubernetes.namespaces.map((ns) => (
                  <tr key={ns.name} className="border-b border-border/50 hover:bg-accent/50">
                    <td className="py-3 font-medium">{ns.name}</td>
                    <td className="py-3 text-muted-foreground">{ns.cluster}</td>
                    <td className="py-3">{ns.cpuReq}</td>
                    <td className="py-3">{ns.memReq}</td>
                    <td className="py-3 text-right tabular-nums">{formatCurrency(ns.cost)}</td>
                    <td className={cn("py-3 text-right text-xs font-medium", ns.waste > 30 ? "text-destructive" : "text-muted-foreground")}>{ns.waste}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
