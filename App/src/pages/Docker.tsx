import { useState, useEffect, useCallback, useRef } from "react";
import {
  Boxes,
  Server,
  Trash2,
  DollarSign,
  HardDrive,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";
import { PageSkeleton } from "@/components/ui/Skeletons";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "http://localhost:8000" : "");
const POLL_INTERVAL_MS = 10_000;

export default function Docker() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [filter, setFilter] = useState<"all" | "running" | "zombie" | "exited">("all");
  const abortRef = useRef<AbortController | null>(null);

  const loadData = useCallback(async (isBackgroundPoll = false) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (isBackgroundPoll) {
      setRefreshing(true);
    }

    try {
      const token = localStorage.getItem("access_token");
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const fetchInit: RequestInit = {
        headers,
        signal: controller.signal,
        ...(isBackgroundPoll ? { priority: "low" } : {}),
      } as RequestInit;

      let res = await fetch(`${API_BASE_URL}/api/docker`, fetchInit);
      if (!res.ok) {
        res = await fetch(`${API_BASE_URL}/docker`, fetchInit);
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date());
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        console.error("Failed to load Docker data from API", e);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData(false);

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        loadData(true);
      }
    }, POLL_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadData(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      abortRef.current?.abort();
    };
  }, [loadData]);

  if (loading && !data) return <PageSkeleton />;

  const summary = data?.summary ?? {};
  const hostNodes = Array.isArray(data?.hostNodes) ? data.hostNodes : [];
  const containers = Array.isArray(data?.containers) ? data.containers : [];
  const storageWaste = Array.isArray(data?.storageWaste) ? data.storageWaste : [];
  const hasDockerData = Object.keys(summary).length > 0 || hostNodes.length > 0 || containers.length > 0;

  if (!hasDockerData) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Docker Container Intelligence</h1>
              <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-xs font-semibold text-sky-400">
                Host & Daemon Fleet
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Monitor standalone container hosts, daemon memory burn, idle containers, and storage waste.
            </p>
          </div>
          <button
            type="button"
            onClick={() => loadData(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground border border-border/60 transition"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} />
            HTTP Polling (10s)
          </button>
        </div>

        <div className="finops-card p-10 text-center space-y-3">
          <Boxes className="h-10 w-10 text-muted-foreground mx-auto opacity-60" />
          <h2 className="text-base font-semibold">No Docker Fleet Telemetry Data Yet</h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            No container host or storage waste metrics are recorded for this organization yet. Once Docker telemetry is ingested or seeded, this view automatically updates via 10s HTTP polling.
          </p>
        </div>
      </div>
    );
  }

  const filteredContainers = containers.filter((c: any) => {
    if (filter === "all") return true;
    return String(c.status ?? "").toLowerCase().includes(filter);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Docker Container Intelligence</h1>
            <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-xs font-semibold text-sky-400">
              Host & Daemon Fleet
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Monitor standalone container hosts, daemon memory burn, idle containers, and storage waste.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            HTTP Poll (10s) • Docker v26.1
          </span>
          <button
            type="button"
            onClick={() => loadData(true)}
            title={lastUpdated ? `Last synced ${lastUpdated.toLocaleTimeString()}` : "Refresh now"}
            className="inline-flex items-center gap-1.5 rounded-md bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground border border-border/60 transition"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin text-primary")} />
            Sync
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="finops-card p-5">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Active Containers</span>
            <Boxes className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold">{summary.runningContainers ?? 0} Running</div>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span>{summary.totalHosts ?? 0} Docker Hosts</span>
            <span>•</span>
            <span className="text-rose-400 font-medium">{summary.zombieContainers ?? 0} Zombie / Idle</span>
          </div>
        </div>

        <div className="finops-card p-5">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Monthly Spend</span>
            <DollarSign className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold">{formatCurrency(summary.monthlyContainerSpend ?? 0)}/mo</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Compute & Daemon overhead
          </div>
        </div>

        <div className="finops-card p-5">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Dangling Storage Waste</span>
            <HardDrive className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400">{summary.danglingStorageGB ?? 0} GB</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Orphaned layers & volumes
          </div>
        </div>

        <div className="finops-card p-5 border-primary/20 bg-primary/[0.03]">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-primary">Reclaimable Savings</span>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-primary">{formatCurrency(summary.potentialMonthlySavings ?? 0)}/mo</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Prune waste & terminate zombies
          </div>
        </div>
      </div>

      {/* Docker Hosts Fleet Status */}
      <div className="finops-card p-5">
        <h3 className="text-sm font-semibold mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Server className="h-4 w-4 text-muted-foreground" />
            <span>Container Daemon Hosts</span>
          </span>
          {lastUpdated && (
            <span className="text-xs text-muted-foreground font-normal">
              Auto-polled every 10s • {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {hostNodes.map((node: any) => (
            <div key={node.host} className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-foreground truncate">{node.host}</span>
                <span className={cn(
                  "px-1.5 py-0.5 rounded text-[10px] font-semibold",
                  node.status === "Healthy" ? "bg-emerald-500/15 text-emerald-400" :
                  String(node.status).includes("Storage") ? "bg-amber-500/15 text-amber-400" :
                  "bg-rose-500/15 text-rose-400"
                )}>
                  {node.status}
                </span>
              </div>
              <div className="text-[11px] text-muted-foreground flex justify-between">
                <span>{node.ip}</span>
                <span>{node.containers} containers</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5">
                    <span>CPU Util</span>
                    <span>{node.cpuUsage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", node.cpuUsage > 80 ? "bg-rose-500" : "bg-sky-400")}
                      style={{ width: `${node.cpuUsage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5">
                    <span>Memory</span>
                    <span>{node.memUsage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", node.memUsage > 80 ? "bg-rose-500" : "bg-primary")}
                      style={{ width: `${node.memUsage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5">
                    <span>Root Disk</span>
                    <span>{node.diskUsage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", node.diskUsage > 85 ? "bg-amber-500" : "bg-muted-foreground")}
                      style={{ width: `${node.diskUsage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Container Inventory & Storage Waste in 2 Columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Container Table (2 cols) */}
        <div className="finops-card p-5 lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">Container Inventory & Cost Attribution</h3>
            <div className="flex items-center gap-1.5">
              {(["all", "running", "zombie", "exited"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setFilter(mode)}
                  className={cn(
                    "px-2.5 py-1 text-xs rounded-lg font-medium capitalize transition",
                    filter === mode
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="border-b border-border/60 text-muted-foreground">
                <tr>
                  <th className="py-2.5 px-3">Container Name</th>
                  <th className="py-2.5 px-3">Image</th>
                  <th className="py-2.5 px-3">Host Node</th>
                  <th className="py-2.5 px-3">CPU / Mem</th>
                  <th className="py-2.5 px-3">Cost/hr</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredContainers.map((c: any) => (
                  <tr key={c.name} className="hover:bg-accent/40 transition">
                    <td className="py-3 px-3 font-mono font-medium text-foreground">{c.name}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-muted-foreground truncate max-w-[150px]">{c.image}</td>
                    <td className="py-3 px-3 text-muted-foreground text-[11px]">{c.host}</td>
                    <td className="py-3 px-3 font-mono">
                      <span>{c.cpu}</span> • <span>{c.mem}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold">${Number(c.costPerHour ?? 0).toFixed(2)}</td>
                    <td className="py-3 px-3 text-muted-foreground">{c.category}</td>
                    <td className="py-3 px-3">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize",
                        c.status === "running" ? "bg-emerald-500/15 text-emerald-400" :
                        c.status === "zombie" ? "bg-rose-500/15 text-rose-400 border border-rose-500/30" :
                        "bg-muted text-muted-foreground"
                      )}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Docker Storage Waste & Prune Actions (1 col) */}
        <div className="finops-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-rose-400" />
            <h3 className="text-sm font-semibold">Storage Bloat & Pruning</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Dangling image layers and orphaned persistent volumes leaking storage costs.
          </p>

          <div className="space-y-3">
            {storageWaste.map((item: any, idx: number) => (
              <div key={idx} className="rounded-xl border border-border/60 bg-card p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">{item.item}</span>
                  <span className="text-xs font-bold text-rose-400">{item.sizeGB} GB</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Count: {item.count}</span>
                  <span>Cost: ${Number(item.costPerMonth ?? 0).toFixed(2)}/mo</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border/40">
                  <span className="font-mono text-[10px] text-muted-foreground">{item.action}</span>
                  <button type="button" className="text-[10px] text-primary hover:underline font-semibold flex items-center gap-1">
                    <Trash2 className="h-3 w-3" /> Prune
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-3 text-xs space-y-1">
            <div className="font-semibold text-primary flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> Auto-Prune Policy
            </div>
            <p className="text-[11px] text-muted-foreground">
              Automated weekly daemon cron will prune unreferenced images older than 14 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
