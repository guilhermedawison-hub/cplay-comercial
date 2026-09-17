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
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

import type { CPlayProduct } from "@/cplay/types";
import { contactOptionText } from "../misc/ContactOption";
import { useConfigurationContext } from "../root/ConfigurationContext";
import { AutocompleteCompanyInput } from "../companies/AutocompleteCompanyInput.tsx";
import type { Deal, Sale } from "../types";

export const DealInputs = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col gap-8">
      <ProductPriceSync />
      <PrimaryContactSync />
      <DealInfoInputs />

      <div className={`flex gap-6 ${isMobile ? "flex-col" : "flex-row"}`}>
        <DealLinkedToInputs />
        <Separator orientation={isMobile ? "horizontal" : "vertical"} />
        <DealCommercialInputs />
      </div>

      <DealFollowUpInputs />
    </div>
  );
};

const DealInfoInputs = () => (
  <div className="flex flex-col gap-4 flex-1">
    <TextInput
      source="name"
      label="Negócio/Oportunidade"
      validate={required()}
      helperText={false}
    />
    <TextInput
      source="description"
      label="Observações"
      multiline
      rows={3}
      helperText={false}
    />
  </div>
);

const DealLinkedToInputs = () => (
  <div className="flex flex-col gap-4 flex-1">
    <h3 className="text-base font-medium">Cliente</h3>

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
);

const DealCommercialInputs = () => {
  const { dealStages } = useConfigurationContext();

  return (
    <div className="flex flex-col gap-4 flex-1">
      <h3 className="text-base font-medium">Comercial</h3>

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
        helperText="Preenchido pelo preço-base do produto, mas sempre editável."
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
  );
};

const DealFollowUpInputs = () => (
  <div className="flex flex-col gap-4">
    <h3 className="text-base font-medium">Próximo follow-up</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
    <TextInput
      source="next_follow_up_note"
      label="Observação do follow-up"
      multiline
      rows={2}
      helperText={false}
    />
  </div>
);

const ProductPriceSync = () => {
  const productId = useWatch({ name: "product_id" }) as Identifier | undefined;
  const record = useRecordContext<Deal>();
  const { setValue } = useFormContext();
  const appliedProductId = useRef<Identifier | undefined>(record?.product_id ?? undefined);
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

    if (!product || product.id !== productId) return;
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
