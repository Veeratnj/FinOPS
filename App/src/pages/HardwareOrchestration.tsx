import { useState, useEffect } from "react";
import { 
  Cpu, 
  Zap, 
  Flame, 
  Thermometer, 
  TrendingDown, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Server,
  DollarSign,
  Activity,
  Gauge,
  Sparkles
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie, 
  LineChart, 
  Line, 
  CartesianGrid 
} from "recharts";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";
import { PageSkeleton } from "@/components/ui/Skeletons";

export default function HardwareOrchestration() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"gpu" | "mpu" | "cpu" | "lpu">("gpu");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/fakedata.json");
        const json = await res.json();
        setData(json.hardwareOrchestration);
      } catch (e) {
        console.error("Failed to load hardware orchestration data", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !data) return <PageSkeleton />;

  const { summary, accelerators, recommendations } = data;
  const currentCategory = accelerators[activeTab];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Hardware Orchestration</h1>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              AI Silicon Engine
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Silicon-level cost, telemetry, and compute utilization across GPUs, MPUs/TPUs, CPUs, and LPUs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Telemetry: Live (DCGM / Prometheus)
          </span>
        </div>
      </div>

      {/* Top Summary Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="finops-card p-5">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Accelerators</span>
            <Server className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold">{summary.totalAccelerators} Units</div>
          <div className="mt-1 flex items-center gap-2 text-xs">
            <span className="text-emerald-400 font-medium">{summary.activeCount} Active</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-rose-400 font-medium">{summary.idleCount} Idle / Zombie</span>
          </div>
        </div>

        <div className="finops-card p-5">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Compute Utilization</span>
            <Gauge className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold">{summary.avgComputeUtilization}%</div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div 
              className="h-full bg-sky-400 rounded-full transition-all" 
              style={{ width: `${summary.avgComputeUtilization}%` }} 
            />
          </div>
        </div>

        <div className="finops-card p-5">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Hourly Run Rate</span>
            <DollarSign className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold">${summary.totalHourlyBurn.toFixed(2)}/hr</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Monthly est: {formatCurrency(summary.monthlyHardwareSpend)}
          </div>
        </div>

        <div className="finops-card p-5 border-primary/20 bg-primary/[0.03]">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-primary">Optimization Opportunity</span>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-primary">{formatCurrency(summary.potentialMonthlySavings)}/mo</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Via idle shutdown & LPU/ARM arbitrage
          </div>
        </div>
      </div>

      {/* Hardware Architecture Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border/60 pb-3">
        {[
          { id: "gpu", label: "GPU (NVIDIA)", icon: Zap, sub: "H100 · A100 · L40S" },
          { id: "mpu", label: "MPU / TPU (Google)", icon: Layers, sub: "TPU v5e · v4 Pods" },
          { id: "cpu", label: "CPU Compute (ARM/x86)", icon: Cpu, sub: "Graviton4 · EPYC" },
          { id: "lpu", label: "LPU (Groq)", icon: Activity, sub: "Deterministic Inference" },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 border",
                isActive 
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_rgba(124,255,0,0.2)]"
                  : "border-border/60 bg-card hover:bg-accent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <div className="text-left">
                <div className="leading-tight">{tab.label}</div>
                <div className={cn("text-[10px] opacity-75", isActive ? "text-primary-foreground" : "text-muted-foreground")}>
                  {tab.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Tab Silicon Deep-Dive */}
      {activeTab === "gpu" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="finops-card p-4">
              <div className="text-xs text-muted-foreground">Total VRAM Deployed</div>
              <div className="text-xl font-bold mt-1">
                {currentCategory.overview.allocatedVRAM_GB} / {currentCategory.overview.totalVRAM_GB} GB
              </div>
              <div className="text-xs text-emerald-400 mt-0.5">
                {((currentCategory.overview.allocatedVRAM_GB / currentCategory.overview.totalVRAM_GB) * 100).toFixed(1)}% VRAM Allocation
              </div>
            </div>
            <div className="finops-card p-4">
              <div className="text-xs text-muted-foreground">Avg Streaming Multiprocessor (SM)</div>
              <div className="text-xl font-bold mt-1">{currentCategory.overview.avgUtilization}%</div>
              <div className="text-xs text-muted-foreground mt-0.5">NVIDIA DCGM Telemetry</div>
            </div>
            <div className="finops-card p-4">
              <div className="text-xs text-muted-foreground">GPU Cluster Burn Rate</div>
              <div className="text-xl font-bold mt-1">${currentCategory.overview.hourlyCost.toFixed(2)}/hr</div>
              <div className="text-xs text-muted-foreground mt-0.5">{currentCategory.overview.count} GPUs Provisioned</div>
            </div>
          </div>

          {/* GPU Device Table */}
          <div className="finops-card p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center justify-between">
              <span>Active NVIDIA Accelerator Fleet</span>
              <span className="text-xs text-muted-foreground font-normal">Auto-polled every 10s</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-border/60 text-muted-foreground">
                  <tr>
                    <th className="py-2.5 px-3">Device ID</th>
                    <th className="py-2.5 px-3">Silicon Architecture</th>
                    <th className="py-2.5 px-3">Cluster</th>
                    <th className="py-2.5 px-3">SM Util</th>
                    <th className="py-2.5 px-3">VRAM (Alloc/Max)</th>
                    <th className="py-2.5 px-3">Temp / Power</th>
                    <th className="py-2.5 px-3">Cost/hr</th>
                    <th className="py-2.5 px-3">Active Workload</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {currentCategory.devices.map((device: any) => (
                    <tr key={device.id} className="hover:bg-accent/40 transition">
                      <td className="py-3 px-3 font-mono font-medium text-foreground">{device.id}</td>
                      <td className="py-3 px-3">{device.type}</td>
                      <td className="py-3 px-3 text-muted-foreground">{device.cluster}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="w-7 font-mono">{device.smUtil}%</span>
                          <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full",
                                device.smUtil > 80 ? "bg-rose-500" : device.smUtil > 40 ? "bg-emerald-500" : "bg-amber-500"
                              )} 
                              style={{ width: `${device.smUtil}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        {device.vramAllocatedGB}GB / {device.vramTotalGB}GB
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span className="flex items-center gap-0.5"><Thermometer className="h-3 w-3" /> {device.tempC}°C</span>
                          <span>•</span>
                          <span>{device.powerW}W</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold">${device.costPerHour.toFixed(2)}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-primary">{device.model}</td>
                      <td className="py-3 px-3">
                        <span className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          device.status.includes("Saturated") ? "bg-amber-500/15 text-amber-400" :
                          device.status.includes("Idle") ? "bg-rose-500/15 text-rose-400 border border-rose-500/30" :
                          device.status.includes("Underutilized") ? "bg-yellow-500/15 text-yellow-400" :
                          "bg-emerald-500/15 text-emerald-400"
                        )}>
                          {device.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "mpu" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="finops-card p-4">
              <div className="text-xs text-muted-foreground">TPU Pod Slices Active</div>
              <div className="text-xl font-bold mt-1">{currentCategory.overview.podSlices} Slices ({currentCategory.overview.count} Chips)</div>
              <div className="text-xs text-emerald-400 mt-0.5">Google Cloud TPU v4 & v5e</div>
            </div>
            <div className="finops-card p-4">
              <div className="text-xs text-muted-foreground">Matrix Multiply Unit (MXU) Duty Cycle</div>
              <div className="text-xl font-bold mt-1">{currentCategory.overview.avgUtilization}%</div>
              <div className="text-xs text-muted-foreground mt-0.5">Bfloat16 / Int8 Matrix Operations</div>
            </div>
            <div className="finops-card p-4">
              <div className="text-xs text-muted-foreground">TPU Hourly Cost</div>
              <div className="text-xl font-bold mt-1">${currentCategory.overview.hourlyCost.toFixed(2)}/hr</div>
              <div className="text-xs text-muted-foreground mt-0.5">Committed Use Discount Applied</div>
            </div>
          </div>

          <div className="finops-card p-5">
            <h3 className="text-sm font-semibold mb-4">Google Cloud TPU Pod Slices</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-border/60 text-muted-foreground">
                  <tr>
                    <th className="py-2.5 px-3">Slice ID</th>
                    <th className="py-2.5 px-3">TPU Generation</th>
                    <th className="py-2.5 px-3">Region</th>
                    <th className="py-2.5 px-3">MXU Duty Cycle</th>
                    <th className="py-2.5 px-3">HBM Bandwidth</th>
                    <th className="py-2.5 px-3">Rate</th>
                    <th className="py-2.5 px-3">Workload</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {currentCategory.devices.map((device: any) => (
                    <tr key={device.id} className="hover:bg-accent/40 transition">
                      <td className="py-3 px-3 font-mono font-medium text-foreground">{device.id}</td>
                      <td className="py-3 px-3">{device.type}</td>
                      <td className="py-3 px-3 text-muted-foreground">{device.region}</td>
                      <td className="py-3 px-3 font-mono font-semibold text-emerald-400">{device.mxuDutyCycle}%</td>
                      <td className="py-3 px-3">{device.hbmThroughputGBs} GB/s</td>
                      <td className="py-3 px-3 font-semibold">${device.costPerHour.toFixed(2)}/hr</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-primary">{device.workload}</td>
                      <td className="py-3 px-3">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-400 px-2 py-0.5 font-semibold text-[10px]">
                          {device.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "cpu" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="finops-card p-4">
              <div className="text-xs text-muted-foreground">Total Managed Cores</div>
              <div className="text-xl font-bold mt-1">{currentCategory.overview.totalCores} vCPUs</div>
              <div className="text-xs text-sky-400 mt-0.5">{currentCategory.overview.architectureBreakdown}</div>
            </div>
            <div className="finops-card p-4">
              <div className="text-xs text-muted-foreground">Avg Core Saturation</div>
              <div className="text-xl font-bold mt-1">{currentCategory.overview.avgUtilization}%</div>
              <div className="text-xs text-muted-foreground mt-0.5">Tokenization & Vector Embedding Nodes</div>
            </div>
            <div className="finops-card p-4">
              <div className="text-xs text-muted-foreground">CPU Compute Hourly Spend</div>
              <div className="text-xl font-bold mt-1">${currentCategory.overview.hourlyCost.toFixed(2)}/hr</div>
              <div className="text-xs text-muted-foreground mt-0.5">High Efficiency Graviton Instances</div>
            </div>
          </div>

          <div className="finops-card p-5">
            <h3 className="text-sm font-semibold mb-4">Compute Pools (ARM vs x86)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-border/60 text-muted-foreground">
                  <tr>
                    <th className="py-2.5 px-3">Pool ID</th>
                    <th className="py-2.5 px-3">Architecture & Type</th>
                    <th className="py-2.5 px-3">vCPU Cores</th>
                    <th className="py-2.5 px-3">Utilization</th>
                    <th className="py-2.5 px-3">RAM</th>
                    <th className="py-2.5 px-3">Cost/hr</th>
                    <th className="py-2.5 px-3">Dedicated Role</th>
                    <th className="py-2.5 px-3">Efficiency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {currentCategory.devices.map((device: any) => (
                    <tr key={device.id} className="hover:bg-accent/40 transition">
                      <td className="py-3 px-3 font-mono font-medium">{device.id}</td>
                      <td className="py-3 px-3">{device.type}</td>
                      <td className="py-3 px-3 font-mono">{device.cores} Cores</td>
                      <td className="py-3 px-3 font-mono">{device.utilization}%</td>
                      <td className="py-3 px-3">{device.memoryGB} GB</td>
                      <td className="py-3 px-3 font-semibold">${device.costPerHour.toFixed(2)}</td>
                      <td className="py-3 px-3 text-muted-foreground">{device.role}</td>
                      <td className="py-3 px-3">
                        <span className="rounded-full bg-sky-500/15 text-sky-400 px-2 py-0.5 font-semibold text-[10px]">
                          {device.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "lpu" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="finops-card p-4">
              <div className="text-xs text-muted-foreground">Deterministic Throughput</div>
              <div className="text-xl font-bold mt-1 text-emerald-400">{currentCategory.overview.avgTokensPerSec} Tok/s</div>
              <div className="text-xs text-muted-foreground mt-0.5">Zero-jitter generation speed</div>
            </div>
            <div className="finops-card p-4">
              <div className="text-xs text-muted-foreground">On-Chip SRAM Interconnect</div>
              <div className="text-xl font-bold mt-1">{currentCategory.overview.sramBandwidthTBps} TB/s</div>
              <div className="text-xs text-muted-foreground mt-0.5">Direct silicon memory bus</div>
            </div>
            <div className="finops-card p-4">
              <div className="text-xs text-muted-foreground">Cost per Million Tokens</div>
              <div className="text-xl font-bold mt-1 text-primary">$0.08 / 1M tokens</div>
              <div className="text-xs text-emerald-400 mt-0.5">70% cheaper than traditional GPU inference</div>
            </div>
          </div>

          <div className="finops-card p-5">
            <h3 className="text-sm font-semibold mb-4">Groq LPU Acceleration Cluster</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-border/60 text-muted-foreground">
                  <tr>
                    <th className="py-2.5 px-3">Node ID</th>
                    <th className="py-2.5 px-3">Architecture</th>
                    <th className="py-2.5 px-3">Target Model</th>
                    <th className="py-2.5 px-3">Throughput</th>
                    <th className="py-2.5 px-3">Time-to-First-Token</th>
                    <th className="py-2.5 px-3">Cost / 1M Tokens</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {currentCategory.devices.map((device: any) => (
                    <tr key={device.id} className="hover:bg-accent/40 transition">
                      <td className="py-3 px-3 font-mono font-medium">{device.id}</td>
                      <td className="py-3 px-3">{device.type}</td>
                      <td className="py-3 px-3 font-mono text-primary">{device.targetModel}</td>
                      <td className="py-3 px-3 font-semibold text-emerald-400">{device.throughputTokSec} tok/s</td>
                      <td className="py-3 px-3 font-mono">{device.latencyFirstTokenMs} ms</td>
                      <td className="py-3 px-3 font-bold">${device.costPerMillionTokens}</td>
                      <td className="py-3 px-3">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-400 px-2 py-0.5 font-semibold text-[10px]">
                          {device.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Hardware Optimization Recommendations */}
      <div className="finops-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Silicon Optimization Guardrails</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {recommendations.map((rec: any, idx: number) => (
            <div key={idx} className="rounded-xl border border-border/60 bg-card p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-foreground">{rec.type}</span>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full",
                    rec.severity === "High" ? "bg-rose-500/15 text-rose-400" :
                    rec.severity === "Medium" ? "bg-amber-500/15 text-amber-400" :
                    "bg-sky-500/15 text-sky-400"
                  )}>
                    {rec.severity} Impact
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {rec.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Savings:</span>
                <span className="text-xs font-bold text-primary">{rec.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
