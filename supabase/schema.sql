-- =====================================================================
-- SN Safety & Signages: database schema
-- Run this whole file once in Supabase -> SQL Editor -> New query.
-- It is idempotent where practical, so re-running is safe.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Admins
-- A user can sign in to /admin only if their auth user id is listed here.
-- ---------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  full_name  text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- Shared trigger to keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- Catalogue
-- ---------------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  tagline     text,
  description text,
  image_url   text,
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.products (
  id                uuid primary key default gen_random_uuid(),
  category_id       uuid references public.categories (id) on delete set null,
  name              text not null,
  slug              text not null unique,
  sku               text,
  short_description text,
  description       text,
  images            text[] not null default '{}',
  features          text[] not null default '{}',
  specs             jsonb not null default '[]'::jsonb, -- [{ "label": "Material", "value": "ACP" }]
  price             numeric(12, 2),                     -- null = "price on request"
  unit              text default 'piece',
  min_order_qty     int not null default 1,
  badge             text,                                -- e.g. "Best Seller", "BIS Certified"
  is_featured       boolean not null default false,
  is_active         boolean not null default true,
  sort_order        int not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_active_idx on public.products (is_active, sort_order);

-- ---------------------------------------------------------------------
-- Leads (contact form, quote requests, product enquiries)
-- ---------------------------------------------------------------------
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text,
  phone       text not null,
  company     text,
  city        text,
  subject     text,
  message     text,
  items       jsonb not null default '[]'::jsonb, -- [{ "product_id", "name", "slug", "quantity" }]
  source      text not null default 'contact'
              check (source in ('contact', 'quote', 'product', 'home', 'manual')),
  status      text not null default 'new'
              check (status in ('new', 'contacted', 'qualified', 'converted', 'lost')),
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists leads_status_idx on public.leads (status, created_at desc);

-- ---------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------
create sequence if not exists public.order_number_seq start 1001;

create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  order_number     text not null unique,
  lead_id          uuid references public.leads (id) on delete set null,
  customer_name    text not null,
  company          text,
  email            text,
  phone            text,
  gstin            text,
  shipping_address text,
  status           text not null default 'pending'
                   check (status in ('pending', 'confirmed', 'in_production', 'dispatched', 'delivered', 'cancelled')),
  payment_status   text not null default 'unpaid'
                   check (payment_status in ('unpaid', 'partial', 'paid', 'refunded')),
  subtotal         numeric(12, 2) not null default 0,
  tax_rate         numeric(5, 2) not null default 18,
  tax_amount       numeric(12, 2) not null default 0,
  shipping_fee     numeric(12, 2) not null default 0,
  total            numeric(12, 2) not null default 0,
  amount_paid      numeric(12, 2) not null default 0,
  expected_dispatch date,
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists orders_status_idx on public.orders (status, created_at desc);

create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders (id) on delete cascade,
  product_id   uuid references public.products (id) on delete set null,
  product_name text not null,
  description  text,
  quantity     int not null check (quantity > 0),
  unit_price   numeric(12, 2) not null default 0,
  line_total   numeric(12, 2) generated always as (quantity * unit_price) stored,
  sort_order   int not null default 0
);
create index if not exists order_items_order_idx on public.order_items (order_id);

