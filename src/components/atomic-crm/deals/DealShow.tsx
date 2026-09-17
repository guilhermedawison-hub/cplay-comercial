import { useMutation } from "@tanstack/react-query";
import { isValid } from "date-fns";
import { Archive, ArchiveRestore } from "lucide-react";
import {
  InfiniteListBase,
  ShowBase,
  useDataProvider,
  useNotify,
  useRecordContext,
  useRedirect,
  useRefresh,
  useTranslate,
  useUpdate,
} from "ra-core";
import { DeleteButton } from "@/components/admin/delete-button";
import { EditButton } from "@/components/admin/edit-button";
import { ReferenceArrayField } from "@/components/admin/reference-array-field";
import { ReferenceField } from "@/components/admin/reference-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { CompanyAvatar } from "../companies/CompanyAvatar";
import { NoteCreate } from "../notes/NoteCreate";
import { NotesIterator } from "../notes/NotesIterator";
import { useConfigurationContext } from "../root/ConfigurationContext";
import type { Contact, Deal, Sale } from "../types";
import { ContactList } from "./ContactList";
import { findDealLabel, formatISODateString } from "./dealUtils";

export const DealShow = ({ open, id }: { open: boolean; id?: string }) => {
  const redirect = useRedirect();
  const handleClose = () => {
    redirect("list", "deals");
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <DialogContent className="lg:max-w-4xl p-4 overflow-y-auto max-h-9/10 top-1/20 translate-y-0">
        {id ? (
          <ShowBase id={id}>
            <DealShowContent />
          </ShowBase>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

const DealShowContent = () => {
  const translate = useTranslate();
  const { dealStages, currency } = useConfigurationContext();
  const record = useRecordContext<Deal>();
  if (!record) return null;

  return (
    <div className="space-y-2">
      {record.archived_at ? <ArchivedTitle /> : null}
      <div className="flex-1">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            {record.company_id ? (
              <ReferenceField source="company_id" reference="companies" link="show">
                <CompanyAvatar />
              </ReferenceField>
            ) : null}
            <div>
              <h2 className="text-2xl font-semibold">{record.name}</h2>
              <div className="text-sm text-muted-foreground mt-1">
                {record.company_id ? (
                  <ReferenceField source="company_id" reference="companies" link="show" />
                ) : record.primary_contact_id ? (
                  <ReferenceField
                    source="primary_contact_id"
                    reference="contacts_summary"
                    link="show"
                  >
                    <ContactName />
                  </ReferenceField>
                ) : null}
              </div>
            </div>
          </div>
          <div className={`flex gap-2 ${record.archived_at ? "" : "pr-12"}`}>
            {record.archived_at ? (
              <>
                <UnarchiveButton record={record} />
                <DeleteButton />
              </>
            ) : (
              <>
                <ArchiveButton record={record} />
                <EditButton />
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 m-4">
          <Detail label={translate("resources.deals.fields.amount")}>
            {record.amount.toLocaleString("pt-BR", {
              style: "currency",
              currency,
            })}
          </Detail>

          <Detail label={translate("resources.deals.fields.stage")}>
            {findDealLabel(dealStages, record.stage)}
          </Detail>

          <Detail label="Produto/Serviço">
            {record.product_id ? (
              <ReferenceField source="product_id" reference="products" link={false} />
            ) : (
              "Não informado"
            )}
          </Detail>

          <Detail label="Responsável comercial">
            <ReferenceField source="sales_id" reference="sales" link={false}>
              <SaleName />
            </ReferenceField>
          </Detail>

          <Detail label="Origem do lead">
            {record.lead_source_id ? (
              <ReferenceField source="lead_source_id" reference="lead_sources" link={false} />
            ) : (
              "Não informada"
            )}
          </Detail>

          <Detail label="Previsão de fechamento">
            {record.expected_closing_date && isValid(new Date(record.expected_closing_date))
              ? formatISODateString(record.expected_closing_date)
              : "Não informada"}
          </Detail>

          <Detail label="Próximo follow-up">
            {record.next_follow_up_at
              ? formatFollowUp(record.next_follow_up_at)
              : "Não agendado"}
          </Detail>

          <Detail label="Tipo de follow-up">
            {followUpTypeLabel(record.next_follow_up_type)}
          </Detail>
        </div>

        {record.next_follow_up_note ? (
          <div className="m-4 rounded-md border p-3">
            <span className="text-xs text-muted-foreground tracking-wide">
              Observação do próximo follow-up
            </span>
            <p className="text-sm mt-1 whitespace-pre-line">
              {record.next_follow_up_note}
            </p>
          </div>
        ) : null}

        {!!record.contact_ids?.length && (
          <div className="m-4">
            <div className="flex flex-col min-h-12 mr-10">
              <span className="text-xs text-muted-foreground tracking-wide">
                {translate("resources.deals.fields.contact_ids")}
              </span>
              <ReferenceArrayField
                source="contact_ids"
                reference="contacts_summary"
              >
                <ContactList />
              </ReferenceArrayField>
            </div>
          </div>
        )}

        {record.description && (
          <div className="m-4 whitespace-pre-line">
            <span className="text-xs text-muted-foreground tracking-wide">
              {translate("resources.deals.fields.description")}
            </span>
            <p className="text-sm leading-6">{record.description}</p>
          </div>
        )}

        <div className="m-4">
          <Separator className="mb-4" />
          <InfiniteListBase
            resource="deal_notes"
            filter={{ deal_id: record.id }}
            sort={{ field: "date", order: "DESC" }}
            perPage={25}
            disableSyncWithLocation
            storeKey={false}
            empty={<NoteCreate reference="deals" />}
          >
            <NotesIterator reference="deals" />
          </InfiniteListBase>
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col">
    <span className="text-xs text-muted-foreground tracking-wide">{label}</span>
    <span className="text-sm mt-1">{children}</span>
  </div>
);

const ContactName = () => {
  const contact = useRecordContext<Contact>();
  if (!contact) return null;
  return <>{`${contact.first_name ?? ""} ${contact.last_name ?? ""}`.trim()}</>;
};

const SaleName = () => {
  const sale = useRecordContext<Sale>();
  if (!sale) return null;
  return <>{`${sale.first_name} ${sale.last_name}`.trim()}</>;
};

const followUpTypeLabel = (type?: string | null) => {
  const labels: Record<string, string> = {
    whatsapp: "WhatsApp",
    ligacao: "Ligação",
    email: "E-mail",
    reuniao: "Reunião",
    visita: "Visita",
    outro: "Outro",
  };
  return type ? labels[type] ?? type : "Não informado";
};

const formatFollowUp = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
};

const ArchivedTitle = () => {
  const translate = useTranslate();
  return (
    <div className="bg-orange-500 px-6 py-4">
      <h3 className="text-lg font-bold text-white">
        {translate("resources.deals.archived.title")}
      </h3>
    </div>
  );
};

const ArchiveButton = ({ record }: { record: Deal }) => {
  const translate = useTranslate();
  const [update] = useUpdate();
  const redirect = useRedirect();
  const notify = useNotify();
  const refresh = useRefresh();
  const handleClick = () => {
    update(
      "deals",
      {
        id: record.id,
        data: { archived_at: new Date().toISOString() },
        previousData: record,
      },
      {
        onSuccess: () => {
          redirect("list", "deals");
          notify("resources.deals.archived.success", {
            type: "info",
            undoable: false,
          });
          refresh();
        },
        onError: () => {
          notify("resources.deals.archived.error", {
            type: "error",
          });
        },
      },
    );
  };

  return (
    <Button
      onClick={handleClick}
      size="sm"
      variant="outline"
      className="flex items-center gap-2 h-9"
    >
      <Archive className="w-4 h-4" />
      {translate("resources.deals.archived.action")}
    </Button>
  );
};

const UnarchiveButton = ({ record }: { record: Deal }) => {
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const redirect = useRedirect();
  const notify = useNotify();
  const refresh = useRefresh();

  const { mutate } = useMutation({
    mutationFn: () => dataProvider.unarchiveDeal(record),
    onSuccess: () => {
      redirect("list", "deals");
      notify("resources.deals.unarchived.success", {
        type: "info",
        undoable: false,
      });
      refresh();
    },
    onError: () => {
      notify("resources.deals.unarchived.error", {
        type: "error",
      });
    },
  });

  return (
    <Button
      onClick={() => mutate()}
      size="sm"
      variant="outline"
      className="flex items-center gap-2 h-9"
    >
      <ArchiveRestore className="w-4 h-4" />
      {translate("resources.deals.unarchived.action")}
    </Button>
  );
};
