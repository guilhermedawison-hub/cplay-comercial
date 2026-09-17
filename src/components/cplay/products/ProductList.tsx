import { CreateButton } from "@/components/admin/create-button";
import { DataTable } from "@/components/admin/data-table";
import { ExportButton } from "@/components/admin/export-button";
import { List } from "@/components/admin/list";
import { SearchInput } from "@/components/admin/search-input";
import { TopToolbar } from "@/components/atomic-crm/layout/TopToolbar";

const ProductListActions = () => (
  <TopToolbar>
    <ExportButton />
    <CreateButton label="Novo produto/serviço" />
  </TopToolbar>
);

const filters = [<SearchInput source="q" alwaysOn />];

export const ProductList = () => (
  <List
    filters={filters}
    actions={<ProductListActions />}
    sort={{ field: "display_order", order: "ASC" }}
  >
    <DataTable>
      <DataTable.Col source="name" label="Nome" />
      <DataTable.Col source="category" label="Categoria" />
      <DataTable.Col source="base_price" label="Preço base" />
      <DataTable.Col source="active" label="Ativo" />
      <DataTable.Col source="display_order" label="Ordem" />
    </DataTable>
  </List>
);
