--
-- CPlay-specific triggers
--

create or replace trigger products_set_updated_at
    before update on public.products
    for each row execute function public.set_updated_at();

create or replace trigger lead_sources_set_updated_at
    before update on public.lead_sources
    for each row execute function public.set_updated_at();

create or replace trigger cplay_deal_history
    after update on public.deals
    for each row execute function public.log_cplay_deal_changes();
