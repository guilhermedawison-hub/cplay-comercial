import { Draggable } from "@hello-pangea/dnd";
import { useRedirect, RecordContextProvider, useRecordContext } from "ra-core";
import { ReferenceField } from "@/components/admin/reference-field";
import { NumberField } from "@/components/admin/number-field";
import { Card, CardContent } from "@/components/ui/card";

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
          className={`py-3 transition-all duration-200 ${
            snapshot?.isDragging
              ? "opacity-90 transform rotate-1 shadow-lg"
              : "shadow-sm hover:shadow-md"
          }`}
        >
          <CardContent className="px-3 flex flex-col gap-2">
            <div>
              <p className="text-sm font-semibold leading-tight">
                {deal.company_id ? (
                  <ReferenceField source="company_id" reference="companies" link={false} />
                ) : (
                  <ReferenceField
                    source="primary_contact_id"
                    reference="contacts_summary"
                    link={false}
                  >
                    <ContactName />
                  </ReferenceField>
                )}
              </p>
              {deal.company_id && deal.primary_contact_id ? (
                <p className="text-xs text-muted-foreground mt-1">
                  <ReferenceField
                    source="primary_contact_id"
                    reference="contacts_summary"
                    link={false}
                  >
                    <ContactName />
                  </ReferenceField>
                </p>
              ) : null}
            </div>

            <div className="text-xs">
              <span className="text-muted-foreground">Produto: </span>
              {deal.product_id ? (
                <ReferenceField source="product_id" reference="products" link={false} />
              ) : (
                <span>Não informado</span>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-medium">
                <NumberField
                  source="amount"
                  options={{
                    style: "currency",
                    currency,
                    currencyDisplay: "narrowSymbol",
                  }}
                />
              </span>
              <span className="text-muted-foreground truncate">
                <ReferenceField source="sales_id" reference="sales" link={false}>
                  <SaleName />
                </ReferenceField>
              </span>
            </div>

            {deal.next_follow_up_at ? (
              <div className="text-xs border-t pt-2 mt-1">
                <span className="text-muted-foreground">Follow-up: </span>
                <span>{formatFollowUp(deal.next_follow_up_at)}</span>
                {deal.next_follow_up_type ? (
                  <span className="text-muted-foreground"> · {deal.next_follow_up_type}</span>
                ) : null}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </RecordContextProvider>
    </div>
  );
};

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

const formatFollowUp = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
};
