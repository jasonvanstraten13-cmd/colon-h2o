-- Colon H2O booking system schema
-- Run this in the Supabase SQL editor (Project → SQL Editor → New query).

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  service text not null,
  requested_date date not null,
  requested_time text not null,
  message text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'denied')),
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_status_idx on public.bookings (status);
create index if not exists bookings_requested_date_idx on public.bookings (requested_date);

-- keep updated_at current on every row change
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

alter table public.bookings enable row level security;

-- Anyone (including anonymous site visitors) can submit a booking request.
drop policy if exists "public can insert bookings" on public.bookings;
create policy "public can insert bookings"
  on public.bookings for insert
  to anon, authenticated
  with check (status = 'pending');

-- Only logged-in admins (Supabase Auth users) can view all bookings.
drop policy if exists "admins can view bookings" on public.bookings;
create policy "admins can view bookings"
  on public.bookings for select
  to authenticated
  using (true);

-- Only logged-in admins can approve/deny (update) bookings.
drop policy if exists "admins can update bookings" on public.bookings;
create policy "admins can update bookings"
  on public.bookings for update
  to authenticated
  using (true)
  with check (true);

-- No public delete/select policy exists, so anonymous users can only insert, never read or change bookings.

-- Minimal public view so the booking page can grey out already-approved hourly slots
-- without exposing client names/emails/phone numbers to anonymous visitors.
create or replace view public.approved_slots as
  select requested_date, requested_time
  from public.bookings
  where status = 'approved';

grant select on public.approved_slots to anon, authenticated;

-- After creating this table, create your one admin user in
-- Supabase Dashboard → Authentication → Users → Add user (email + password).
