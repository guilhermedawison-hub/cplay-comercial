import { CreateButton } from "@/components/admin/create-button";
import { DataTable } from "@/components/admin/data-table";
import { List } from "@/components/admin/list";
import { SearchInput } from "@/components/admin/search-input";
import { TopToolbar } from "@/components/atomic-crm/layout/TopToolbar";
import { StatusBadge } from "@/components/cplay/ui/StatusBadge";
import { WorkspaceCard } from "@/components/cplay/ui/WorkspaceCard";
import type { CPlayLeadSource } from "@/cplay/types";
import { getActiveStatePresentation } from "../resourcePresentation";

const LeadSourceListActions = () => (
  <TopToolbar>
    <CreateButton label="Nova origem" />
  </TopToolbar>
);

const filters = [<SearchInput source="q" alwaysOn />];

export const LeadSourceList = () => (
  <div className="space-y-4">
    <div>
      <h2 className="text-xl font-semibold tracking-tight">Origens de lead</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Padronize os canais usados para identificar de onde cada oportunidade veio.
      </p>
    </div>

    <WorkspaceCard className="p-3 sm:p-4">
      <List
        filters={filters}
        actions={<LeadSourceListActions />}
        sort={{ field: "display_order", order: "ASC" }}
      >
        <DataTable<CPlayLeadSource> className="overflow-hidden border-border/70" rowClick="edit">
          <DataTable.Col source="name" label="Nome" cellClassName="font-medium" />
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
