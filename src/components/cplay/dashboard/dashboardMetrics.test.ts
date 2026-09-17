import { describe, expect, it } from "vitest";
import type { Deal, Task } from "@/components/atomic-crm/types";
import {
  getClosedThisMonth,
  getOpenDeals,
  getPendingFollowUps,
  getPendingTasks,
  getPotentialAmount,
} from "./dashboardMetrics";

const makeDeal = (overrides: Partial<Deal>): Deal => ({
  id: 1,
  name: "Negócio",
  company_id: 0,
  contact_ids: [],
  category: "",
  stage: "novo",
  description: "",
  amount: 100,
  created_at: "2026-09-01T00:00:00Z",
  updated_at: "2026-09-10T00:00:00Z",
  expected_closing_date: "2026-10-01",
  sales_id: 1,
  index: 0,
  ...overrides,
});

const makeTask = (overrides: Partial<Task>): Task => ({
  id: 1,
  contact_id: 1,
  type: "follow_up",
  text: "Retorno",
  due_date: "2026-09-17T10:00:00Z",
  ...overrides,
});

describe("dashboardMetrics", () => {
  const deals = [
    makeDeal({ id: 1, stage: "novo", amount: 1000, next_follow_up_at: "2026-09-17T09:00:00Z" }),
    makeDeal({ id: 2, stage: "proposta", amount: 2500, next_follow_up_at: "2026-09-18T09:00:00Z" }),
    makeDeal({ id: 3, stage: "fechado", amount: 5000, updated_at: "2026-09-15T12:00:00Z" }),
    makeDeal({ id: 4, stage: "perdido", amount: 700 }),
  ];

  it("calculates open deals and potential amount without closed/lost stages", () => {
    expect(getOpenDeals(deals)).toHaveLength(2);
    expect(getPotentialAmount(deals)).toBe(3500);
  });

  it("counts overdue follow-ups only on open deals", () => {
    expect(getPendingFollowUps(deals, new Date("2026-09-17T12:00:00Z"))).toBe(1);
  });

  it("counts deals closed in the current month", () => {
    expect(getClosedThisMonth(deals, new Date("2026-09-17T12:00:00Z"))).toBe(1);
  });

  it("counts tasks without done_date", () => {
    const tasks = [makeTask({ id: 1 }), makeTask({ id: 2, done_date: "2026-09-17T11:00:00Z" })];
    expect(getPendingTasks(tasks)).toBe(1);
  });
});
