import { AlertCircle, CheckCircle2, Clock3, CircleDashed } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatusBadgeTone = "neutral" | "success" | "warning" | "danger";

const toneClasses: Record<StatusBadgeTone, string> = {
  neutral: "border-border bg-muted/60 text-muted-foreground",
  success: "border-[color:var(--cplay-success)]/20 bg-[color:var(--cplay-success)]/10 text-[color:var(--cplay-success)]",
  warning: "border-[color:var(--cplay-warning)]/20 bg-[color:var(--cplay-warning)]/10 text-[color:var(--cplay-warning)]",
  danger: "border-[color:var(--cplay-danger)]/20 bg-[color:var(--cplay-danger)]/10 text-[color:var(--cplay-danger)]",
};

const icons = {
  neutral: CircleDashed,
  success: CheckCircle2,
  warning: Clock3,
  danger: AlertCircle,
};

export const StatusBadge = ({
  label,
  tone = "neutral",
  className,
}: {
  label: string;
  tone?: StatusBadgeTone;
  className?: string;
}) => {
  const Icon = icons[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
};
