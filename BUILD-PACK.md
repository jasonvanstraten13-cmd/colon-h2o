# COLON H2O — WEBSITE BUILD PACK
## StratStudios | Build Reference v1.0 | 2 March 2026

---

## 1. CLIENT INPUT SUMMARY

| Field | Value |
|---|---|
| Business Name | Colon H2O |
| Legal Entity | Colon H2O (Pty) Ltd |
| Registration Number | N/A |
| Therapist | Jeanette van der Merwe |
| Qualification | RICTAT Certified Colon Hydrotherapist |
| Phone | 082 564 2526 |
| Email | jeanette@colonh2o.co.za |
| Address | 9 Nicklaus Street, Silver Lakes Golf Estate, Pretoria, 0081 |
| Tagline | A gentle way of cleaning your colon and reactivating its natural movement. |
| Brand Values | Wellbeing, Safety, Professionalism, Natural Healing |
| Brand Aesthetic | Clinical, serene, modern, luminous, professional |
| Brand Tone | Professional, Informative, Reassuring, Authoritative |

---

## 2. BRAND & DESIGN TOKENS

| Token | Value |
|---|---|
| Primary | `#01bbd6` |
| Primary Dark | `#00aac3` |
| White | `#ffffff` |
| Gray | `#a7a9ac` |
| Background (section) | `#f0fdff` |
| Text Dark | `#1a2e35` |
| Text Body | `#3a4a50` |
| Heading Font | Poppins (Google Fonts) — weights 300/400/500/600/700/800 |
| Body Font | Open Sans (Google Fonts) — weights 300/400/500/600 |
| Border Radius | 12px (default), 20px (large), 50px (pill buttons) |
| Icon Library | Font Awesome 6.5.0 (CDN) — SVG-based, no emoji |

---

## 3. SITEMAP & PAGE GOALS

| Page | File | Goal |
|---|---|---|
| Home | `index.html` | Introduce brand, establish trust, drive bookings |
| About | `about.html` | Build credibility, explain process, meet Jeanette |
| Contact | `contact.html` | Convert visitors into enquiries/bookings |
| Thank You | `thank-you.html` | Confirm form submission, offer alternative contact |
| Privacy Policy | `privacy-policy.html` | POPIA legal compliance |
| Terms of Use | `terms-policy.html` | Legal use terms, SA governing law |

---

## 4. GLOBAL UI COMPONENTS

### Header Behaviour
- **Initial load:** 80px height (`--nav-height: 80px`)
- **On scroll (>60px):** Shrinks to 60px (`--nav-shrunk: 60px`), adds box-shadow
- **Logo:** Shrinks proportionally with header
- **Background:** White with backdrop-filter blur
- **Mobile:** Hamburger menu → animated slide-down mobile nav drawer
- **Desktop (1024px+):** Full nav links + call/WhatsApp CTA buttons visible

### Footer Implementation
- 4-column grid (Brand | Navigate | Legal | Contact)
- Collapses to 1-column on mobile, 2-col on tablet
- Contains: Privacy Policy link, Terms of Use link
- **StratStudios Credit:** Grid-based button, rounded corners (8px), translucent background (`rgba(255,255,255,0.06)`), hover lift + teal border highlight, focus-visible outline, full-width on mobile
- Credit links to: `https://stratstudios.co.za` (opens new tab)

### Floating Contact Bar (Mobile Only)
- Fixed bottom bar with Call / WhatsApp / Book buttons
- Hidden on desktop (1024px+)
- Animated entrance on page load

---

## 5. PAGE-BY-PAGE SECTION OUTLINES

### index.html (Homepage)
1. Hero — Eyebrow badge + H1 + subtext + CTA group + trust indicators
2. What Is Colon Hydrotherapy — 3 feature cards (Purified Water / Probiotic Implant / Sterile)
3. Services & Products — 4 service cards (Therapy / Probiotics / Enzymes / Parasite Cleanser)
4. Why Choose Colon H2O — Split layout (image + steps)
5. Who Can Benefit — 3 cards (Bloating / Constipation / IBS)
6. CTA Strip — Call, WhatsApp, Book CTA

### about.html
1. Page Hero — Breadcrumb + H1 + subtext
2. About Jeanette — Split layout with credential badge
3. Qualifications & Standards — 3 cards (RICTAT / Sterile Equipment / Client-First)
4. What to Expect — 5-step numbered process
5. CTA Strip

