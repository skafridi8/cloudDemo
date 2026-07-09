create table patient_visits (
  id bigint generated always as identity primary key,
  patient_name text not null,
  carer_name text not null,
  visit_time timestamp with time zone not null default now(),
  bathing boolean not null default false,
  medication boolean not null default false,
  meals boolean not null default false,
  mobility boolean not null default false,
  notes text,
  created_at timestamp with time zone default now()
);

alter table patient_visits enable row level security;

create policy "Allow public insert" on patient_visits
  for insert to anon
  with check (true);

create policy "Allow public select" on patient_visits
  for select to anon
  using (true);
