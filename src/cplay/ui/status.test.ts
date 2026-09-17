import { describe, expect, it } from "vitest";
import { getFollowUpVisualState } from "./status";

describe("getFollowUpVisualState", () => {
  const now = new Date("2026-09-17T12:00:00Z");

  it("returns missing when there is no valid follow-up", () => {
    expect(getFollowUpVisualState(null, now)).toBe("missing");
    expect(getFollowUpVisualState("not-a-date", now)).toBe("missing");
  });

  it("distinguishes overdue, due-soon and scheduled follow-ups", () => {
    expect(getFollowUpVisualState("2026-09-17T10:00:00Z", now)).toBe("overdue");
    expect(getFollowUpVisualState("2026-09-17T18:00:00Z", now)).toBe(
      "due-soon",
    );
    expect(getFollowUpVisualState("2026-09-19T12:00:00Z", now)).toBe(
      "scheduled",
    );
  });
});
