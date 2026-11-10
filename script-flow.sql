-- Run in the existing Supabase project's SQL Editor. Existing Expression Studio tables are untouched.
create table if not exists public.script_flow_items (
 id uuid primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 payload jsonb not null default '{}'::jsonb,
 updated_at timestamptz not null default now()
);
create index if not exists script_flow_items_user_id_idx on public.script_flow_items(user_id);
alter table public.script_flow_items enable row level security;
create policy "script_flow_select_own" on public.script_flow_items for select to authenticated using ((select auth.uid())=user_id);
create policy "script_flow_insert_own" on public.script_flow_items for insert to authenticated with check ((select auth.uid())=user_id);
create policy "script_flow_update_own" on public.script_flow_items for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "script_flow_delete_own" on public.script_flow_items for delete to authenticated using ((select auth.uid())=user_id);
grant select,insert,update,delete on public.script_flow_items to authenticated;
