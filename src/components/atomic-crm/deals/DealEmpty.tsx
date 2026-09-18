import { useGetList, useTranslate } from "ra-core";
import { Link } from "react-router";
import { CreateButton } from "@/components/admin/create-button";
import { Progress } from "@/components/ui/progress";

import { DataImportButton } from "../dataImport/DataImportButton";
import useAppBarHeight from "../misc/useAppBarHeight";
import type { Contact } from "../types";

export const DealEmpty = () => {
  const translate = useTranslate();
  const appbarHeight = useAppBarHeight();

  const { data: contacts, isPending: contactsLoading } = useGetList<Contact>(
    "contacts",
    {
      pagination: { page: 1, perPage: 1 },
    },
  );

  if (contactsLoading) return <Progress value={50} />;

  return (
    <div
      className="flex flex-col items-center justify-center gap-12"
      style={{
        height: `calc(100dvh - ${appbarHeight}px)`,
      }}
    >
      <img
        src="./img/empty.svg"
        alt={translate("resources.deals.empty.title")}
      />
      {contacts && contacts.length > 0 ? (
        <>
          <div className="flex flex-col items-center gap-0">
            <h3 className="text-lg font-bold">
              {translate("resources.deals.empty.title")}
            </h3>
            <p className="mb-4 text-center text-sm text-muted-foreground">
              {translate("resources.deals.empty.description")}
            </p>
          </div>
          <div className="flex space-x-8">
            <CreateButton label="resources.deals.action.create" />
            <DataImportButton resource="deals" />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-0">
          <h3 className="text-lg font-bold">
            {translate("resources.deals.empty.title")}
          </h3>
          <p className="mb-4 text-center text-sm text-muted-foreground">
            {translate("resources.contacts.empty.description")}
            <br />
            <Link to="/contacts/create" className="hover:underline">
              {translate("resources.contacts.action.add_first")}
            </Link>{" "}
            {translate("resources.deals.empty.before_create")}
          </p>
        </div>
      )}
    </div>
  );
};
