import { CreateButton } from "@/components/admin/create-button";
import { DataTable } from "@/components/admin/data-table";
import { ExportButton } from "@/components/admin/export-button";
import { List } from "@/components/admin/list";
import { SearchInput } from "@/components/admin/search-input";
import { TopToolbar } from "@/components/atomic-crm/layout/TopToolbar";
import { StatusBadge } from "@/components/cplay/ui/StatusBadge";
import { WorkspaceCard } from "@/components/cplay/ui/WorkspaceCard";
import type { CPlayProduct } from "@/cplay/types";
import {
  formatCplayCurrency,
  getActiveStatePresentation,
} from "../resourcePresentation";

const ProductListActions = () => (
  <TopToolbar>
    <ExportButton />
    <CreateButton label="Novo produto/serviço" />
  </TopToolbar>
);

const filters = [<SearchInput source="q" alwaysOn />];

export const ProductList = () => (
  <div className="space-y-4">
    <div>
      <h2 className="text-xl font-semibold tracking-tight">
        Produtos e serviços
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Catálogo comercial usado nas oportunidades e propostas.
      </p>
    </div>

    <WorkspaceCard className="p-3 sm:p-4">
      <List
        filters={filters}
        actions={<ProductListActions />}
        sort={{ field: "display_order", order: "ASC" }}
      >
        <DataTable<CPlayProduct>
          className="overflow-hidden border-border/70"
          rowClick="edit"
        >
          <DataTable.Col
            source="name"
            label="Nome"
            cellClassName="font-medium"
          />
          <DataTable.Col source="category" label="Categoria" />
          <DataTable.Col
            source="base_price"
            label="Preço base"
            render={(record) => formatCplayCurrency(record.base_price)}
          />
          <DataTable.Col
            source="active"
            label="Status"
            render={(record) => {
              const status = getActiveStatePresentation(record.active);
              return <StatusBadge label={status.label} tone={status.tone} />;
            }}
          />
          <DataTable.Col source="display_order" label="Ordem" />
        </DataTable>
      </List>
    </WorkspaceCard>
  </div>
);
