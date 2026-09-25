# Go‑Live Checklist — Colon H2O

✅ Formspark ID inserted in `ContactForm.js` (hKJZmH4nT)
✅ Email template uploaded to Formspark (`src/templates/formspark-email.hbs`)
✅ Email notifications enabled in Formspark dashboard
✅ Test submission successful (use form on `/contact`)
✅ WhatsApp link formatting tested (hidden `whatsapp` updated on input)
✅ Redirect to `/thank-you` works after form submit
✅ No `.html` exposed (use `.htaccess` rewrite)
✅ Legal pages (`/privacy-policy`, `/terms-policy`) present and exact
✅ Accent colours and fonts validated (Turquoise + Navy; Poppins + Inter)
✅ SEO metadata inserted (see `SEO_MAPPING.md`)
✅ Favicon included (`public/favicon.ico`)
✅ Lighthouse performance checks — target 90+
✅ Mobile responsiveness validated

Deployment
- Run `npm run build`
- Upload `dist` (or `build`) contents to `public_html/` on cPanel
- Confirm `.htaccess` is present in `public_html/`
- Verify site URL, forms and refresh/reload behaviour (no 404s)
