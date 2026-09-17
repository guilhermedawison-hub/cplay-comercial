import { BriefcaseBusiness, CircleDollarSign, Clock3, Trophy } from "lucide-react";
import { useGetList } from "ra-core";
import type { Deal, Task } from "@/components/atomic-crm/types";
import { DashboardActivityLog } from "@/components/atomic-crm/dashboard/DashboardActivityLog";
import { TasksList } from "@/components/atomic-crm/dashboard/TasksList";
import { DealsPipeline } from "@/components/atomic-crm/dashboard/DealsPipeline";
import { MetricCard } from "@/components/cplay/ui/MetricCard";
import { WorkspaceCard } from "@/components/cplay/ui/WorkspaceCard";
import {
  getClosedThisMonth,
  getOpenDeals,
  getPendingFollowUps,
  getPendingTasks,
  getPotentialAmount,
} from "./dashboardMetrics";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);

export const CPlayDashboard = () => {
  const { data: deals = [], isPending: dealsPending } = useGetList<Deal>("deals", {
    pagination: { page: 1, perPage: 500 },
    sort: { field: "updated_at", order: "DESC" },
  });

  const { data: tasks = [], isPending: tasksPending } = useGetList<Task>("tasks", {
    pagination: { page: 1, perPage: 500 },
    sort: { field: "due_date", order: "ASC" },
  });

  const loading = dealsPending || tasksPending;
  const openDeals = getOpenDeals(deals);
  const potentialAmount = getPotentialAmount(deals);
  const pendingFollowUps = getPendingFollowUps(deals);
  const closedThisMonth = getClosedThisMonth(deals);
  const pendingTasks = getPendingTasks(tasks);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Visão comercial</h2>
        <p className="text-sm text-muted-foreground">
          Acompanhe pipeline, valor potencial e próximos movimentos da operação.
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores comerciais">
        <MetricCard
          title="Oportunidades abertas"
          value={loading ? "…" : openDeals.length}
          helper="Em etapas comerciais ativas"
          icon={<BriefcaseBusiness className="h-5 w-5" aria-hidden="true" />}
        />
        <MetricCard
          title="Valor potencial"
          value={loading ? "…" : formatCurrency(potentialAmount)}
          helper="Soma das oportunidades em aberto"
          icon={<CircleDollarSign className="h-5 w-5" aria-hidden="true" />}
        />
        <MetricCard
          title="Follow-ups pendentes"
          value={loading ? "…" : pendingFollowUps}
          helper={`${pendingTasks} tarefa${pendingTasks === 1 ? "" : "s"} pendente${pendingTasks === 1 ? "" : "s"}`}
          icon={<Clock3 className="h-5 w-5" aria-hidden="true" />}
        />
        <MetricCard
          title="Fechados no período"
          value={loading ? "…" : closedThisMonth}
          helper="Fechamentos registrados no mês atual"
          icon={<Trophy className="h-5 w-5" aria-hidden="true" />}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)]">
        <div className="space-y-6">
          <WorkspaceCard className="p-4 sm:p-5">
            <div className="mb-4">
              <p className="text-sm font-semibold">Pipeline</p>
              <p className="text-xs text-muted-foreground">Oportunidades priorizadas por etapa comercial.</p>
            </div>
            <DealsPipeline />
          </WorkspaceCard>

          <WorkspaceCard className="p-4 sm:p-5">
            <div className="mb-4">
              <p className="text-sm font-semibold">Atividade recente</p>
              <p className="text-xs text-muted-foreground">Histórico recente da operação comercial.</p>
            </div>
            <DashboardActivityLog />
          </WorkspaceCard>
        </div>

        <WorkspaceCard className="p-4 sm:p-5">
          <div className="mb-4">
            <p className="text-sm font-semibold">Próximas ações</p>
            <p className="text-xs text-muted-foreground">Tarefas e retornos que exigem atenção.</p>
          </div>
          <TasksList />
        </WorkspaceCard>
      </section>
    </div>
  );
};
