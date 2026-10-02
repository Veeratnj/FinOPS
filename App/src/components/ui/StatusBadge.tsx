import { cn } from "@/lib/utils";

interface ProviderBadgeProps {
  provider: "AWS" | "GCP" | "Azure";
}

export function ProviderBadge({ provider }: ProviderBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        provider === "AWS" && "provider-aws",
        provider === "GCP" && "provider-gcp",
        provider === "Azure" && "provider-azure"
      )}
    >
      {provider}
    </span>
  );
}

interface StatusBadgeProps {
  status: string;
  variant?: "success" | "warning" | "danger" | "info" | "muted";
}

export function StatusBadge({ status, variant = "muted" }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        variant === "success" && "bg-success/15 text-success",
        variant === "warning" && "bg-warning/15 text-warning",
        variant === "danger" && "bg-destructive/15 text-destructive",
        variant === "info" && "bg-primary/15 text-primary",
        variant === "muted" && "bg-muted text-muted-foreground"
      )}
    >
      {status}
    </span>
  );
}

interface SeverityBadgeProps {
  severity: "Critical" | "High" | "Medium";
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const variant = severity === "Critical" ? "danger" : severity === "High" ? "warning" : "info";
  return <StatusBadge status={severity} variant={variant} />;
}
