import { describe, expect, it } from "vitest";
import {
  formatCplayCurrency,
  getActiveStatePresentation,
} from "./resourcePresentation";

describe("CPlay resource presentation", () => {
  it("formats monetary values in BRL", () => {
    expect(formatCplayCurrency(149.9)).toMatch(/149,90/);
  });

  it("exposes textual active and inactive states", () => {
    expect(getActiveStatePresentation(true)).toEqual({
      label: "Ativo",
      tone: "success",
    });
    expect(getActiveStatePresentation(false)).toEqual({
      label: "Inativo",
      tone: "neutral",
    });
  });
});
