import { useMutation } from "@tanstack/react-query";
import { isValid } from "date-fns";
import { Archive, ArchiveRestore, CalendarClock } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/cplay/ui/StatusBadge";
import { getFollowUpVisualState } from "@/cplay/ui/status";

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
      <DialogContent className="top-[4vh] max-h-[92vh] translate-y-0 overflow-y-auto p-0 lg:max-w-5xl">
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

  const followUpState = getFollowUpVisualState(record.next_follow_up_at);

  return (
    <div className="bg-background">
      {record.archived_at ? <ArchivedTitle /> : null}

      <div className="border-b border-border/80 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            {record.company_id ? (
              <ReferenceField source="company_id" reference="companies" link="show">
                <CompanyAvatar />
              </ReferenceField>
            ) : null}
            <div className="min-w-0">
              <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Oportunidade
              </p>
              <h2 className="truncate text-2xl font-semibold tracking-tight text-foreground">
                {record.name}
              </h2>
              <div className="mt-1 truncate text-sm text-muted-foreground">
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

          <div className="flex flex-wrap items-center gap-2 sm:pr-10">
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
      </div>

      <div className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-xl border border-border/80 bg-card p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Resumo comercial</p>
              <p className="text-xs text-muted-foreground">Dados principais da oportunidade</p>
            </div>
            <StatusBadge
              tone={record.stage === "fechado" ? "success" : record.stage === "perdido" ? "danger" : "neutral"}
              label={findDealLabel(dealStages, record.stage)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Detail label={translate("resources.deals.fields.amount")} strong>
              {Number(record.amount || 0).toLocaleString("pt-BR", {
                style: "currency",
                currency,
              })}
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

            <Detail label="Tipo de follow-up">
              {followUpTypeLabel(record.next_follow_up_type)}
            </Detail>
          </div>
        </section>

        <section className="rounded-xl border border-border/80 bg-card p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-primary" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-foreground">Próximo follow-up</p>
              <p className="text-xs text-muted-foreground">Próxima ação comercial planejada</p>
            </div>
          </div>

          <StatusBadge
            tone={getFollowUpTone(followUpState)}
            label={getFollowUpLabel(followUpState)}
          />

          <p className="mt-4 text-lg font-semibold text-foreground">
            {record.next_follow_up_at ? formatFollowUp(record.next_follow_up_at) : "Não agendado"}
          </p>

          {record.next_follow_up_note ? (
            <div className="mt-4 rounded-lg bg-muted/45 p-3">
              <p className="text-xs font-medium text-muted-foreground">Observação</p>
              <p className="mt-1 whitespace-pre-line text-sm leading-6 text-foreground">
                {record.next_follow_up_note}
              </p>
            </div>
          ) : null}
        </section>
      </div>

      {!!record.contact_ids?.length && (
        <section className="px-5 pb-5 sm:px-6">
          <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5">
            <p className="mb-3 text-sm font-semibold text-foreground">
              {translate("resources.deals.fields.contact_ids")}
            </p>
            <ReferenceArrayField source="contact_ids" reference="contacts_summary">
              <ContactList />
            </ReferenceArrayField>
          </div>
        </section>
      )}

      {record.description ? (
        <section className="px-5 pb-5 sm:px-6">
          <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {translate("resources.deals.fields.description")}
            </p>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-foreground">
              {record.description}
            </p>
          </div>
        </section>
      ) : null}

      <section className="px-5 pb-6 sm:px-6">
        <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5">
          <div className="mb-4">
            <p className="text-sm font-semibold text-foreground">Histórico e observações</p>
            <p className="text-xs text-muted-foreground">Timeline comercial da oportunidade</p>
          </div>
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
      </section>
    </div>
  );
};

const Detail = ({
  label,
  children,
  strong = false,
}: {
  label: string;
  children: React.ReactNode;
  strong?: boolean;
}) => (
  <div className="min-w-0">
    <span className="text-xs font-medium text-muted-foreground">{label}</span>
    <div className={strong ? "mt-1 text-lg font-semibold text-foreground" : "mt-1 text-sm text-foreground"}>
      {children}
    </div>
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

const getFollowUpTone = (state: ReturnType<typeof getFollowUpVisualState>) => {
  if (state === "overdue") return "danger" as const;
  if (state === "due-soon") return "warning" as const;
  return "neutral" as const;
};

const getFollowUpLabel = (state: ReturnType<typeof getFollowUpVisualState>) => {
  if (state === "overdue") return "Follow-up vencido";
  if (state === "due-soon") return "Follow-up próximo";
  if (state === "scheduled") return "Follow-up agendado";
  return "Sem follow-up";
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
    <div className="bg-[color:var(--cplay-warning)] px-6 py-3">
      <h3 className="text-sm font-semibold text-white">
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
          notify("resources.deals.archived.error", { type: "error" });
        },
      },
    );
  };

  return (
    <Button onClick={handleClick} size="sm" variant="outline" className="h-9 gap-2">
      <Archive className="h-4 w-4" />
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
      notify("resources.deals.unarchived.error", { type: "error" });
    },
  });

  return (
    <Button onClick={() => mutate()} size="sm" variant="outline" className="h-9 gap-2">
      <ArchiveRestore className="h-4 w-4" />
      {translate("resources.deals.unarchived.action")}
    </Button>
  );
};
