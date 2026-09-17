const nullableReference = (value: unknown) =>
  value === "" || value == null ? null : value;

const nullableValue = (value: unknown) =>
  value === "" || value == null ? null : value;

export const normalizeDealFormData = <T extends Record<string, unknown>>(
  data: T,
) => ({
  ...data,
  company_id: nullableReference(data.company_id),
  lead_source_id: nullableReference(data.lead_source_id),
  next_follow_up_at: nullableValue(data.next_follow_up_at),
  next_follow_up_type: nullableValue(data.next_follow_up_type),
  next_follow_up_note: nullableValue(data.next_follow_up_note),
});
