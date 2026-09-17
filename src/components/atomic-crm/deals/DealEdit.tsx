import {
  EditBase,
  Form,
  useEditContext,
  useNotify,
  useRecordContext,
  useRedirect,
  useTranslate,
} from "ra-core";
import { Link } from "react-router";
import { DeleteButton } from "@/components/admin/delete-button";
import { ReferenceField } from "@/components/admin/reference-field";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { FormToolbar } from "../layout/FormToolbar";
import { CompanyAvatar } from "../companies/CompanyAvatar";
import type { Contact, Deal } from "../types";
import { DealInputs } from "./DealInputs";

export const DealEdit = ({ open, id }: { open: boolean; id?: string }) => {
  const redirect = useRedirect();
  const notify = useNotify();

  const handleClose = () => {
    redirect("/deals", undefined, undefined, undefined, {
      _scrollToTop: false,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto p-0 sm:max-w-3xl lg:max-w-4xl">
        {id ? (
          <EditBase
            id={id}
            mutationMode="pessimistic"
            mutationOptions={{
              onSuccess: () => {
                notify("resources.deals.updated", {});
                redirect(`/deals/${id}/show`, undefined, undefined, undefined, {
                  _scrollToTop: false,
                });
              },
            }}
          >
            <div className="sticky top-0 z-10 border-b bg-background/95 px-5 py-4 backdrop-blur sm:px-6">
              <EditHeader />
            </div>
            <div className="px-5 pb-6 pt-5 sm:px-6">
              <Form>
                <DealInputs />
                <FormToolbar className="mt-5 border-t border-border/70 pt-4" />
              </Form>
            </div>
          </EditBase>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

function EditHeader() {
  const translate = useTranslate();
  const { defaultTitle } = useEditContext<Deal>();
  const deal = useRecordContext<Deal>();
  if (!deal) return null;

  return (
    <DialogTitle asChild>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          {deal.company_id ? (
            <ReferenceField source="company_id" reference="companies" link="show">
              <CompanyAvatar />
            </ReferenceField>
          ) : null}
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Editar oportunidade
            </p>
            <h2 className="truncate text-xl font-semibold text-foreground">{defaultTitle}</h2>
            {!deal.company_id && deal.primary_contact_id ? (
              <div className="mt-1 text-sm text-muted-foreground">
                <ReferenceField
                  source="primary_contact_id"
                  reference="contacts_summary"
                  link="show"
                >
                  <ContactName />
                </ReferenceField>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 pr-8 sm:pr-10">
          <DeleteButton />
          <Button asChild variant="outline" className="h-9">
            <Link to={`/deals/${deal.id}/show`}>
              {translate("resources.deals.action.back_to_deal")}
            </Link>
          </Button>
        </div>
      </div>
    </DialogTitle>
  );
}

const ContactName = () => {
  const contact = useRecordContext<Contact>();
  if (!contact) return null;
  return <>{`${contact.first_name ?? ""} ${contact.last_name ?? ""}`.trim()}</>;
};
