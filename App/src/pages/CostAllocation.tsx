import { useFinOpsData } from "@/hooks/useFinOpsData";
import { PageSkeleton } from "@/components/ui/Skeletons";
import { formatCurrency, formatPercent } from "@/utils/format";
import { cn } from "@/lib/utils";
import { Sparkline } from "@/components/charts/Sparkline";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#f59e0b", "#10b981", "#ec4899"];

export default function CostAllocation() {
  const { data, loading } = useFinOpsData();

  if (loading || !data) return <PageSkeleton />;

  const treemapData = data.teams.map((t, i) => ({
    name: t.name,
    size: t.actual,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Cost Allocation</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.teams.map((t) => {
          const over = t.variance > 0;
          return (
            <div key={t.name} className="finops-card-hover p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.department} · {t.services} services</p>
                </div>
                <span className={cn("text-xs font-bold", over ? "text-destructive" : "text-success")}>{formatPercent(over ? t.variance : -Math.abs(t.variance))}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-muted-foreground">Allocated:</span> <span className="font-medium">{formatCurrency(t.allocated)}</span></div>
                <div><span className="text-muted-foreground">Actual:</span> <span className="font-medium">{formatCurrency(t.actual)}</span></div>
              </div>
              <div className="w-full"><Sparkline data={[t.allocated * 0.9, t.allocated * 0.95, t.actual * 0.92, t.actual * 0.97, t.actual]} /></div>
            </div>
          );
        })}
      </div>

      <div className="finops-card p-5">
        <h3 className="mb-4 text-sm font-semibold">Allocation Treemap</h3>
        <ResponsiveContainer width="100%" height={300}>
          <Treemap
            data={treemapData}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="hsl(var(--border))"
          >
            <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
          </Treemap>
        </ResponsiveContainer>
      </div>

      <div className="finops-card p-5">
        <h3 className="mb-4 text-sm font-semibold">Chargeback Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="pb-2 font-medium">Team</th>
                <th className="pb-2 font-medium">Services</th>
                <th className="pb-2 font-medium text-right">Allocated</th>
                <th className="pb-2 font-medium text-right">Actual</th>
                <th className="pb-2 font-medium text-right">Variance</th>
              </tr>
            </thead>
            <tbody>
              {data.teams.map((t) => (
                <tr key={t.name} className="border-b border-border/50 hover:bg-accent/50">
                  <td className="py-3 font-medium">{t.name}</td>
                  <td className="py-3 text-muted-foreground">{t.services}</td>
                  <td className="py-3 text-right tabular-nums">{formatCurrency(t.allocated)}</td>
                  <td className="py-3 text-right tabular-nums">{formatCurrency(t.actual)}</td>
                  <td className={cn("py-3 text-right text-xs font-medium", t.variance > 0 ? "text-destructive" : "text-success")}>{formatPercent(t.variance > 0 ? t.variance : -Math.abs(t.variance))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
