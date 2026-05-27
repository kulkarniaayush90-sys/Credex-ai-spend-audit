create extension if not exists "pgcrypto";

create table if not exists public.audit_reports (
  id text primary key,
  report_json jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.lead_captures (
  id uuid primary key default gen_random_uuid(),
  audit_id text not null references public.audit_reports(id) on delete cascade,
  email text not null,
  company text not null,
  role text not null,
  team_size integer not null,
  created_at timestamptz not null default now()
);

create index if not exists lead_captures_audit_id_idx on public.lead_captures (audit_id);
create index if not exists audit_reports_created_at_idx on public.audit_reports (created_at desc);

