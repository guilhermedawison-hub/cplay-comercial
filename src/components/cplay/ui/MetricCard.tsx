import type { ReactNode } from "react";
import { WorkspaceCard } from "./WorkspaceCard";

export const MetricCard = ({
  title,
  value,
  helper,
  icon,
}: {
  title: string;
  value: ReactNode;
  helper?: ReactNode;
  icon?: ReactNode;
}) => (
  <WorkspaceCard className="p-4 sm:p-5">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </div>
        {helper ? (
          <div className="mt-1 text-xs text-muted-foreground">{helper}</div>
        ) : null}
      </div>
      {icon ? (
        <div className="rounded-lg bg-[var(--cplay-primary-subtle)] p-2 text-primary">
          {icon}
        </div>
      ) : null}
    </div>
  </WorkspaceCard>
);
