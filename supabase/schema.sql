create extension if not exists pgcrypto;

create table if not exists public.links (
  id uuid primary key default gen_random_uuid(),
  label text not null check (char_length(label) between 1 and 40),
  url text not null check (url ~ '^https://'),
  icon text not null default 'globe',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.links drop constraint if exists links_icon_check;
update public.links set icon = case icon when 'ethereum' then 'bookfire' when 'substack' then 'stack' when 'github' then 'branch' when 'linkedin' then 'bridge' else icon end
where icon in ('ethereum', 'substack', 'github', 'linkedin');
alter table public.links add constraint links_icon_check check (icon in ('bookfire', 'stack', 'branch', 'bridge', 'globe', 'quill', 'spark', 'signal', 'portal', 'prism', 'knot', 'beacon'));

create table if not exists public.site_settings (
  id text primary key,
  media_url text not null check (media_url ~ '^https://'),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.links enable row level security;
alter table public.site_admins enable row level security;
alter table public.site_settings enable row level security;
revoke all on table public.links from anon, authenticated;
revoke all on table public.site_admins from anon, authenticated;
revoke all on table public.site_settings from anon, authenticated;
grant select on table public.links to anon, authenticated;
grant insert, update, delete on table public.links to authenticated;
grant select on table public.site_admins to authenticated;
grant select on table public.site_settings to anon, authenticated;
grant update on table public.site_settings to authenticated;

drop policy if exists "Public links are readable" on public.links;
create policy "Public links are readable" on public.links for select to anon, authenticated using (true);
drop policy if exists "Admins can add links" on public.links;
create policy "Admins can add links" on public.links for insert to authenticated with check (exists (select 1 from public.site_admins where user_id = (select auth.uid())));
drop policy if exists "Admins can update links" on public.links;
create policy "Admins can update links" on public.links for update to authenticated using (exists (select 1 from public.site_admins where user_id = (select auth.uid()))) with check (exists (select 1 from public.site_admins where user_id = (select auth.uid())));
drop policy if exists "Admins can remove links" on public.links;
create policy "Admins can remove links" on public.links for delete to authenticated using (exists (select 1 from public.site_admins where user_id = (select auth.uid())));
drop policy if exists "Admins can see their membership" on public.site_admins;
create policy "Admins can see their membership" on public.site_admins for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Public settings are readable" on public.site_settings;
create policy "Public settings are readable" on public.site_settings for select to anon, authenticated using (true);
drop policy if exists "Admins can update settings" on public.site_settings;
create policy "Admins can update settings" on public.site_settings for update to authenticated using (exists (select 1 from public.site_admins where user_id = (select auth.uid()))) with check (exists (select 1 from public.site_admins where user_id = (select auth.uid())));

insert into public.links (label, url, icon, sort_order)
select seed.label, seed.url, seed.icon, seed.sort_order
from (values
  ('Ethereum Papers', 'https://ethpapers.xyz/', 'bookfire', 0),
  ('Substack', 'https://kichongtran.substack.com/', 'stack', 1),
  ('GitHub', 'https://github.com/kichong', 'branch', 2),
  ('LinkedIn', 'https://www.linkedin.com/in/kichongtran/', 'bridge', 3)
) as seed(label, url, icon, sort_order)
where not exists (select 1 from public.links);

insert into public.site_settings (id, media_url) values ('default', 'https://www.youtube.com/watch?v=3G4kCi_ldr8') on conflict (id) do nothing;

-- After creating the owner in Authentication > Users, run this separately:
-- insert into public.site_admins (user_id)
-- select id from auth.users where email = 'OWNER_EMAIL_HERE';