-- Human-friendly order numbers: SN-2026-1001
create or replace function public.set_order_number()
returns trigger
language plpgsql
as $$
begin
  if new.order_number is null or new.order_number = '' then
    new.order_number := 'SN-' || to_char(now(), 'YYYY') || '-' || nextval('public.order_number_seq');
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- Marketing content managed from the dashboard
-- ---------------------------------------------------------------------
create table if not exists public.clients (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  logo_url   text,
  website    text,
  sort_order int not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  role       text,
  company    text,
  quote      text not null,
  rating     int not null default 5 check (rating between 1 and 5),
  avatar_url text,
  sort_order int not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- Single-row settings table (id is always 1)
create table if not exists public.site_settings (
  id              int primary key default 1 check (id = 1),
  phone           text,
  phone_alt       text,
  whatsapp        text,
  email           text,
  address         text,
  map_query       text,
  hours           text,
  facebook_url    text,
  instagram_url   text,
  linkedin_url    text,
  youtube_url     text,
  catalog_url     text,
  stats           jsonb not null default '[]'::jsonb, -- [{ "value": 650, "suffix": "+", "label": "Happy customers" }]
  announcement    text,
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------
drop trigger if exists categories_touch on public.categories;
create trigger categories_touch before update on public.categories
  for each row execute function public.touch_updated_at();

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();

drop trigger if exists leads_touch on public.leads;
create trigger leads_touch before update on public.leads
  for each row execute function public.touch_updated_at();

drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();

drop trigger if exists orders_number on public.orders;
create trigger orders_number before insert on public.orders
  for each row execute function public.set_order_number();

drop trigger if exists settings_touch on public.site_settings;
create trigger settings_touch before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- Row Level Security
-- Public visitors: read active catalogue + settings, insert leads.
-- Admins (listed in admin_users): full access.
-- ---------------------------------------------------------------------
alter table public.admin_users   enable row level security;
alter table public.categories    enable row level security;
alter table public.products      enable row level security;
alter table public.leads         enable row level security;
alter table public.orders        enable row level security;
alter table public.order_items   enable row level security;
alter table public.clients       enable row level security;
alter table public.testimonials  enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "admins read admin_users" on public.admin_users;
create policy "admins read admin_users" on public.admin_users
  for select to authenticated using (public.is_admin());

-- Catalogue
drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories
  for select using (is_active or public.is_admin());
drop policy if exists "admins manage categories" on public.categories;
create policy "admins manage categories" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products
  for select using (is_active or public.is_admin());
drop policy if exists "admins manage products" on public.products;
create policy "admins manage products" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read clients" on public.clients;
create policy "public read clients" on public.clients
  for select using (is_active or public.is_admin());
drop policy if exists "admins manage clients" on public.clients;
create policy "admins manage clients" on public.clients
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read testimonials" on public.testimonials;
create policy "public read testimonials" on public.testimonials
  for select using (is_active or public.is_admin());
drop policy if exists "admins manage testimonials" on public.testimonials;
create policy "admins manage testimonials" on public.testimonials
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings
  for select using (true);
drop policy if exists "admins manage settings" on public.site_settings;
create policy "admins manage settings" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Leads: anyone may submit a new lead; only admins can read or change them.
drop policy if exists "public submit leads" on public.leads;
create policy "public submit leads" on public.leads
  for insert to anon, authenticated
  with check (status = 'new' and notes is null);
drop policy if exists "admins manage leads" on public.leads;
create policy "admins manage leads" on public.leads
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Orders: admin only
drop policy if exists "admins manage orders" on public.orders;
create policy "admins manage orders" on public.orders
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins manage order_items" on public.order_items;
create policy "admins manage order_items" on public.order_items
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- Seed data (safe to re-run: uses ON CONFLICT DO NOTHING)
-- =====================================================================
insert into public.site_settings (id, phone, whatsapp, email, address, map_query, hours, stats)
values (
  1,
  '+91 85300 72419',
  '918530072419',
  'snsafetysignages@gmail.com',
  'Unit No. 135, 1st Floor, Dewan Industrial Estate No. 1, Navghar Road, Vasai East, Maharashtra 401210',
  'Dewan Industrial Estate Navghar Road Vasai East',
  'Mon – Sat, 9:00 AM – 6:00 PM',
  '[{"value":5,"suffix":"+","label":"Years of excellence"},{"value":650,"suffix":"+","label":"Happy customers"},{"value":1500,"suffix":"+","label":"Orders fulfilled"},{"value":4.9,"suffix":"★","label":"Google rating"}]'
)
on conflict (id) do nothing;

insert into public.categories (name, slug, tagline, description, sort_order) values
  ('Safety Signages', 'safety-signages', 'ISO 7010 & IS 9457 compliant',
   'High-visibility prohibition, mandatory, warning, fire and safe-condition signs for factories, offices, sites and ships.', 1),
  ('Emergency & Exit Lights', 'exit-lights', 'LED with long battery backup',
   'Sleek exit lights, twin-beam and bulkhead emergency lights that stay on when the power goes out.', 2),
  ('Photoluminescent Signages', 'photoluminescent-signages', 'Glows in the dark, no power needed',
   'Self-luminous escape route signs, way-finding strips and fire equipment markers that glow for hours after a blackout.', 3),
  ('Evacuation Plans', 'evacuation-plans', 'Custom drawn for your floor',
   'Floor-wise evacuation maps, route plans, assembly point and emergency direction signs designed to your layout.', 4),
  ('Safety Tapes', 'safety-tapes', 'Mark hazards, lanes and steps',
   'Vinyl floor marking, hazard, anti-skid and reflective tapes for warehouses, factories and parking.', 5)
on conflict (slug) do nothing;

insert into public.products (category_id, name, slug, short_description, features, specs, badge, is_featured, sort_order)
select c.id, p.name, p.slug, p.short_description, p.features, p.specs::jsonb, p.badge, p.is_featured, p.sort_order
from (values
  ('safety-signages', 'Prohibition Signs', 'prohibition-signs',
   'Red circle-and-slash signs for no smoking, no entry, no open flame and more.',
   array['ISO 7010 symbols', 'UV-resistant print', 'Indoor & outdoor grades'],
   '[{"label":"Material","value":"ACP / Sunboard / Vinyl"},{"label":"Sizes","value":"A5 to A1, custom"},{"label":"Standard","value":"ISO 7010, IS 9457"}]',
   'Best Seller', true, 1),
  ('safety-signages', 'Mandatory Signs', 'mandatory-signs',
   'Blue PPE and instruction signs: wear helmet, goggles, ear protection and more.',
   array['Bold pictograms', 'Bilingual text on request', 'Rust-free substrates'],
   '[{"label":"Material","value":"ACP / Sunboard / Vinyl"},{"label":"Sizes","value":"A5 to A1, custom"},{"label":"Standard","value":"ISO 7010"}]',
   null, false, 2),
  ('safety-signages', 'Warning Signs', 'warning-signs',
   'Yellow hazard triangles for electrical, chemical, forklift and slippery-floor risks.',
   array['High-contrast yellow', 'Weatherproof lamination', 'Custom hazard text'],
   '[{"label":"Material","value":"ACP / Aluminium / Vinyl"},{"label":"Sizes","value":"200 mm to 900 mm"},{"label":"Standard","value":"ISO 7010, IS 9457"}]',
   null, true, 3),
  ('safety-signages', 'Fire Safety Signs', 'fire-safety-signs',
   'Fire extinguisher, hose reel, alarm and fire exit identification signs.',
   array['Fire NOC ready', 'Photoluminescent option', 'Wall & projecting mounts'],
   '[{"label":"Material","value":"Sunboard / Photoluminescent"},{"label":"Sizes","value":"A4, A3, custom"},{"label":"Standard","value":"NBC 2016, ISO 7010"}]',
   null, false, 4),
  ('safety-signages', 'IMO Marine Signs', 'imo-marine-signs',
   'IMO symbols for ships, offshore rigs and ports, approved for marine use.',
   array['IMO A.760(18) symbols', 'Salt-spray resistant', 'Photoluminescent grades'],
   '[{"label":"Material","value":"Rigid PVC / Photoluminescent"},{"label":"Standard","value":"IMO A.760(18)"}]',
   null, false, 5),
  ('exit-lights', 'Sleek LED Exit Light', 'sleek-led-exit-light',
   'Slim acrylic edge-lit exit sign with 3-hour battery backup.',
   array['3 hr Li-ion backup', 'Self-test & manual test', 'Single / double sided'],
   '[{"label":"Backup","value":"3 hours"},{"label":"Input","value":"230 V AC"},{"label":"Housing","value":"Aluminium + acrylic"}]',
   'BIS Certified', true, 1),
  ('exit-lights', 'Twin Beam Emergency Light', 'twin-beam-emergency-light',
   'Two adjustable LED heads that flood corridors and stairwells during outages.',
   array['2 × 3 W LED heads', 'Auto changeover', 'Wall mounting'],
   '[{"label":"Backup","value":"2–4 hours"},{"label":"Battery","value":"Sealed lead acid / Li-ion"},{"label":"Lumens","value":"Up to 600 lm"}]',
   null, true, 2),
  ('exit-lights', 'Bulkhead Emergency Light', 'bulkhead-emergency-light',
   'IP65 rugged bulkhead for basements, plant rooms and outdoor walkways.',
   array['IP65 sealed', 'Maintained / non-maintained', 'Impact-resistant diffuser'],
   '[{"label":"Protection","value":"IP65"},{"label":"Backup","value":"3 hours"},{"label":"Mounting","value":"Wall / ceiling"}]',
   null, false, 3),
  ('exit-lights', 'Beam Light', 'beam-light',
   'Compact single-beam emergency light for offices and retail floors.',
   array['Instant-on LED', 'Charging indicator', 'Low maintenance'],
   '[{"label":"Backup","value":"2 hours"},{"label":"Input","value":"230 V AC"}]',
   null, false, 4),
  ('photoluminescent-signages', 'Glow-in-Dark Exit Signs', 'glow-in-dark-exit-signs',
   'Photoluminescent running-man exit signs that glow for 8+ hours without power.',
   array['8+ hours afterglow', 'Zero electricity', 'Class A pigment'],
   '[{"label":"Afterglow","value":"Up to 8 hours"},{"label":"Material","value":"PL rigid PVC / vinyl"},{"label":"Standard","value":"ISO 7010, ISO 17398"}]',
   'Best Seller', true, 1),
  ('photoluminescent-signages', 'Photoluminescent Way-finding Strips', 'photoluminescent-way-finding-strips',
   'Low-level glowing floor and stair-nosing strips that guide people to exits.',
   array['Anti-slip surface', 'Self-adhesive', 'Direction arrows'],
   '[{"label":"Width","value":"25 mm, 50 mm, 75 mm"},{"label":"Afterglow","value":"Up to 8 hours"}]',
   null, false, 2),
  ('photoluminescent-signages', 'Glow Fire Equipment Markers', 'glow-fire-equipment-markers',
   'Glow-in-dark location signs for extinguishers, hydrants and alarm points.',
   array['Visible in smoke & blackout', 'Wall & pillar wraps'],
   '[{"label":"Material","value":"PL vinyl / rigid PVC"},{"label":"Afterglow","value":"Up to 8 hours"}]',
   null, false, 3),
  ('evacuation-plans', 'Floor-wise Evacuation Plans', 'floor-wise-evacuation-plans',
   'Custom drawn evacuation maps for each floor with "You are here" markers.',
   array['Drawn from your floor plan', 'Photoluminescent print option', 'Framed or direct mount'],
   '[{"label":"Sizes","value":"A3, A2, A1"},{"label":"Turnaround","value":"3–5 working days"}]',
   'Custom', true, 1),
  ('evacuation-plans', 'Assembly Point Signs', 'assembly-point-signs',
   'Pole and wall mounted assembly point signs, readable from a distance.',
   array['Reflective grade available', 'Pole kit included'],
   '[{"label":"Material","value":"Aluminium / ACP"},{"label":"Sizes","value":"450 × 600 mm, custom"}]',
   null, false, 2),
  ('evacuation-plans', 'Emergency Direction Signs', 'emergency-direction-signs',
   'Arrow and route signs that lead people along the escape path.',
   array['Left, right, up, down arrows', 'Photoluminescent option'],
   '[{"label":"Material","value":"Sunboard / PL PVC"},{"label":"Standard","value":"ISO 7010"}]',
   null, false, 3),
  ('safety-tapes', 'Floor Marking Tapes', 'floor-marking-tapes',
   'Heavy-duty vinyl tapes for aisles, lanes and storage zones in 7 colours.',
   array['Forklift traffic grade', 'Residue-free removal', 'Yellow, red, green, blue, white'],
   '[{"label":"Width","value":"48 mm, 72 mm"},{"label":"Length","value":"30 m roll"}]',
   null, true, 1),
  ('safety-tapes', 'Hazard Warning Tapes', 'hazard-warning-tapes',
   'Black-yellow and red-white striped tapes for edges, pillars and danger zones.',
   array['High-visibility stripes', 'Strong adhesive'],
   '[{"label":"Width","value":"48 mm, 72 mm"},{"label":"Length","value":"30 m roll"}]',
   null, false, 2),
  ('safety-tapes', 'Anti-Skid Tapes', 'anti-skid-tapes',
   'Grit-coated tapes for ramps, stairs and wet areas.',
   array['Mineral grit surface', 'Indoor & outdoor'],
   '[{"label":"Width","value":"25 mm, 50 mm, 100 mm"},{"label":"Length","value":"18 m roll"}]',
   null, false, 3),
  ('safety-tapes', 'Reflective Tapes', 'reflective-tapes',
   'Retro-reflective tapes for vehicles, barriers and night-time visibility.',
   array['Prismatic reflectivity', 'Weather resistant'],
   '[{"label":"Width","value":"50 mm"},{"label":"Length","value":"45 m roll"}]',
   null, false, 4)
) as p(category_slug, name, slug, short_description, features, specs, badge, is_featured, sort_order)
join public.categories c on c.slug = p.category_slug
on conflict (slug) do nothing;

insert into public.clients (name, sort_order)
select v.name, v.sort_order from (values
  ('Aditya Birla Group', 1), ('Mumbai Metro (MMRC)', 2), ('Bank of India', 3),
  ('HDFC Bank', 4), ('Jaypee Hotels', 5), ('L&T Construction', 6)
) as v(name, sort_order)
where not exists (select 1 from public.clients);

insert into public.testimonials (name, role, company, quote, sort_order)
select v.name, v.role, v.company, v.quote, v.sort_order from (values
  ('Rahul Mehta', 'Facility Manager', 'Logistics park, Bhiwandi',
   'They surveyed our warehouse, drew the evacuation plans and installed 300+ signs in a week. Fire NOC audit went through first time.', 1),
  ('Priya Nair', 'EHS Officer', 'Pharma plant, Tarapur',
   'Photoluminescent signs are bright and well finished. Pricing was clear from the first quote and dispatch was within 3 days.', 2),
  ('Sandeep Kulkarni', 'Project Engineer', 'Commercial tower, Thane',
   'Ordered exit lights and floor tapes in bulk. Good quality, responsive team and they replaced a faulty unit without any fuss.', 3)
) as v(name, role, company, quote, sort_order)
where not exists (select 1 from public.testimonials);

-- =====================================================================
-- Make yourself an admin (run AFTER creating the user in
-- Authentication -> Users -> Add user). Replace the email below.
-- =====================================================================
-- insert into public.admin_users (user_id, full_name)
-- select id, 'Owner' from auth.users where email = 'you@example.com'
-- on conflict (user_id) do nothing;
