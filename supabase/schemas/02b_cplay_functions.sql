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

create or replace function public.log_cplay_deal_changes()
returns trigger
language plpgsql
set search_path to 'public'
as $$
begin
  if old.stage is distinct from new.stage then
    insert into public.deal_notes (deal_id, type, text, date)
    values (
      new.id,
      'system',
      'Etapa alterada de "' || coalesce(old.stage, 'não informada') || '" para "' || coalesce(new.stage, 'não informada') || '".',
      now()
    );
  end if;

  if old.sales_id is distinct from new.sales_id then
    insert into public.deal_notes (deal_id, type, text, date)
    values (
      new.id,
      'system',
      'Responsável comercial alterado.',
      now()
    );
  end if;

  if old.amount is distinct from new.amount then
    insert into public.deal_notes (deal_id, type, text, date)
    values (
      new.id,
      'system',
      'Valor da oportunidade alterado de ' || coalesce(old.amount::text, 'não informado') || ' para ' || coalesce(new.amount::text, 'não informado') || '.',
      now()
    );
  end if;

  if old.next_follow_up_at is distinct from new.next_follow_up_at
     or old.next_follow_up_type is distinct from new.next_follow_up_type
     or old.next_follow_up_note is distinct from new.next_follow_up_note then
    if old.next_follow_up_at is not null
       or old.next_follow_up_type is not null
       or old.next_follow_up_note is not null then
      insert into public.deal_notes (deal_id, type, text, date)
      values (
        new.id,
        'follow_up',
        'Follow-up anterior: ' ||
        coalesce(old.next_follow_up_at::text, 'sem data') ||
        case when old.next_follow_up_type is not null then ' | ' || old.next_follow_up_type else '' end ||
        case when old.next_follow_up_note is not null and old.next_follow_up_note <> '' then ' | ' || old.next_follow_up_note else '' end,
        now()
      );
    end if;
  end if;

  return new;
end;
$$;
