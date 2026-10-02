import { useFinOpsData } from "@/hooks/useFinOpsData";
import { PageSkeleton } from "@/components/ui/Skeletons";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#f59e0b", "#10b981", "#ec4899", "#f97316", "#14b8a6"];

export default function Kubernetes() {
  const { data, loading } = useFinOpsData();
  if (loading || !data) return <PageSkeleton />;

  const { clusters, namespaces } = data.kubernetes;
  const totalAllocated = namespaces.reduce((s, n) => s + n.cost, 0);
  const totalWaste = namespaces.reduce((s, n) => s + n.cost * (n.waste / 100), 0);
  const wasteData = [
    { name: "Used", value: totalAllocated - totalWaste },
    { name: "Wasted", value: totalWaste },
  ];
  const nsBySort = [...namespaces].sort((a, b) => b.cost - a.cost);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Kubernetes Cost Observability</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {clusters.map((c) => (
          <div key={c.name} className="finops-card p-5 space-y-3">
            <p className="font-semibold">{c.name}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-muted-foreground">Nodes:</span> <span className="font-medium">{c.nodes}</span></div>
              <div><span className="text-muted-foreground">Cost:</span> <span className="font-medium">{formatCurrency(c.cost)}/mo</span></div>
            </div>
            {[{ label: "CPU", value: c.cpuUtil }, { label: "Mem", value: c.memUtil }].map((g) => (
              <div key={g.label}>
                <div className="flex justify-between text-[10px] text-muted-foreground mb-1"><span>{g.label}</span><span>{g.value}%</span></div>
                <div className="h-1.5 rounded-full bg-muted">
                  <div className={cn("h-full rounded-full", g.value > 70 ? "bg-warning" : g.value > 40 ? "bg-primary" : "bg-success")} style={{ width: `${g.value}%` }} />
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Efficiency</span>
              <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", c.efficiency >= 80 ? "bg-success/15 text-success" : c.efficiency >= 60 ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive")}>{c.efficiency}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="finops-card p-5">
          <h3 className="mb-4 text-sm font-semibold">Resource Waste</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={wasteData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={4}>
                <Cell fill="#6366f1" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 text-xs">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary" /> Used</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-destructive" /> Wasted</span>
          </div>
        </div>

        <div className="finops-card p-5">
          <h3 className="mb-4 text-sm font-semibold">Cost by Namespace</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={nsBySort} layout="vertical">
              <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
                {nsBySort.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="finops-card p-5">
        <h3 className="mb-4 text-sm font-semibold">Namespace Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="pb-2 font-medium">Namespace</th>
                <th className="pb-2 font-medium">Cluster</th>
                <th className="pb-2 font-medium">CPU Req</th>
                <th className="pb-2 font-medium">Mem Req</th>
                <th className="pb-2 font-medium text-right">Cost</th>
                <th className="pb-2 font-medium text-right">Waste</th>
              </tr>
            </thead>
            <tbody>
              {namespaces.map((ns) => (
                <tr key={ns.name} className="border-b border-border/50 hover:bg-accent/50">
                  <td className="py-3 font-medium">{ns.name}</td>
                  <td className="py-3 text-muted-foreground">{ns.cluster}</td>
                  <td className="py-3">{ns.cpuReq}</td>
                  <td className="py-3">{ns.memReq}</td>
                  <td className="py-3 text-right tabular-nums">{formatCurrency(ns.cost)}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-muted">
                        <div className={cn("h-full rounded-full", ns.waste > 30 ? "bg-destructive" : "bg-success")} style={{ width: `${ns.waste}%` }} />
                      </div>
                      <span className={cn("text-xs font-medium", ns.waste > 30 ? "text-destructive" : "text-muted-foreground")}>{ns.waste}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
