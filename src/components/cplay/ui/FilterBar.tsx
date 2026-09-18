import type { ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export const FilterBar = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex flex-wrap items-center gap-2 rounded-[var(--radius)] border border-border/80 bg-card px-3 py-2",
      className,
    )}
  >
    <div className="mr-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
      <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
      Filtros
    </div>
    {children}
  </div>
);
