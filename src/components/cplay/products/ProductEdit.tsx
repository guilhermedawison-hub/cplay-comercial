import { EditBase, Form } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";
import { FormToolbar } from "@/components/atomic-crm/layout/FormToolbar";
import { ProductInputs } from "./ProductInputs";

export const ProductEdit = () => (
  <EditBase actions={false} redirect="list">
    <div className="max-w-2xl mx-auto mt-4">
      <Form>
        <Card>
          <CardContent className="pt-6">
            <ProductInputs />
            <FormToolbar />
          </CardContent>
        </Card>
      </Form>
    </div>
  </EditBase>
);
