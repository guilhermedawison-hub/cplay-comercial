import { useQueryClient } from "@tanstack/react-query";
import {
  Form,
  useDataProvider,
  useGetIdentity,
  useListContext,
  useRedirect,
} from "ra-core";
import { Create } from "@/components/admin/create";
import { SaveButton } from "@/components/admin/form";
import { FormToolbar } from "@/components/admin/simple-form";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Deal } from "../types";
import { DealInputs } from "./DealInputs";
import { normalizeDealFormData } from "./normalizeDealFormData";

export const DealCreate = ({ open }: { open: boolean }) => {
  const redirect = useRedirect();
  const dataProvider = useDataProvider();
  const { data: allDeals } = useListContext<Deal>();
  const { identity, isPending } = useGetIdentity();
  const queryClient = useQueryClient();

  const handleClose = () => {
    redirect("/deals");
  };

  const onSuccess = async (deal: Deal) => {
    const deals = (allDeals ?? []).filter(
      (d: Deal) => d.stage === deal.stage && d.id !== deal.id,
    );

    await Promise.all(
      deals.map(async (oldDeal) =>
        dataProvider.update("deals", {
          id: oldDeal.id,
          data: { index: oldDeal.index + 1 },
          previousData: oldDeal,
        }),
      ),
    );

    const querySnapshot = queryClient
      .getQueryCache()
      .getAll()
      .map((query) => ({
        key: query.queryKey,
        status: query.state.status,
        fetchStatus: query.state.fetchStatus,
        dataUpdatedAt: query.state.dataUpdatedAt,
        dataLength:
          Array.isArray((query.state.data as { data?: unknown[] } | undefined)?.data)
            ? (query.state.data as { data: unknown[] }).data.length
            : undefined,
      }));

    console.info("CPLAY_DEALS_QUERY_SNAPSHOT", JSON.stringify(querySnapshot));

    await queryClient.resetQueries({
      queryKey: ["deals", "getList"],
    });

    const postResetSnapshot = queryClient
      .getQueryCache()
      .getAll()
      .map((query) => ({
        key: query.queryKey,
        status: query.state.status,
        fetchStatus: query.state.fetchStatus,
        dataUpdatedAt: query.state.dataUpdatedAt,
        dataLength:
          Array.isArray((query.state.data as { data?: unknown[] } | undefined)?.data)
            ? (query.state.data as { data: unknown[] }).data.length
            : undefined,
      }));

    console.info(
      "CPLAY_DEALS_QUERY_POST_RESET",
      JSON.stringify(postResetSnapshot),
    );

    redirect("/deals");
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto p-0 sm:max-w-3xl lg:max-w-4xl">
        <div className="sticky top-0 z-10 border-b bg-background/95 px-5 py-4 backdrop-blur sm:px-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Nova oportunidade
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Cadastre o negócio, defina responsável, etapa e próximo follow-up.
            </p>
          </DialogHeader>
        </div>

        <div className="px-5 pb-6 pt-5 sm:px-6">
          {isPending || !identity ? (
            <Skeleton className="h-56 w-full rounded-xl" />
          ) : (
            <Create
              resource="deals"
              transform={normalizeDealFormData}
              mutationOptions={{ onSuccess }}
            >
              <Form
                key={String(identity.id)}
                defaultValues={{
                  sales_id: identity.id,
                  stage: "novo",
                  expected_closing_date: new Date().toISOString().split("T")[0],
                  contact_ids: [],
                  index: 0,
                }}
              >
                <DealInputs />
                <FormToolbar className="mt-5 border-t border-border/70 pt-4">
                  <SaveButton />
                </FormToolbar>
              </Form>
            </Create>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
