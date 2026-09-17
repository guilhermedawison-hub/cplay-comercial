import { RefreshButton } from "@/components/admin/refresh-button";
import { ThemeModeToggle } from "@/components/admin/theme-mode-toggle";
import { UserMenu } from "@/components/admin/user-menu";
import { useLocation } from "react-router";

const getPageTitle = (pathname: string) => {
  if (pathname === "/") return "Dashboard";
  if (pathname.startsWith("/deals")) return "Oportunidades";
  if (pathname.startsWith("/contacts")) return "Contatos";
  if (pathname.startsWith("/companies")) return "Empresas";
  if (pathname.startsWith("/products")) return "Produtos/Serviços";
  if (pathname.startsWith("/lead_sources")) return "Origens";
  if (pathname.startsWith("/settings")) return "Configurações";
  return "CPlay Comercial";
};

export const CPlayHeader = () => {
  const { pathname } = useLocation();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            CPlay Comercial
          </p>
          <h1 className="truncate text-lg font-semibold leading-tight text-foreground">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-1">
          <ThemeModeToggle />
          <RefreshButton />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
