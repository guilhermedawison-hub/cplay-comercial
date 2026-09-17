import { CancelButton } from "@/components/admin/cancel-button";
import { SaveButton } from "@/components/admin/form";
import { cn } from "@/lib/utils";

export const FormToolbar = ({ className }: { className?: string }) => (
  <div
    role="toolbar"
    className={cn(
      "sticky bottom-0 flex flex-row justify-end gap-2 bg-linear-to-b from-transparent to-card to-10% pb-4 pt-4 md:pb-0",
      className,
    )}
  >
    <CancelButton />
    <SaveButton />
  </div>
);
