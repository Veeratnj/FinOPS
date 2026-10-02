import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  subtitle?: string;
  children?: React.ReactNode;
}

export function KPICard({ title, value, change, icon: Icon, subtitle, children }: KPICardProps) {
  return (
    <div className="finops-card-hover p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tabular-nums">{value}</p>
          {change !== undefined && (
            <div className={cn("flex items-center gap-1 text-xs font-medium", change > 0 ? "trend-up" : "trend-down")}>
              {change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{change > 0 ? "+" : ""}{change.toFixed(1)}%</span>
            </div>
          )}
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="rounded-lg bg-primary/10 p-2.5">
          <Icon size={20} className="text-primary" />
        </div>
      </div>
      {children}
    </div>
  );
}
