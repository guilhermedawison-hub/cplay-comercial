-- CPlay monetary fields must support Brazilian cent values such as R$ 149,90.
-- Keep this as a separate migration because the foundation migration initially
-- created these fields as bigint.

alter table public.products
  alter column base_price type numeric(12,2)
  using base_price::numeric(12,2);

alter table public.deals
  alter column amount type numeric(12,2)
  using amount::numeric(12,2);
