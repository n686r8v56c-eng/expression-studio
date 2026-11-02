create table if not exists public.expression_studio_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.expression_studio_data enable row level security;
drop policy if exists "expression studio select own" on public.expression_studio_data;
drop policy if exists "expression studio insert own" on public.expression_studio_data;
drop policy if exists "expression studio update own" on public.expression_studio_data;
create policy "expression studio select own" on public.expression_studio_data for select to authenticated using (auth.uid()=user_id);
create policy "expression studio insert own" on public.expression_studio_data for insert to authenticated with check (auth.uid()=user_id);
create policy "expression studio update own" on public.expression_studio_data for update to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);
