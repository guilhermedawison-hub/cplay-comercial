import { describe, expect, it } from "vitest";
import { normalizeDealFormData } from "./normalizeDealFormData";

describe("normalizeDealFormData", () => {
  it("turns empty optional deal values into null", () => {
    expect(
      normalizeDealFormData({
        company_id: "",
        lead_source_id: "",
        next_follow_up_at: "",
        next_follow_up_type: "",
        next_follow_up_note: "",
      }),
    ).toEqual({
      company_id: null,
      lead_source_id: null,
      next_follow_up_at: null,
      next_follow_up_type: null,
      next_follow_up_note: null,
    });
  });

  it("preserves populated values", () => {
    expect(
      normalizeDealFormData({
        company_id: 10,
        lead_source_id: 20,
        next_follow_up_at: "2026-09-18T14:00:00.000Z",
        next_follow_up_type: "whatsapp",
        next_follow_up_note: "Retornar proposta",
      }),
    ).toEqual({
      company_id: 10,
      lead_source_id: 20,
      next_follow_up_at: "2026-09-18T14:00:00.000Z",
      next_follow_up_type: "whatsapp",
      next_follow_up_note: "Retornar proposta",
    });
  });
});
