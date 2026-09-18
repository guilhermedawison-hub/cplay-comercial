import { DragDropContext, type OnDragEndResponder } from "@hello-pangea/dnd";
import isEqual from "lodash/isEqual";
import { useDataProvider, useListContext, type DataProvider } from "ra-core";
import { useEffect, useState } from "react";

import { useConfigurationContext } from "../root/ConfigurationContext";
import type { Deal } from "../types";
import { DealColumn } from "./DealColumn";
import type { DealsByStage } from "./stages";
import { getDealsByStage } from "./stages";

export const DealListContent = () => {
  const { dealStages } = useConfigurationContext();
  const { data: unorderedDeals, isPending, refetch } = useListContext<Deal>();
  const dataProvider = useDataProvider();

  const [dealsByStage, setDealsByStage] = useState<DealsByStage>(
    getDealsByStage([], dealStages),
  );

  useEffect(() => {
    if (unorderedDeals) {
      const newDealsByStage = getDealsByStage(unorderedDeals, dealStages);
      if (!isEqual(newDealsByStage, dealsByStage)) {
        setDealsByStage(newDealsByStage);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unorderedDeals]);

  if (isPending) return null;

  const onDragEnd: OnDragEndResponder = (result) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceStage = source.droppableId;
    const destinationStage = destination.droppableId;
    const sourceDeal = dealsByStage[sourceStage][source.index]!;
    const destinationDeal = dealsByStage[destinationStage][
      destination.index
    ] ?? {
      stage: destinationStage,
      index: undefined,
    };

    setDealsByStage(
      updateDealStageLocal(
        sourceDeal,
        { stage: sourceStage, index: source.index },
        { stage: destinationStage, index: destination.index },
        dealsByStage,
      ),
    );

    updateDealStage(sourceDeal, destinationDeal, dataProvider).then(() => {
      refetch();
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className="-mx-1 overflow-x-auto pb-3"
        aria-label="Funil de oportunidades"
      >
        <div className="flex min-w-max gap-3 px-1">
          {dealStages.map((stage) => (
            <DealColumn
              stage={stage.value}
              deals={dealsByStage[stage.value]}
              key={stage.value}
            />
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

const updateDealStageLocal = (
  sourceDeal: Deal,
  source: { stage: string; index: number },
  destination: {
    stage: string;
    index?: number;
  },
  dealsByStage: DealsByStage,
) => {
  if (source.stage === destination.stage) {
    const column = dealsByStage[source.stage];
    column.splice(source.index, 1);
    column.splice(destination.index ?? column.length + 1, 0, sourceDeal);
    return {
      ...dealsByStage,
      [destination.stage]: column,
    };
  }

  const sourceColumn = dealsByStage[source.stage];
  const destinationColumn = dealsByStage[destination.stage];
  sourceColumn.splice(source.index, 1);
  destinationColumn.splice(
    destination.index ?? destinationColumn.length + 1,
    0,
    sourceDeal,
  );
  return {
    ...dealsByStage,
    [source.stage]: sourceColumn,
    [destination.stage]: destinationColumn,
  };
};

const updateDealStage = async (
  source: Deal,
  destination: {
    stage: string;
    index?: number;
  },
  dataProvider: DataProvider,
) => {
  if (source.stage === destination.stage) {
    const { data: columnDeals } = await dataProvider.getList("deals", {
      sort: { field: "index", order: "ASC" },
      pagination: { page: 1, perPage: 100 },
      filter: { stage: source.stage },
    });
    const destinationIndex = destination.index ?? columnDeals.length + 1;

    if (source.index > destinationIndex) {
      await Promise.all([
        ...columnDeals
          .filter(
            (deal) =>
              deal.index >= destinationIndex && deal.index < source.index,
          )
          .map((deal) =>
            dataProvider.update("deals", {
              id: deal.id,
              data: { index: deal.index + 1 },
              previousData: deal,
            }),
          ),
        dataProvider.update("deals", {
          id: source.id,
          data: { index: destinationIndex },
          previousData: source,
        }),
      ]);
    } else {
      await Promise.all([
        ...columnDeals
          .filter(
            (deal) =>
              deal.index <= destinationIndex && deal.index > source.index,
          )
          .map((deal) =>
            dataProvider.update("deals", {
              id: deal.id,
              data: { index: deal.index - 1 },
              previousData: deal,
            }),
          ),
        dataProvider.update("deals", {
          id: source.id,
          data: { index: destinationIndex },
          previousData: source,
        }),
      ]);
    }
    return;
  }

  const [{ data: sourceDeals }, { data: destinationDeals }] = await Promise.all(
    [
      dataProvider.getList("deals", {
        sort: { field: "index", order: "ASC" },
        pagination: { page: 1, perPage: 100 },
        filter: { stage: source.stage },
      }),
      dataProvider.getList("deals", {
        sort: { field: "index", order: "ASC" },
        pagination: { page: 1, perPage: 100 },
        filter: { stage: destination.stage },
      }),
    ],
  );
  const destinationIndex = destination.index ?? destinationDeals.length + 1;

  await Promise.all([
    ...sourceDeals
      .filter((deal) => deal.index > source.index)
      .map((deal) =>
        dataProvider.update("deals", {
          id: deal.id,
          data: { index: deal.index - 1 },
          previousData: deal,
        }),
      ),
    ...destinationDeals
      .filter((deal) => deal.index >= destinationIndex)
      .map((deal) =>
        dataProvider.update("deals", {
          id: deal.id,
          data: { index: deal.index + 1 },
          previousData: deal,
        }),
      ),
    dataProvider.update("deals", {
      id: source.id,
      data: {
        index: destinationIndex,
        stage: destination.stage,
      },
      previousData: source,
    }),
  ]);
};
