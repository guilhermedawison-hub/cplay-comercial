-- CPlay production hardening for hosted Supabase.

insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', false)
on conflict (id) do nothing;

revoke execute on function public.cleanup_note_attachments() from anon, authenticated;
revoke execute on function public.handle_contact_note_created_or_updated() from anon, authenticated;
revoke execute on function public.handle_new_user() from anon, authenticated;
revoke execute on function public.handle_update_user() from anon, authenticated;
revoke execute on function public.is_admin() from anon;
