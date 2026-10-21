# SN Safety & Signages

Website and admin dashboard for **SN Safety & Signages**, a manufacturer of safety signages, emergency and exit lights, photoluminescent signs, evacuation plans and safety tapes.

**Stack:** Next.js 16 (App Router, Cache Components), TypeScript, Tailwind CSS v4, Supabase (Postgres + Auth), Cloudinary (media).

## What's inside

| Area | Routes |
| --- | --- |
| Public site | `/` home, `/products` (filter + search), `/products/[slug]`, `/about`, `/contact`, `/quote` (quote basket) |
| Admin | `/admin/login`, `/admin` dashboard, leads, orders (with proforma invoice), products, categories, clients, testimonials, settings |

### How the business flow works

1. A visitor browses products and adds items to the **quote basket** (stored in their browser), or fills the contact or product enquiry form.
2. The submission becomes a **lead** in Supabase (`source` = contact, quote, product or home).
3. In **Admin → Leads**, staff call or WhatsApp the customer, update the status (new → contacted → qualified) and keep notes.
4. **Convert to order** pre-fills an order with the customer's details and the quoted products. The lead is marked *converted*.
5. The order moves through `pending → confirmed → in_production → dispatched → delivered`, with payment tracking and a printable **proforma invoice**.
6. Products, categories, client logos, testimonials, contact details and the trust numbers are all edited from the dashboard. Changes appear on the website immediately, because the public cache is expired by tag.

Until Supabase is connected, the public site shows built-in seed content (`lib/seed.ts`), so it always renders.

## Setup

### 1. Install

```bash
npm install
cp .env.example .env.local
```

### 2. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste all of [`supabase/schema.sql`](supabase/schema.sql) and run it. This creates the tables, security policies and seed data.
3. In **Project Settings → API**, copy the project URL and the anon key into `.env.local`.
4. Create your admin login: **Authentication → Users → Add user** (email + password, tick *Auto confirm*).
5. Grant that user admin access by running this in the SQL editor:

   ```sql
   insert into public.admin_users (user_id, full_name)
   select id, 'Your Name' from auth.users where email = 'you@example.com';
   ```

6. Recommended: **Authentication → Providers → Email**, turn off *Allow new users to sign up*, so only users you create can exist.

### 3. Cloudinary

Copy your **Cloud name**, **API key** and **API secret** from the Cloudinary dashboard into `.env.local`. Uploads are signed on the server (`/api/admin/cloudinary-signature`), so the secret never reaches the browser.

### 4. Run

```bash
npm run dev     # http://localhost:3000
npm run build && npm start
```

Restart the dev server after changing `.env.local`. `NEXT_PUBLIC_*` values are baked in at build time, so rebuild after changing them in production.

## 3D characters

Character slots are listed in [`lib/characters.ts`](lib/characters.ts). Each slot shows a vector illustration until you add a render:

1. Export a transparent PNG/WebP (about 1000px tall).
2. Put it in `public/characters/`.
3. Set that slot's `src`, for example `src: "/characters/hero-engineer.png"`.

## Project structure

```
app/
  (site)/            public pages + shared header/footer layout
  admin/
    login/           sign-in page
    (panel)/         dashboard pages (sidebar layout)
    (print)/         printable proforma invoice
    actions/         server actions (auth, leads, orders, catalog, content)
  api/admin/         Cloudinary signature, leads CSV export
  actions/leads.ts   public lead submission
components/
  site/  home/  ui/  admin/
lib/
  data/public.ts     cached public reads ("use cache" + tags)
  data/admin.ts      admin reads (session-checked)
  auth.ts            admin session / role check
  supabase/          Supabase clients
  seed.ts            fallback content
proxy.ts             refreshes the session, guards /admin
supabase/schema.sql  database schema, RLS and seed data
```

## Security notes

- Row Level Security is enabled on every table. Visitors can read live catalogue content and insert new leads. Only users listed in `admin_users` can read leads and orders or change anything.
- Every admin page and server action re-checks the admin role on the server (`lib/auth.ts`). `proxy.ts` is only the first gate.
- The lead form uses a honeypot field and server-side validation (zod).
