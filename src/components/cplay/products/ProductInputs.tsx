import { required } from "ra-core";
import { BooleanInput } from "@/components/admin/boolean-input";
import { NumberInput } from "@/components/admin/number-input";
import { TextInput } from "@/components/admin/text-input";

export const ProductInputs = () => (
  <div className="flex flex-col gap-4">
    <TextInput source="name" label="Nome" validate={required()} helperText={false} />
    <TextInput source="category" label="Categoria" helperText={false} />
    <TextInput source="description" label="Descrição" multiline rows={3} helperText={false} />
    <NumberInput source="base_price" label="Preço base" helperText="Valor sugerido para novas oportunidades. Pode ser alterado no negócio." />
    <BooleanInput source="active" label="Ativo" defaultValue />
    <NumberInput source="display_order" label="Ordem de exibição" defaultValue={0} helperText={false} />
    <TextInput source="color" label="Cor de identificação" helperText={false} />
  </div>
);
