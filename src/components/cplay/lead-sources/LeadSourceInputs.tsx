import { required } from "ra-core";
import { BooleanInput } from "@/components/admin/boolean-input";
import { NumberInput } from "@/components/admin/number-input";
import { TextInput } from "@/components/admin/text-input";

export const LeadSourceInputs = () => (
  <div className="flex flex-col gap-4">
    <TextInput
      source="name"
      label="Nome"
      validate={required()}
      helperText={false}
    />
    <BooleanInput source="active" label="Ativa" defaultValue />
    <NumberInput
      source="display_order"
      label="Ordem de exibição"
      defaultValue={0}
      helperText={false}
    />
  </div>
);
