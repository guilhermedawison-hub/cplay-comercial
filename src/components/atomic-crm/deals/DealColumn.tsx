import { Droppable } from "@hello-pangea/dnd";

import { useConfigurationContext } from "../root/ConfigurationContext";
import type { Deal } from "../types";
import { findDealLabel } from "./dealUtils";
import { DealCard } from "./DealCard";

export const DealColumn = ({
  stage,
  deals,
}: {
  stage: string;
  deals: Deal[];
}) => {
  const totalAmount = deals.reduce((sum, deal) => sum + Number(deal.amount || 0), 0);
  const { dealStages, currency } = useConfigurationContext();

  return (
    <section className="w-[290px] shrink-0 pb-6" aria-label={findDealLabel(dealStages, stage)}>
      <div className="mb-2 rounded-xl border border-border/70 bg-muted/35 px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {findDealLabel(dealStages, stage)}
          </h3>
          <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-background px-2 py-0.5 text-xs font-semibold text-muted-foreground ring-1 ring-border/70">
            {deals.length}
          </span>
        </div>
        <p className="mt-1 text-xs font-medium text-muted-foreground">
          {totalAmount.toLocaleString("pt-BR", {
            notation: "compact",
            style: "currency",
            currency,
            currencyDisplay: "narrowSymbol",
            maximumFractionDigits: 1,
          })}
        </p>
      </div>

      <Droppable droppableId={stage}>
        {(droppableProvided, snapshot) => (
          <div
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
            className={`flex min-h-24 flex-col gap-2 rounded-xl p-1 transition-colors ${
              snapshot.isDraggingOver ? "bg-[var(--cplay-primary-subtle)]" : "bg-transparent"
            }`}
          >
            {deals.map((deal, index) => (
              <DealCard key={deal.id} deal={deal} index={index} />
            ))}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </section>
  );
};
