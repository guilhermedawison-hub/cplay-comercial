import { describe, expect, it } from "vitest";
import { cplayDealStages } from "./config";

describe("cplayDealStages", () => {
  it("mantém a ordem comercial aprovada", () => {
    expect(cplayDealStages.map((stage) => stage.value)).toEqual([
      "novo",
      "contatado",
      "interessado",
      "reuniao",
      "proposta",
      "negociacao",
      "fechado",
      "perdido",
    ]);
  });
});
