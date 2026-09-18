import { Languages } from "lucide-react";
import { useLocaleState, useTranslate } from "ra-core";

export const authLanguageOptions = [
  { value: "pt-BR", label: "Português (Brasil)" },
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
] as const;

export const AuthLanguageSelector = () => {
  const [locale, setLocale] = useLocaleState();
  const translate = useTranslate();

  return (
    <label className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/90 px-3 py-2 text-sm shadow-sm backdrop-blur">
      <Languages className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <span className="sr-only">{translate("crm.language")}</span>
      <select
        aria-label={translate("crm.language")}
        className="cursor-pointer bg-transparent text-sm font-medium outline-none"
        value={locale}
        onChange={(event) => setLocale(event.target.value)}
      >
        {authLanguageOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};
