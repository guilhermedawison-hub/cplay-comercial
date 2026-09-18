import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const WorkspaceCard = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <Card
    className={cn(
      "gap-0 rounded-[var(--radius)] border-border/80 bg-card py-0 shadow-none",
      className,
    )}
  >
    {children}
  </Card>
);
