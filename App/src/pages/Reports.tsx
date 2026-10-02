import { useState } from "react";
import { useFinOpsData } from "@/hooks/useFinOpsData";
import { PageSkeleton } from "@/components/ui/Skeletons";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { toast } from "sonner";
import { FileText, Play, Plus } from "lucide-react";

export default function Reports() {
  const { data, loading } = useFinOpsData();
  const [generating, setGenerating] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  if (loading || !data) return <PageSkeleton />;

  const handleGenerate = (name: string) => {
    setGenerating(name);
    setTimeout(() => {
      setGenerating(null);
      toast.success(`Report "${name}" generated successfully`);
    }, 1500);
  };

  const freqVariant = (f: string) => f === "Daily" ? "info" : f === "Weekly" ? "success" : f === "Monthly" ? "warning" : "muted";
  const fmtVariant = (f: string) => f === "PDF" ? "danger" : f === "CSV" ? "success" : "info";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus size={16} /> Create Report
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {data.reports.map((r) => (
          <div key={r.name} className="finops-card p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2"><FileText size={18} className="text-primary" /></div>
                <div>
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.recipients.length} recipients</p>
                </div>
              </div>
              <div className="flex gap-2">
                <StatusBadge status={r.frequency} variant={freqVariant(r.frequency) as "info" | "success" | "warning" | "muted"} />
                <StatusBadge status={r.format} variant={fmtVariant(r.format) as "danger" | "success" | "info"} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Last run: {new Date(r.lastRun).toLocaleDateString()}</p>
            <button
              onClick={() => handleGenerate(r.name)}
              disabled={generating === r.name}
              className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 disabled:opacity-50"
            >
              {generating === r.name ? (
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <Play size={12} />
              )}
              {generating === r.name ? "Generating..." : "Generate Now"}
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-4 text-lg font-semibold">Create Report</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Report Name</label>
                <input className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Monthly Summary" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Frequency</label>
                <select className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm">
                  <option>Daily</option><option>Weekly</option><option>Monthly</option><option>Quarterly</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Format</label>
                <select className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm">
                  <option>PDF</option><option>CSV</option><option>Slack</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => { setShowModal(false); toast.success("Report created"); }} className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Create</button>
                <button onClick={() => setShowModal(false)} className="flex-1 rounded-lg bg-accent py-2 text-sm font-medium hover:bg-accent/80">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
