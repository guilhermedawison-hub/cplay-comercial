import type { ReactNode } from "react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Notification } from "@/components/admin/notification";
import { Error } from "@/components/admin/error";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfigurationLoader } from "@/components/atomic-crm/root/useConfigurationLoader";
import { CPlayHeader } from "./CPlayHeader";
import { CPlaySidebar } from "./CPlaySidebar";

export const CPlayLayout = ({ children }: { children: ReactNode }) => {
  useConfigurationLoader();

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <CPlaySidebar />
      <div className="min-h-dvh lg:pl-[248px]">
        <CPlayHeader />
        <main
          className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8"
          id="main-content"
        >
          <ErrorBoundary FallbackComponent={Error}>
            <Suspense fallback={<Skeleton className="h-12 w-12 rounded-full" />}>
              {children}
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
      <Notification />
    </div>
  );
};
