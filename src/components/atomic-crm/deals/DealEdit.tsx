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
    <Dialog open={open} onOpenChange={() => handleClose()}>
      <DialogContent className="lg:max-w-4xl p-4 overflow-y-auto max-h-9/10 top-1/20 translate-y-0">
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
            <EditHeader />
            <Form>
              <DealInputs />
              <FormToolbar />
            </Form>
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
    <DialogTitle className="pb-0">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          {deal.company_id ? (
            <ReferenceField source="company_id" reference="companies" link="show">
              <CompanyAvatar />
            </ReferenceField>
          ) : null}
          <div>
            <h2 className="text-2xl font-semibold">{defaultTitle}</h2>
            {!deal.company_id && deal.primary_contact_id ? (
              <div className="text-sm text-muted-foreground">
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
        <div className="flex gap-2 pr-12">
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
