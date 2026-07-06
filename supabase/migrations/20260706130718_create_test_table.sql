create table test_notes (
  id bigint generated always as identity primary key,
  content text,
  created_at timestamp with time zone default now()
);