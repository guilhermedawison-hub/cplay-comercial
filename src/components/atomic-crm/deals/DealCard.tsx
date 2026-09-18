import { Draggable } from "@hello-pangea/dnd";
import { BriefcaseBusiness, CalendarClock, UserRound } from "lucide-react";
import {
  RecordContextProvider,
  useGetOne,
  useRecordContext,
  useRedirect,
} from "ra-core";
import { ReferenceField } from "@/components/admin/reference-field";
import { NumberField } from "@/components/admin/number-field";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/cplay/ui/StatusBadge";
import { getFollowUpVisualState } from "@/cplay/ui/status";

import { useConfigurationContext } from "../root/ConfigurationContext";
import type { Contact, Deal, Sale } from "../types";

export const DealCard = ({ deal, index }: { deal: Deal; index: number }) => {
  if (!deal) return null;

  return (
    <Draggable draggableId={String(deal.id)} index={index}>
      {(provided, snapshot) => (
        <DealCardContent provided={provided} snapshot={snapshot} deal={deal} />
      )}
    </Draggable>
  );
};

export const DealCardContent = ({
  provided,
  snapshot,
  deal,
}: {
  provided?: any;
  snapshot?: any;
  deal: Deal;
}) => {
  const { currency } = useConfigurationContext();
  const redirect = useRedirect();
  const followUpState = getFollowUpVisualState(deal.next_follow_up_at);
  const { data: primaryContact } = useGetOne<Contact>(
    "contacts",
    { id: deal.primary_contact_id as NonNullable<Deal["primary_contact_id"]> },
    { enabled: deal.primary_contact_id != null },
  );

  const primaryContactName = primaryContact
    ? `${primaryContact.first_name ?? ""} ${primaryContact.last_name ?? ""}`.trim()
    : "Contato";

  const handleClick = () => {
    redirect(`/deals/${deal.id}/show`, undefined, undefined, undefined, {
      _scrollToTop: false,
    });
  };

  return (
    <div
      className="cursor-pointer"
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      ref={provided?.innerRef}
      onClick={handleClick}
    >
      <RecordContextProvider value={deal}>
        <Card
          className={`gap-0 rounded-xl border-border/80 py-0 transition-all duration-200 ${
            snapshot?.isDragging
              ? "rotate-1 border-primary/40 opacity-95 shadow-lg"
              : "shadow-none hover:border-primary/25 hover:shadow-sm"
          }`}
        >
          <CardContent className="flex flex-col gap-3 px-3.5 py-3.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-tight text-foreground">
                {deal.company_id ? (
                  <ReferenceField
                    source="company_id"
                    reference="companies"
                    link={false}
                  />
                ) : (
                  primaryContactName
                )}
              </p>

              {deal.company_id && deal.primary_contact_id ? (
                <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
                  <UserRound
                    className="h-3.5 w-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="truncate">{primaryContactName}</span>
                </div>
              ) : null}
            </div>

            <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
              <BriefcaseBusiness
                className="h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
              <span className="truncate">
                {deal.product_id ? (
                  <ReferenceField
                    source="product_id"
                    reference="products"
                    link={false}
                  />
                ) : (
                  "Produto não informado"
                )}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-2.5 text-xs">
              <span className="font-semibold text-foreground">
                <NumberField
                  source="amount"
                  options={{
                    style: "currency",
                    currency,
                    currencyDisplay: "narrowSymbol",
                  }}
                />
              </span>

              <span className="max-w-[48%] truncate text-muted-foreground">
                <ReferenceField
                  source="sales_id"
                  reference="sales"
                  link={false}
                >
                  <SaleName />
                </ReferenceField>
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <StatusBadge
                tone={getFollowUpTone(followUpState)}
                label={getFollowUpLabel(followUpState)}
                className="max-w-full"
              />

              {deal.next_follow_up_at ? (
                <span className="flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground">
                  <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                  {formatFollowUp(deal.next_follow_up_at)}
                </span>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </RecordContextProvider>
    </div>
  );
};

const SaleName = () => {
  const sale = useRecordContext<Sale>();
  if (!sale) return null;
  return <>{`${sale.first_name} ${sale.last_name}`.trim()}</>;
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
    day: "2-digit",
    month: "2-digit",
  }).format(date);
};
