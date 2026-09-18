--
-- CPlay-specific Row Level Security policies
--

alter table public.products enable row level security;
alter table public.lead_sources enable row level security;

create policy "Products read for authenticated users" on public.products
  for select to authenticated using (true);
create policy "Products insert for authenticated users" on public.products
  for insert to authenticated with check (true);
create policy "Products update for authenticated users" on public.products
  for update to authenticated using (true) with check (true);
create policy "Products delete for authenticated users" on public.products
  for delete to authenticated using (true);

create policy "Lead sources read for authenticated users" on public.lead_sources
  for select to authenticated using (true);
create policy "Lead sources insert for authenticated users" on public.lead_sources
  for insert to authenticated with check (true);
create policy "Lead sources update for authenticated users" on public.lead_sources
  for update to authenticated using (true) with check (true);
create policy "Lead sources delete for authenticated users" on public.lead_sources
  for delete to authenticated using (true);
