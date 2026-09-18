--
-- CPlay-specific grants
--

grant all on function public.set_updated_at() to anon;
grant all on function public.set_updated_at() to authenticated;
grant all on function public.set_updated_at() to service_role;

grant all on function public.log_cplay_deal_changes() to anon;
grant all on function public.log_cplay_deal_changes() to authenticated;
grant all on function public.log_cplay_deal_changes() to service_role;

grant all on table public.products to anon;
grant all on table public.products to authenticated;
grant all on table public.products to service_role;

grant all on table public.lead_sources to anon;
grant all on table public.lead_sources to authenticated;
grant all on table public.lead_sources to service_role;

grant all on sequence public.products_id_seq to anon;
grant all on sequence public.products_id_seq to authenticated;
grant all on sequence public.products_id_seq to service_role;

grant all on sequence public.lead_sources_id_seq to anon;
grant all on sequence public.lead_sources_id_seq to authenticated;
grant all on sequence public.lead_sources_id_seq to service_role;
