import type { CPlayLeadSource } from "@/cplay/types";
import { LeadSourceCreate } from "./LeadSourceCreate";
import { LeadSourceEdit } from "./LeadSourceEdit";
import { LeadSourceList } from "./LeadSourceList";

export default {
  list: LeadSourceList,
  create: LeadSourceCreate,
  edit: LeadSourceEdit,
  recordRepresentation: (record: CPlayLeadSource) => record.name,
};
