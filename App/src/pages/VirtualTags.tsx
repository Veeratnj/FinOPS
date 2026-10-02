import { useState } from "react";
import { useFinOpsData } from "@/hooks/useFinOpsData";
import { PageSkeleton } from "@/components/ui/Skeletons";
import { ProviderBadge } from "@/components/ui/StatusBadge";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export default function VirtualTags() {
  const { data, loading } = useFinOpsData();
  const [provFilter, setProvFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);

  if (loading || !data) return <PageSkeleton />;

  const tags = provFilter === "all" ? data.virtualTags : data.virtualTags.filter((t) => t.provider === provFilter);
  const taggedSpend = 82;
  const coverageData = [
    { name: "Tagged", value: taggedSpend },
    { name: "Untagged", value: 100 - taggedSpend },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Virtual Tags</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus size={16} /> Add Tag Rule
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="finops-card border-warning/20 bg-warning/5 p-5">
          <p className="text-xs uppercase tracking-wider text-warning">Untagged Resources</p>
          <p className="text-3xl font-bold text-warning">18%</p>
          <p className="text-xs text-muted-foreground">of total spend</p>
        </div>
        <div className="finops-card col-span-2 p-5">
          <h3 className="mb-2 text-sm font-semibold">Tag Coverage</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={coverageData} cx="50%" cy="50%" innerRadius={35} outerRadius={50} dataKey="value" paddingAngle={4}>
                  <Cell fill="#6366f1" />
                  <Cell fill="hsl(var(--muted))" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 text-sm">
              <p><span className="font-bold text-primary">{taggedSpend}%</span> tagged</p>
              <p><span className="font-bold text-muted-foreground">{100 - taggedSpend}%</span> untagged</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {["all", "AWS", "GCP", "Azure"].map((p) => (
          <button key={p} onClick={() => setProvFilter(p)} className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${provFilter === p ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground hover:bg-accent/80"}`}>
            {p === "all" ? "All Providers" : p}
          </button>
        ))}
      </div>

      <div className="finops-card p-5">
        <h3 className="mb-4 text-sm font-semibold">Tag Mappings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="pb-2 font-medium">Provider</th>
                <th className="pb-2 font-medium">Raw Key</th>
                <th className="pb-2 font-medium">Raw Value</th>
                <th className="pb-2 font-medium">→</th>
                <th className="pb-2 font-medium">Normalized Key</th>
                <th className="pb-2 font-medium">Normalized Value</th>
              </tr>
            </thead>
            <tbody>
              {tags.map((t, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-accent/50">
                  <td className="py-3"><ProviderBadge provider={t.provider} /></td>
                  <td className="py-3 font-mono text-xs">{t.rawKey}</td>
                  <td className="py-3 font-mono text-xs text-muted-foreground">{t.rawValue}</td>
                  <td className="py-3 text-muted-foreground">→</td>
                  <td className="py-3 font-medium">{t.normalizedKey}</td>
                  <td className="py-3">{t.normalizedValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-4 text-lg font-semibold">Add Tag Rule</h2>
            <div className="space-y-4">
              <div><label className="text-xs font-medium text-muted-foreground">Source Provider</label><select className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm"><option>AWS</option><option>GCP</option><option>Azure</option></select></div>
              <div><label className="text-xs font-medium text-muted-foreground">Raw Key Pattern</label><input className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm" placeholder="aws:createdBy" /></div>
              <div><label className="text-xs font-medium text-muted-foreground">Normalized Key</label><input className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm" placeholder="team" /></div>
              <div><label className="text-xs font-medium text-muted-foreground">Normalized Value</label><input className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm" placeholder="Engineering" /></div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => { setShowModal(false); toast.success("Tag rule added"); }} className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground">Add Rule</button>
                <button onClick={() => setShowModal(false)} className="flex-1 rounded-lg bg-accent py-2 text-sm font-medium">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
