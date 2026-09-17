import { useGetIdentity, useListContext, useTranslate } from "ra-core";
import { CreateButton } from "@/components/admin/create-button";
import { ExportButton } from "@/components/admin/export-button";
import { List } from "@/components/admin/list";
import { ListPagination } from "@/components/admin/list-pagination";
import { SortButton } from "@/components/admin/sort-button";
import { WorkspaceCard } from "@/components/cplay/ui/WorkspaceCard";

import { DataImportButton } from "../dataImport/DataImportButton";
import { TopToolbar } from "../layout/TopToolbar";
import { CompanyEmpty } from "./CompanyEmpty";
import { CompanyListFilter } from "./CompanyListFilter";
import { ImageList } from "./GridList";

export const CompanyList = () => {
  const { identity } = useGetIdentity();
  if (!identity) return null;
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Empresas</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Organizações vinculadas a contatos, oportunidades e histórico
          comercial.
        </p>
      </div>
      <List
        title={false}
        perPage={25}
        sort={{ field: "name", order: "ASC" }}
        actions={<CompanyListActions />}
        pagination={<ListPagination rowsPerPageOptions={[10, 25, 50, 100]} />}
      >
        <CompanyListLayout />
      </List>
    </div>
  );
};

const CompanyListLayout = () => {
  const { data, isPending, filterValues } = useListContext();
  const hasFilters = filterValues && Object.keys(filterValues).length > 0;

  if (isPending) return null;
  if (!data?.length && !hasFilters) return <CompanyEmpty />;

  return (
    <div className="flex w-full flex-row gap-6">
      <CompanyListFilter />
      <WorkspaceCard className="flex flex-1 flex-col gap-4 p-3 sm:p-4">
        <ImageList />
      </WorkspaceCard>
    </div>
  );
};

const CompanyListActions = () => {
  const translate = useTranslate();
  return (
    <TopToolbar>
      <SortButton fields={["name", "created_at", "nb_contacts"]} />
      <DataImportButton resource="companies" />
      <ExportButton />
      <CreateButton
        label={translate("resources.companies.action.new", {
          _: "Nova empresa",
        })}
      />
    </TopToolbar>
  );
};
