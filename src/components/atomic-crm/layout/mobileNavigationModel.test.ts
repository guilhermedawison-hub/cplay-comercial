import { describe, expect, it } from "vitest";
import { getMobilePrimaryNavigation } from "./mobileNavigationModel";

describe("mobile primary navigation", () => {
  it("keeps the sales pipeline in the primary mobile destinations", () => {
    expect(getMobilePrimaryNavigation().map((item) => item.href)).toEqual([
      "/",
      "/contacts",
      "/deals",
      "/settings",
    ]);
  });
});
