import { useState } from "react";
import { useFinOpsData } from "@/hooks/useFinOpsData";
import { PageSkeleton } from "@/components/ui/Skeletons";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";
import type { Recommendation } from "@/types/finops.types";

type FilterTab = "all" | "open" | "in_progress" | "done";

const effortColors: Record<string, string> = {
  Low: "success",
  Medium: "warning",
  High: "danger",
};

export default function Recommendations() {
  const { data, loading } = useFinOpsData();
  const [filter, setFilter] = useState<FilterTab>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, Recommendation["status"]>>({});

  if (loading || !data) return <PageSkeleton />;

  const recs = data.recommendations.map((r) => ({ ...r, status: statuses[r.id] ?? r.status }));
  const filtered = filter === "all" ? recs : recs.filter((r) => r.status === filter);
  const totalSavings = recs.reduce((s, r) => s + r.savings, 0);
  const implementedSavings = recs.filter((r) => r.status === "done").reduce((s, r) => s + r.savings, 0);

  const setStatus = (id: string, status: Recommendation["status"]) => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
  };

  const tabs: { value: FilterTab; label: string }[] = [
    { value: "all", label: "All" },
    { value: "open", label: "Quick Wins" },
    { value: "in_progress", label: "In Progress" },
    { value: "done", label: "Done" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Recommendations</h1>

      <div className="finops-card bg-success/5 border-success/20 p-5">
        <p className="text-xs uppercase tracking-wider text-success">Total Potential Savings</p>
        <p className="text-3xl font-bold text-success">{formatCurrency(totalSavings)}</p>
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>Implemented: {formatCurrency(implementedSavings)}</span>
            <span>{Math.round((implementedSavings / totalSavings) * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted">
            <div className="h-full rounded-full bg-success transition-all" style={{ width: `${(implementedSavings / totalSavings) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="flex gap-1 rounded-lg bg-accent p-1">
        {tabs.map((t) => (
          <button key={t.value} onClick={() => setFilter(t.value)} className={cn("rounded-md px-4 py-2 text-sm font-medium transition-all", filter === t.value ? "bg-card shadow-sm" : "text-muted-foreground")}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filtered.map((rec) => (
          <div key={rec.id} className="finops-card p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="font-semibold">{rec.title}</p>
                <div className="flex gap-2">
                  <StatusBadge status={rec.category} variant="info" />
                  <StatusBadge status={rec.effort} variant={effortColors[rec.effort] as "success" | "warning" | "danger"} />
                  <StatusBadge status={rec.impact} variant={rec.impact === "High" ? "danger" : "warning"} />
                </div>
              </div>
              <p className="text-lg font-bold text-success">{formatCurrency(rec.savings)}</p>
            </div>

            {expanded === rec.id && (
              <div className="rounded-lg bg-accent/50 p-3 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">Implementation Steps:</p>
                {rec.steps.map((step, i) => (
                  <p key={i} className="text-xs text-muted-foreground">{i + 1}. {step}</p>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button onClick={() => setExpanded(expanded === rec.id ? null : rec.id)} className="rounded-md bg-accent px-3 py-1 text-xs font-medium hover:bg-accent/80">
                {expanded === rec.id ? "Collapse" : "Details"}
              </button>
              {rec.status !== "done" && (
                <button onClick={() => setStatus(rec.id, "in_progress")} className="rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20">In Progress</button>
              )}
              {rec.status !== "done" && (
                <button onClick={() => setStatus(rec.id, "done")} className="rounded-md bg-success/10 px-3 py-1 text-xs font-medium text-success hover:bg-success/20">Apply</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
