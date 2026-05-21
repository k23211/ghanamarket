-- Supabase setup for Agriquex job applications
create table if not exists job_applications (
  id uuid default gen_random_uuid() primary key,
  job_id text not null,
  applicant_name text not null,
  applicant_email text not null,
  message text,
  created_at timestamptz default now()
);

-- 2) Optional: enable Row Level Security
-- Uncomment if you want RLS enabled on this table.
-- alter table job_applications enable row level security;

-- 3) Optional: RLS policy examples for server-side access
-- If you rely on service role API routes, you may not need specific policies.
-- create policy "Allow service role inserts" on job_applications
--   for insert using (auth.role() = 'service_role');

-- create policy "Allow service role selects" on job_applications
--   for select using (auth.role() = 'service_role');

-- 4) If you want signed-in users to read their own applications only
-- create policy "Users can select own applications" on job_applications
--   for select using (auth.uid() = applicant_id);

-- 5) If you want signed-in users to create their own applications
-- alter table job_applications add column if not exists applicant_id uuid;
-- create policy "Users can insert own applications" on job_applications
--   for insert with check (auth.uid() = applicant_id);
