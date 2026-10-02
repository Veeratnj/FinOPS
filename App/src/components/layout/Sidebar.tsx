import { NavLink, useLocation } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import {
  LayoutDashboard, 
  Cloud, 
  BarChart3, 
  Layers, 
  Ship, 
  Boxes, 
  Zap, 
  Lightbulb, 
  AlertTriangle,
  FileText, 
  Tag, 
  Users, 
  TrendingUp, 
  CloudLightning, 
  Wallet, 
  ChevronLeft, 
  ChevronRight, 
  Receipt,
  CreditCard, 
  Bot, 
  Cpu,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSubscription } from "@/context/SubscriptionContext";

interface NavGroup {
  groupName: string;
  items: {
    path: string;
    label: string;
    icon: any;
    requiredPlan?: string;
  }[];
}

const navGroups: NavGroup[] = [
  {
    groupName: "Overview",
    items: [
      { path: "/", label: "Dashboard", icon: LayoutDashboard },
      { path: "/multi-cloud", label: "Multi-Cloud (AWS·GCP·Azure)", icon: Cloud },
      { path: "/cost-analyzer", label: "Cost Analyzer", icon: BarChart3 },
    ],
  },
  {
    groupName: "AI Intelligence",
    items: [
      { path: "/agent-ops", label: "Agent Ops", icon: Bot },
      { path: "/token-ops", label: "Token-OPS", icon: Cpu },
      { path: "/llm-ops", label: "LLM Ops", icon: Layers },
    ],
  },
  {
    groupName: "Compute & Silicon",
    items: [
      { path: "/hardware-orchestration", label: "Hardware (GPU·MPU·CPU·LPU)", icon: Zap },
      { path: "/kubernetes", label: "Kubernetes", icon: Ship },
      { path: "/docker", label: "Docker Fleet", icon: Boxes },
    ],
  },
  {
    groupName: "Cost Optimization",
    items: [
      { path: "/recommendations", label: "Recommendations", icon: Lightbulb },
      { path: "/anomalies", label: "Anomalies", icon: AlertTriangle },
      { path: "/cost-allocation", label: "Cost Allocation", icon: Users, requiredPlan: "platform-plus" },
      { path: "/unit-economics", label: "Unit Economics", icon: TrendingUp, requiredPlan: "platform" },
      { path: "/forecasting", label: "Forecasting", icon: CloudLightning, requiredPlan: "platform-plus" },
      { path: "/budgeting", label: "Budgeting", icon: Wallet, requiredPlan: "platform" },
      { path: "/categories", label: "Categories", icon: Layers },
      { path: "/virtual-tags", label: "Virtual Tags", icon: Tag },
      { path: "/reports", label: "Reports", icon: FileText },
    ],
  },
  {
    groupName: "Billing & Plans",
    items: [
      { path: "/plans-billing", label: "Plans & Billing", icon: CreditCard },
      { path: "/payment-receipts", label: "Payment Receipts", icon: Receipt },
    ],
  },
];

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppContext();
  const location = useLocation();
  const { selectedPlan } = useSubscription();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-full flex-col border-r border-sidebar-border bg-[hsl(var(--sidebar-background))] text-sidebar-foreground shadow-[0_0_30px_rgba(0,0,0,0.35)] transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-3">
        {sidebarOpen ? (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <LayoutDashboard size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold tracking-[0.2em] text-primary uppercase leading-tight">Seynova</span>
              <span className="text-[9px] tracking-wider text-muted-foreground uppercase">AI FinOps Platform</span>
            </div>
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <LayoutDashboard size={16} />
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground transition hover:bg-primary/15 hover:text-primary"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 space-y-4 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {sidebarOpen && (
              <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {group.groupName}
              </div>
            )}
            {group.items.map((item) => {
              const isActive = location.pathname === item.path;
              const isLocked = item.requiredPlan && item.requiredPlan !== selectedPlan;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={!sidebarOpen ? item.label : undefined}
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(124,255,0,0.22)] font-semibold"
                      : isLocked
                        ? "cursor-not-allowed opacity-40 text-muted-foreground"
                        : "text-sidebar-foreground hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]"
                  )}
                >
                  <item.icon size={16} className="shrink-0" />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                  {isLocked && sidebarOpen && (
                    <Lock size={12} className="ml-auto text-primary" />
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