### contact.html
1. Page Hero — Breadcrumb + H1 + subtext
2. Quick Contact Buttons — Call / WhatsApp / Email in one row
3. Contact Section — Contact form (left) + Contact info cards (right)
4. Google Maps Embed

### thank-you.html
1. Centred card layout — Checkmark icon + confirmation message + return/contact CTAs

### privacy-policy.html & terms-policy.html
1. Page Hero
2. Legal content in constrained container with left-border effective date block

---

## 6. CTA SYSTEM

### CTA Types & Placements
| CTA | Style | Pages |
|---|---|---|
| Book an Appointment | `btn-primary` | All pages (nav, hero, strips) |
| Call: 082 564 2526 | `btn-call` | All pages nav, strips, footer, floating bar |
| WhatsApp Jeanette | `btn-whatsapp` | All pages nav, strips, footer, floating bar |
| Send a Message | `btn-primary` | contact.html form |
| Return Home | `btn-primary` | thank-you.html |
| Learn More | `btn-outline` | Homepage hero |

---

## 7. CONTACT FORM SPECIFICATION

| Field | Type | Required | Notes |
|---|---|---|---|
| Full Name | text | Yes | autocomplete="name" |
| Email Address | email | Yes | autocomplete="email" |
| Phone Number | tel | No | autocomplete="tel" |
| Service of Interest | select | No | 5 options + general enquiry |
| Message | textarea | Yes | min-height: 120px |

- **Backend:** Formspark
- **Endpoint:** `https://submit-form.com/hKJZmH4nT`
- **Method:** POST
- **Redirect on success:** `thank-you.html` (via `_redirect` hidden field)
- **Anti-spam:** `_gotcha` honeypot field (hidden)
- **Double-submit prevention:** Submit button disabled + label changed to "Sending…" on submit
- **Privacy consent notice:** Inline note linking to privacy-policy.html

---

## 8. WHATSAPP & CALL INTEGRATION

### Call Button
```
tel:0825642526
```

### WhatsApp Button
```
https://wa.me/27825642526?text=Hi%20Jeanette%2C%20I%27d%20like%20to%20find%20out%20more%20about%20colon%20hydrotherapy%20at%20Colon%20H2O%20and%20book%20a%20session.
```

**Decoded message:**
> Hi Jeanette, I'd like to find out more about colon hydrotherapy at Colon H2O and book a session.

**WhatsApp number:** +27 82 564 2526 (wa.me format: `27825642526`)

---

## 9. ANIMATION SPECIFICATION

| Animation | Element | Type |
|---|---|---|
| Hero background shapes | `.hero-bg-shape` | CSS keyframe float loop (translateY + scale) |
| Scroll reveal | `.reveal` | IntersectionObserver + CSS opacity/translateY |
| Card hover lift | `.card`, `.service-card` | CSS transform translateY(-6px) |
| Header shrink | `#site-header` | CSS transition on height/shadow |
| Button hover lift | `.btn` | CSS transform translateY(-2px) |
| Mobile nav slide | `.mobile-nav` | CSS keyframe slideDown |
| Floating bar entrance | `.floating-bar` | CSS keyframe floatBar (delay 0.8s) |
| Contact info hover | `.contact-info-item` | CSS transform translateX(4px) |
| Process step stagger | `.step-item` | Reveal delay classes (0.1–0.4s) |
| Thank-you card | `.thankyou-card` | CSS fadeInUp 0.7s |

---

## 10. SEO PACK

### homepage (index.html)
- **Title:** `Colon Hydrotherapy Pretoria | Colon H2O — Silver Lakes`
- **Meta:** Professional colon hydrotherapy in Pretoria by RICTAT-certified therapist Jeanette van der Merwe. Gentle colon cleansing, probiotic implants & digestive health products at Silver Lakes.
- **H1:** A Gentle Way to Cleanse Your Colon & Restore Natural Movement
- **Keywords:** colon hydrotherapy Pretoria, colon cleansing Silver Lakes, colon irrigation Gauteng, RICTAT certified therapist, digestive health Pretoria

