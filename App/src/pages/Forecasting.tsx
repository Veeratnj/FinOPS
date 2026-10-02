import { useState } from "react";
import { useFinOpsData } from "@/hooks/useFinOpsData";
import { PageSkeleton } from "@/components/ui/Skeletons";
import { formatCurrency } from "@/utils/format";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

type Scenario = "base" | "optimistic" | "pessimistic";

export default function Forecasting() {
  const { data, loading } = useFinOpsData();
  const [scenario, setScenario] = useState<Scenario>("base");
  const [growthAdj, setGrowthAdj] = useState(0);

  if (loading || !data) return <PageSkeleton />;

  const { historical, forecast, drivers } = data.forecasting;
  const forecastData = forecast[scenario];

  const chartData = [
    ...historical.map((h) => ({ month: h.month, spend: h.spend, type: "historical" })),
    ...forecastData.map((f) => ({
      month: f.month,
      spend: Math.round(f.spend * (1 + growthAdj / 100)),
      lower: Math.round((f.lower ?? f.spend) * (1 + growthAdj / 100)),
      upper: Math.round((f.upper ?? f.spend) * (1 + growthAdj / 100)),
      type: "forecast",
    })),
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Forecasting</h1>

      <div className="flex flex-wrap gap-2">
        {(["base", "optimistic", "pessimistic"] as Scenario[]).map((s) => (
          <button key={s} onClick={() => setScenario(s)} className={cn("rounded-md px-4 py-2 text-sm font-medium capitalize transition-all", scenario === s ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground hover:bg-accent/80")}>
            {s}
          </button>
        ))}
      </div>

      <div className="finops-card p-5">
        <h3 className="mb-4 text-sm font-semibold">Spend Forecast — {scenario}</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="upper" stroke="none" fill="hsl(var(--primary))" fillOpacity={0.1} />
            <Area type="monotone" dataKey="lower" stroke="none" fill="hsl(var(--background))" fillOpacity={1} />
            <Line type="monotone" dataKey="spend" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="finops-card p-5">
        <h3 className="mb-4 text-sm font-semibold">What-If Growth Adjustment</h3>
        <div className="flex items-center gap-4">
          <input type="range" min={-20} max={20} value={growthAdj} onChange={(e) => setGrowthAdj(Number(e.target.value))} className="w-full accent-primary" />
          <span className="min-w-[60px] text-right text-sm font-bold">{growthAdj > 0 ? "+" : ""}{growthAdj}%</span>
        </div>
      </div>

      <div className="finops-card p-5">
        <h3 className="mb-4 text-sm font-semibold">Forecast Drivers</h3>
        <div className="space-y-3">
          {drivers.map((d) => (
            <div key={d.service} className="flex items-center justify-between rounded-lg bg-accent/50 p-3">
              <div className="flex items-center gap-3">
                {d.direction === "up" ? <TrendingUp size={16} className="text-destructive" /> : <TrendingDown size={16} className="text-success" />}
                <div>
                  <p className="text-sm font-medium">{d.service}</p>
                  <p className="text-xs text-muted-foreground">{d.reason}</p>
                </div>
              </div>
              <span className={cn("text-sm font-bold", d.direction === "up" ? "text-destructive" : "text-success")}>
                {d.direction === "up" ? "+" : "-"}{formatCurrency(Math.abs(d.impact))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
