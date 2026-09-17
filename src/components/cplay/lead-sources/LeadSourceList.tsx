import { CreateButton } from "@/components/admin/create-button";
import { DataTable } from "@/components/admin/data-table";
import { List } from "@/components/admin/list";
import { SearchInput } from "@/components/admin/search-input";
import { TopToolbar } from "@/components/atomic-crm/layout/TopToolbar";

const LeadSourceListActions = () => (
  <TopToolbar>
    <CreateButton label="Nova origem" />
  </TopToolbar>
);

const filters = [<SearchInput source="q" alwaysOn />];

export const LeadSourceList = () => (
  <List
    filters={filters}
    actions={<LeadSourceListActions />}
    sort={{ field: "display_order", order: "ASC" }}
  >
    <DataTable>
      <DataTable.Col source="name" label="Nome" />
      <DataTable.Col source="active" label="Ativa" />
      <DataTable.Col source="display_order" label="Ordem" />
    </DataTable>
  </List>
);
