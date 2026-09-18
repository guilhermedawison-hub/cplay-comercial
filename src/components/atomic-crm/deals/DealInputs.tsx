import { useEffect, useRef } from "react";
import {
  required,
  useGetOne,
  useRecordContext,
  type Identifier,
} from "ra-core";
import { useFormContext, useWatch } from "react-hook-form";
import { AutocompleteInput } from "@/components/admin/autocomplete-input";
import { ReferenceInput } from "@/components/admin/reference-input";
import { TextInput } from "@/components/admin/text-input";
import { NumberInput } from "@/components/admin/number-input";
import { DateInput } from "@/components/admin/date-input";
import { DateTimeInput } from "@/components/admin/date-time-input";
import { SelectInput } from "@/components/admin/select-input";
import {
  BadgeDollarSign,
  CalendarClock,
  UserRound,
  UsersRound,
} from "lucide-react";

import type { CPlayProduct } from "@/cplay/types";
import { contactOptionText } from "../misc/ContactOption";
import { useConfigurationContext } from "../root/ConfigurationContext";
import { AutocompleteCompanyInput } from "../companies/AutocompleteCompanyInput.tsx";
import type { Deal, Sale } from "../types";

export const DealInputs = () => (
  <div className="space-y-5">
    <ProductPriceSync />
    <PrimaryContactSync />

    <FormSection
      icon={UsersRound}
      title="Oportunidade"
      description="Identificação principal e contexto do negócio."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextInput
          source="name"
          label="Negócio/Oportunidade"
          validate={required()}
          helperText={false}
        />
        <div className="md:col-span-2">
          <TextInput
            source="description"
            label="Observações"
            multiline
            rows={3}
            helperText={false}
          />
        </div>
      </div>
    </FormSection>

    <FormSection
      icon={UserRound}
      title="Cliente"
      description="Vincule o contato principal e, quando houver, a empresa."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ReferenceInput
          source="primary_contact_id"
          reference="contacts_summary"
          perPage={20}
        >
          <AutocompleteInput
            label="Contato principal"
            optionText={contactOptionText}
            validate={required()}
            helperText="Obrigatório. O contato pode existir sem empresa."
          />
        </ReferenceInput>

        <ReferenceInput source="company_id" reference="companies" perPage={20}>
          <AutocompleteCompanyInput label="Empresa (opcional)" modal />
        </ReferenceInput>
      </div>
    </FormSection>

    <DealCommercialInputs />
    <DealFollowUpInputs />
  </div>
);

const DealCommercialInputs = () => {
  const { dealStages } = useConfigurationContext();

  return (
    <FormSection
      icon={BadgeDollarSign}
      title="Comercial"
      description="Produto, valor, origem, responsável e etapa da negociação."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ReferenceInput source="product_id" reference="products" perPage={50}>
          <AutocompleteInput
            label="Produto/Serviço"
            optionText="name"
            validate={required()}
            helperText={false}
          />
        </ReferenceInput>

        <NumberInput
          source="amount"
          label="Valor da oportunidade"
          helperText="Sugestão do preço-base, sempre editável."
          validate={required()}
        />

        <ReferenceInput
          source="lead_source_id"
          reference="lead_sources"
          perPage={50}
        >
          <AutocompleteInput
            label="Origem do lead"
            optionText="name"
            helperText={false}
          />
        </ReferenceInput>

        <ReferenceInput
          reference="sales"
          source="sales_id"
          sort={{ field: "last_name", order: "ASC" }}
          filter={{ "disabled@neq": true }}
        >
          <SelectInput
            label="Responsável comercial"
            helperText={false}
            optionText={saleOptionRenderer}
            validate={required()}
          />
        </ReferenceInput>

        <DateInput
          source="expected_closing_date"
          label="Previsão de fechamento"
          helperText={false}
          defaultValue={new Date().toISOString().split("T")[0]}
        />

        <SelectInput
          source="stage"
          label="Etapa"
          choices={dealStages}
          optionText="label"
          optionValue="value"
          defaultValue="novo"
          helperText={false}
          validate={required()}
        />
      </div>
    </FormSection>
  );
};

const DealFollowUpInputs = () => (
  <FormSection
    icon={CalendarClock}
    title="Próximo follow-up"
    description="Defina a próxima ação comercial e mantenha o histórico operacional claro."
  >
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <DateTimeInput
        source="next_follow_up_at"
        label="Data e hora"
        helperText={false}
      />
      <SelectInput
        source="next_follow_up_type"
        label="Tipo de contato"
        helperText={false}
        choices={[
          { id: "whatsapp", name: "WhatsApp" },
          { id: "ligacao", name: "Ligação" },
          { id: "email", name: "E-mail" },
          { id: "reuniao", name: "Reunião" },
          { id: "visita", name: "Visita" },
          { id: "outro", name: "Outro" },
        ]}
      />
      <div className="md:col-span-2">
        <TextInput
          source="next_follow_up_note"
          label="Observação do follow-up"
          multiline
          rows={2}
          helperText={false}
        />
      </div>
    </div>
  </FormSection>
);

const FormSection = ({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof UsersRound;
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-xl border border-border/80 bg-card p-4 shadow-none sm:p-5">
    <div className="mb-4 flex items-start gap-3 border-b border-border/70 pb-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--cplay-primary-subtle)] text-primary">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
    {children}
  </section>
);

const ProductPriceSync = () => {
  const productId = useWatch({ name: "product_id" }) as Identifier | undefined;
  const record = useRecordContext<Deal>();
  const { setValue } = useFormContext();
  const appliedProductId = useRef<Identifier | undefined>(
    record?.product_id ?? undefined,
  );
  const { data: product } = useGetOne<CPlayProduct>(
    "products",
    { id: productId as Identifier },
    { enabled: productId != null },
  );

  useEffect(() => {
    if (productId == null) {
      appliedProductId.current = undefined;
      return;
    }

    if (!product || String(product.id) !== String(productId)) return;
    if (appliedProductId.current === productId) return;

    appliedProductId.current = productId;
    if (product.base_price != null) {
      setValue("amount", product.base_price, { shouldDirty: true });
    }
  }, [product, productId, setValue]);

  return null;
};

const PrimaryContactSync = () => {
  const primaryContactId = useWatch({ name: "primary_contact_id" }) as
    | Identifier
    | undefined;
  const { setValue } = useFormContext();

  useEffect(() => {
    setValue("contact_ids", primaryContactId ? [primaryContactId] : [], {
      shouldDirty: true,
    });
  }, [primaryContactId, setValue]);

  return null;
};

const saleOptionRenderer = (choice: Sale) =>
  `${choice.first_name} ${choice.last_name}`;
