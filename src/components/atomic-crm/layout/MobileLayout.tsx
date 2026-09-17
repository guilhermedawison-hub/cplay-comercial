import { Error } from "@/components/admin/error";
import { Notification } from "@/components/admin/notification";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { useConfigurationLoader } from "../root/useConfigurationLoader";
import { MobileNavigation } from "./MobileNavigation";
import { PullToRefresh } from "./PullToRefresh";

export const MobileLayout = ({ children }: { children: ReactNode }) => {
  useConfigurationLoader();

  return (
    <>
      <PullToRefresh />
      <div className="min-h-dvh bg-background pb-24">
        <ErrorBoundary FallbackComponent={Error}>
          <Suspense
            fallback={<Skeleton className="m-4 h-12 w-12 rounded-full" />}
          >
            {children}
          </Suspense>
        </ErrorBoundary>
      </div>
      <MobileNavigation />
      <Notification mobileOffset={{ bottom: "84px" }} />
    </>
  );
};
