import { CreateBase, Form } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";
import { CancelButton } from "@/components/admin/cancel-button";
import { SaveButton } from "@/components/admin/form";
import { LeadSourceInputs } from "./LeadSourceInputs";

export const LeadSourceCreate = () => (
  <CreateBase redirect="list">
    <div className="max-w-2xl mx-auto mt-4">
      <Form defaultValues={{ active: true, display_order: 0 }}>
        <Card>
          <CardContent className="pt-6">
            <LeadSourceInputs />
            <div role="toolbar" className="flex justify-end gap-2 pt-6">
              <CancelButton />
              <SaveButton label="Cadastrar origem" />
            </div>
          </CardContent>
        </Card>
      </Form>
    </div>
  </CreateBase>
);
