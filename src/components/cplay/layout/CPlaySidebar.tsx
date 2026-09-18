import {
  Building2,
  ContactRound,
  Gauge,
  Package2,
  Settings,
  Target,
  Tags,
} from "lucide-react";
import { NavLink } from "react-router";

export const cplayNavigationItems = [
  { label: "Dashboard", to: "/", icon: Gauge },
  { label: "Oportunidades", to: "/deals", icon: Target },
  { label: "Contatos", to: "/contacts", icon: ContactRound },
  { label: "Empresas", to: "/companies", icon: Building2 },
  { label: "Produtos/Serviços", to: "/products", icon: Package2 },
  { label: "Origens", to: "/lead_sources", icon: Tags },
  { label: "Configurações", to: "/settings", icon: Settings },
] as const;

export const CPlaySidebar = () => (
  <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
    <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm">
        C
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-sidebar-foreground">
          CPlay Comercial
        </p>
        <p className="text-xs text-muted-foreground">Central comercial</p>
      </div>
    </div>

    <nav
      className="flex-1 space-y-1 px-3 py-4"
      aria-label="Navegação principal"
    >
      {cplayNavigationItems.map(({ label, to, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            [
              "flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
              isActive
                ? "bg-[var(--cplay-primary-subtle)] text-primary"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            ].join(" ")
          }
        >
          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{label}</span>
        </NavLink>
      ))}
    </nav>

    <div className="border-t border-sidebar-border px-4 py-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        CPlay Tech
      </p>
    </div>
  </aside>
);
