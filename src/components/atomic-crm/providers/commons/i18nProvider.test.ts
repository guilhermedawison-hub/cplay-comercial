import { describe, expect, it } from "vitest";
import { getInitialLocale, i18nProvider } from "./i18nProvider";

describe("i18nProvider", () => {
  it("registers pt-BR, en and fr locales", () => {
    expect(i18nProvider.getLocales?.()).toEqual([
      { locale: "pt-BR", name: "Português (Brasil)" },
      { locale: "en", name: "English" },
      { locale: "fr", name: "Français" },
    ]);
  });

  it("translates the language key in french", async () => {
    await i18nProvider.changeLocale("fr");

    expect(i18nProvider.translate("crm.language")).toBe("Langue");
  });

  it("falls back to english for unknown locales", async () => {
    await i18nProvider.changeLocale("es");

    expect(i18nProvider.translate("crm.language")).toBe("Language");
  });

  it("uses customized password reset overrides for en and fr", async () => {
    await i18nProvider.changeLocale("en");
    expect(i18nProvider.translate("ra-supabase.auth.password_reset")).toBe(
      "Check your emails for a Reset Password message.",
    );

    await i18nProvider.changeLocale("fr");
    expect(i18nProvider.translate("ra-supabase.auth.password_reset")).toBe(
      "Consultez vos emails pour trouver le message de reinitialisation du mot de passe.",
    );
  });

  it("translates recently added fr crm keys", async () => {
    await i18nProvider.changeLocale("fr");

    expect(i18nProvider.translate("resources.deals.empty.title")).toBe(
      "Aucune affaire trouvée",
    );
  });

  it("translates the CPlay authentication flow in pt-BR", async () => {
    await i18nProvider.changeLocale("pt-BR");

    expect(i18nProvider.translate("crm.auth.welcome_title")).toBe(
      "Bem-vindo ao CPlay Comercial",
    );
    expect(i18nProvider.translate("crm.auth.signup.create_first_user")).toBe(
      "Crie a primeira conta de usuário para concluir a configuração.",
    );
    expect(i18nProvider.translate("crm.auth.first_name")).toBe("Nome");
    expect(i18nProvider.translate("crm.auth.last_name")).toBe("Sobrenome");
    expect(i18nProvider.translate("ra.auth.email")).toBe("E-mail");
    expect(i18nProvider.translate("ra.auth.password")).toBe("Senha");
    expect(i18nProvider.translate("crm.auth.signup.create_account")).toBe(
      "Criar conta",
    );
  });

  it("uses pt-BR as the CPlay initial locale", () => {
    expect(getInitialLocale()).toBe("pt-BR");
  });
});
