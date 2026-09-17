import { EditBase, Form } from "ra-core";
import { Card, CardContent } from "@/components/ui/card";
import { FormToolbar } from "@/components/atomic-crm/layout/FormToolbar";
import { LeadSourceInputs } from "./LeadSourceInputs";

export const LeadSourceEdit = () => (
  <EditBase actions={false} redirect="list">
    <div className="max-w-2xl mx-auto mt-4">
      <Form>
        <Card>
          <CardContent className="pt-6">
            <LeadSourceInputs />
            <FormToolbar />
          </CardContent>
        </Card>
      </Form>
    </div>
  </EditBase>
);
