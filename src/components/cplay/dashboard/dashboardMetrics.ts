import type { Deal, Task } from "@/components/atomic-crm/types";

const closedStages = new Set(["fechado"]);
const lostStages = new Set(["perdido"]);

export const getOpenDeals = (deals: Deal[]) =>
  deals.filter(
    (deal) => !closedStages.has(deal.stage) && !lostStages.has(deal.stage),
  );

export const getPotentialAmount = (deals: Deal[]) =>
  getOpenDeals(deals).reduce((total, deal) => total + Number(deal.amount || 0), 0);

export const getPendingFollowUps = (deals: Deal[], now = new Date()) =>
  getOpenDeals(deals).filter((deal) => {
    if (!deal.next_follow_up_at) return false;
    const followUp = new Date(deal.next_follow_up_at);
    return !Number.isNaN(followUp.getTime()) && followUp.getTime() <= now.getTime();
  }).length;

export const getClosedThisMonth = (deals: Deal[], now = new Date()) => {
  const year = now.getFullYear();
  const month = now.getMonth();

  return deals.filter((deal) => {
    if (!closedStages.has(deal.stage)) return false;
    const updatedAt = new Date(deal.updated_at);
    return (
      !Number.isNaN(updatedAt.getTime()) &&
      updatedAt.getFullYear() === year &&
      updatedAt.getMonth() === month
    );
  }).length;
};

export const getPendingTasks = (tasks: Task[]) =>
  tasks.filter((task) => !task.done_date).length;
