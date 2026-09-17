--
-- CPlay helper functions
-- Keep CPlay-specific database extensions isolated from Atomic CRM upstream.
--

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path to 'public'
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
