--
-- CPlay-specific triggers
--

create or replace trigger products_set_updated_at
    before update on public.products
    for each row execute function public.set_updated_at();

create or replace trigger lead_sources_set_updated_at
    before update on public.lead_sources
    for each row execute function public.set_updated_at();