### about.html
- **Title:** `About Jeanette van der Merwe — RICTAT Colon Hydrotherapist Pretoria | Colon H2O`
- **Meta:** Meet Jeanette van der Merwe, RICTAT-certified Colon Hydrotherapist at Colon H2O in Silver Lakes, Pretoria.
- **H1:** About Colon H2O
- **Keywords:** RICTAT certified colon hydrotherapist Pretoria, Jeanette van der Merwe, professional colon cleansing Gauteng

### contact.html
- **Title:** `Book a Colon Hydrotherapy Session Pretoria | Contact Colon H2O`
- **Meta:** Book your colon hydrotherapy session in Pretoria with Jeanette van der Merwe at Colon H2O, Silver Lakes.
- **H1:** Get in Touch
- **Keywords:** book colon hydrotherapy Pretoria, contact Colon H2O, colon cleansing appointment Silver Lakes

### Privacy & Terms pages
- `<meta name="robots" content="noindex, follow">`

---

## 11. LEGAL PAGES — CHECKLIST

### privacy-policy.html ✅
- [x] POPIA aligned (Protection of Personal Information Act 4 of 2013)
- [x] Responsible Party details populated (Colon H2O Pty Ltd)
- [x] Registered address included
- [x] Contact and privacy email: jeanette@colonh2o.co.za
- [x] Phone number: 082 564 2526
- [x] Formspark usage explicitly stated (Section 6)
- [x] StratStudios referenced as technical provider only (Section 7)
- [x] Data subject rights (Section 11)
- [x] Information Regulator reference (Section 12)
- [x] Effective Date: 1 March 2026

### terms-policy.html ✅
- [x] Governing law: Republic of South Africa
- [x] Client legal name and address populated
- [x] StratStudios limitation of responsibility (Section 7)
- [x] Health information disclaimer (Section 4)
- [x] Consumer Protection Act caveat (Section 6)
- [x] Effective Date: 1 March 2026

---

## 12. IMPLEMENTATION NOTES

### File Structure
```
e:\10. Websites\2. Colon h2o\
├── index.html
├── about.html
├── contact.html
├── thank-you.html
├── privacy-policy.html
├── terms-policy.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
└── assets/
    ├── images/
    │   ├── logo.png          ← Upload client logo here
    │   └── jeanette.jpg      ← Upload therapist photo here (optional)
    └── favicon/              ← Upload favicon.io generated files here
        ├── favicon.ico
        ├── favicon-32x32.png
        ├── favicon-16x16.png
        ├── apple-touch-icon.png
        └── site.webmanifest
```

### Assets Required from Client
| Asset | Format | Notes |
|---|---|---|
| Logo | PNG (transparent background preferred) | Place at `assets/images/logo.png` |
| Therapist photo | JPG/WEBP | Place at `assets/images/jeanette.jpg` (optional but recommended) |
| Favicon pack | favicon.io all-format pack | Extract to `assets/favicon/` |

### Mobile-First Breakpoints
| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | < 768px | Base styles, 1-col grids, floating bar visible |
| Tablet | ≥ 768px | 2-col grids, horizontal footer, row CTA buttons |
| Desktop | ≥ 1024px | Full nav, 3-col cards, floating bar hidden |
| Wide | ≥ 1280px | Max-width container, hero padding increase |

### Accessibility
- All interactive elements have `:focus-visible` states
- All decorative icons have `aria-hidden="true"`
- Form fields have associated `<label>` elements
- Images have descriptive `alt` attributes
- `aria-label` on icon-only buttons
- Semantic HTML5 landmarks (`<header>`, `<main>`, `<footer>`, `<nav>`)
- Skip-to-main not yet implemented — recommend adding for full WCAG 2.1 AA

### Icon Guidance
- Library: Font Awesome 6.5.0 Free (CDN via cdnjs)
- All icons are SVG-based — no emoji, no raster icon fonts
- CDN URL: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css`

### Favicon Requirements
Generate from [favicon.io](https://favicon.io) using the client's logo PNG. Required output files:
- `favicon.ico`
- `favicon-32x32.png`
- `favicon-16x16.png`
- `apple-touch-icon.png` (180×180)
- `site.webmanifest`

### Google Maps Note
The map embed in `contact.html` uses a placeholder coordinate approximation. Replace the embed `src` URL with a verified Google Maps Embed API URL for the precise address once confirmed.

---

*Build Pack produced by StratStudios Design Agent | Build Version 1.0 | 2 March 2026*
