# Colon H2O — React rebuild (StratStudios)

Overview
- Modern React SPA (Vite)
- Formspark contact form integration (native POST)
- POPIA-ready legal pages, SEO mapping, and deployment instructions
- Supabase-backed booking system with an admin portal (calendar + approve/deny + email notifications)

Quick start
1. npm install
2. Copy `.env.example` to `.env` and fill in your Supabase project URL/anon key
3. npm run dev (development)
4. npm run build (production) — deploy `/dist` (Vercel, or upload to `public_html/` on cPanel)

Important files
- `src/components/ContactForm.jsx` — Formspark native form + WhatsApp formatting
- `.htaccess` — SPA rewrite for cPanel
- `src/templates/formspark-email.hbs` — Handlebars email template for Formspark
- `src/pages/Book.jsx` — public booking request form (writes to Supabase `bookings` table)
- `src/pages/admin/AdminLogin.jsx`, `src/pages/admin/AdminDashboard.jsx` — admin portal (calendar + approve/deny)
- `src/components/RequireAdminAuth.jsx` — route guard using Supabase Auth session
- `supabase/schema.sql` — table + Row Level Security policies to run in the Supabase SQL editor
- `supabase/functions/send-booking-email/index.ts` — Edge Function that emails the client and staff on approve/deny

## Booking system setup (Supabase)

1. Create a project at supabase.com.
2. In the SQL editor, run `supabase/schema.sql` to create the `bookings` table and RLS policies.
3. In Authentication → Users, manually add one admin user (email + password). Sign-up is not exposed publicly.
4. In Project Settings → API, copy the Project URL and anon public key into your `.env` as
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (also set these in Vercel → Project → Environment Variables).
5. Sign up at resend.com, verify a sending domain, and grab an API key.
6. Deploy the Edge Function (requires the Supabase CLI):
   ```
   supabase login
   supabase link --project-ref <your-project-ref>
   supabase secrets set RESEND_API_KEY=... NOTIFY_FROM_EMAIL=bookings@colonh2o.co.za RESPONSIBLE_EMAILS=jeanette@colonh2o.co.za
   supabase functions deploy send-booking-email
   ```
7. Visit `/book` to submit a test request, then `/admin/login` to sign in and approve/deny it — both the client and the addresses in `RESPONSIBLE_EMAILS` receive an email.

Deployment to cPanel
1. npm run build
2. Upload the `dist` (or `build`) folder contents to `public_html/`
3. Ensure `.htaccess` is present in `public_html/` (it is included in this project)

Go-live checklist: `GO-LIVE-CHECKLIST.md`

If you want me to build and push the final production zip here, confirm and I will generate the production build files next.