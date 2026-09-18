import { describe, expect, it } from "vitest";
import { authLanguageOptions } from "./AuthLanguageSelector";

describe("AuthLanguageSelector", () => {
  it("offers pt-BR as the first language and keeps en/fr available", () => {
    expect(authLanguageOptions).toEqual([
      { value: "pt-BR", label: "Português (Brasil)" },
      { value: "en", label: "English" },
      { value: "fr", label: "Français" },
    ]);
  });
});
