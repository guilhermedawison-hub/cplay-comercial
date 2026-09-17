import { useEffect } from "react";
import { CreateBase, Form, useGetIdentity, type MutationMode } from "ra-core";
import { useFormContext, useWatch } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";

import { ContactInputs } from "./ContactInputs";
import { FormToolbar } from "../layout/FormToolbar";
import {
  cleanupContactForCreate,
  defaultEmailJsonb,
  defaultPhoneJsonb,
} from "./contactModel";

export const ContactCreate = ({
  mutationMode,
}: {
  mutationMode?: MutationMode;
}) => (
  <CreateBase
    redirect="show"
    transform={cleanupContactForCreate}
    mutationMode={mutationMode}
  >
    <div className="mt-2 flex lg:mr-72">
      <div className="flex-1">
        <Form
          defaultValues={{
            email_jsonb: defaultEmailJsonb,
            phone_jsonb: defaultPhoneJsonb,
          }}
        >
          <CurrentSalesSync />
          <Card>
            <CardContent>
              <ContactInputs />
              <FormToolbar />
            </CardContent>
          </Card>
        </Form>
      </div>
    </div>
  </CreateBase>
);

const CurrentSalesSync = () => {
  const { identity } = useGetIdentity();
  const { setValue } = useFormContext();
  const salesId = useWatch({ name: "sales_id" });

  useEffect(() => {
    if (salesId == null && identity?.id != null) {
      setValue("sales_id", identity.id, { shouldDirty: false });
    }
  }, [identity?.id, salesId, setValue]);

  return null;
};
