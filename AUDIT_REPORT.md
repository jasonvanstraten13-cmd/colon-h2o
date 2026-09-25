# Audit Summary — ColonH2O (initial findings)

**Quick findings:**
- Site is a WordPress site with clear, service-focused content (primary service: Colon Hydrotherapy). 
- Missing/unclear legal pages and modern contact workflow — ideal candidate for a full React rebuild, Formspark integration and POPIA-aligned legal pages.

## Phase 1: Technical issues
- Legacy WordPress markup (wp-content references).
- No SPA routing, potential .html exposure across legacy URLs.
- Forms use server-side/legacy plugin (no Formspark). Formspark ID provided and will be integrated.
- Large gallery images (not optimised/lazy-loaded).
- Unknown/limited caching & compression (server-side needs configuration).

## UX problems
- Outdated layout and small CTAs on mobile.
- Inconsistent spacing and typography.
- No clear conversion funnel (book → confirm → thank-you flow not modernised).
- Gallery and testimonials buried in long pages.

## SEO problems
- Thin on-page SEO metadata for targeted keywords (homepage and service pages need optimized title/meta/H1/H2).
- No structured location targeting (Pretoria / Silver Lakes) in metadata.
- Image alt attributes are inconsistent or missing.

## Legal & compliance gaps
- `privacy-policy` / `terms-policy` routes not present or not easily discoverable.
- POPIA-aligned wording missing; privacy contact present (jeanette@colonh2o.co.za) but no formal policy page.

---

## Renovation plan (high level)
1. Phase 1 — Audit & Design: finalise brand palette, fonts, CTAs and content hierarchy.
2. Phase 2 — Rebuild (React + Vite): SPA with React Router, component library, Formspark native form, WhatsApp formatting logic, lazy-loaded images and minimal dependencies.
3. Phase 3 — SEO & Legal: add metadata, POPIA privacy-policy and terms-policy pages, upload Formspark email template.
4. Phase 4 — Testing & Deploy: lighthouse run (target 90+), form test, build and deploy to cPanel (`npm run build` → public_html/), verify `.htaccess` rewrite.

Deliverables for go-live: full React project, `.htaccess`, Formspark email template, SEO mapping table, audit report, go-live checklist.
