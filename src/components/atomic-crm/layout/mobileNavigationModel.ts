export const getMobilePrimaryNavigation = () =>
  [
    { href: "/", label: "Dashboard" },
    { href: "/contacts", label: "Contatos" },
    { href: "/deals", label: "Oportunidades" },
    { href: "/settings", label: "Configurações" },
  ] as const;
