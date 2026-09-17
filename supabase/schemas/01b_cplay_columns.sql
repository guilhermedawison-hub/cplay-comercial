-- CPlay-specific extensions to Atomic CRM tables.
alter table public.companies
  add column if not exists neighborhood text;
