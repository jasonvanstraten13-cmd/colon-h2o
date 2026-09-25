// Supabase Edge Function: send-booking-email
// Deploy with: supabase functions deploy send-booking-email
// Required secrets (supabase secrets set ...):
//   RESEND_API_KEY      - API key from resend.com
//   NOTIFY_FROM_EMAIL    - verified "from" address, e.g. bookings@colonh2o.co.za
//   RESPONSIBLE_EMAILS   - comma separated list of admin/staff emails to notify, e.g. jeanette@colonh2o.co.za

// deno-lint-ignore-file no-explicit-any
// @ts-ignore Deno remote import, only resolved at deploy/runtime by Supabase Edge Runtime
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const NOTIFY_FROM_EMAIL = Deno.env.get('NOTIFY_FROM_EMAIL') ?? 'bookings@colonh2o.co.za'
const RESPONSIBLE_EMAILS = (Deno.env.get('RESPONSIBLE_EMAILS') ?? '')
  .split(',')
  .map((e) => e.trim())
  .filter(Boolean)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function sendEmail(to: string[], subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: NOTIFY_FROM_EMAIL, to, subject, html }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Resend error (${res.status}): ${text}`)
  }
}

const BRAND_TEAL = '#01bbd6'
const BRAND_TEAL_DARK = '#00aac3'
const BRAND_INK = '#1a2e35'
const BRAND_MUTED = '#6b6e72'

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// Wraps any inner content in a consistent, email-client-safe branded shell (table-based layout).
function emailShell(preheader: string, bodyHtml: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Colon H2O</title>
</head>
<body style="margin:0;padding:0;background:#f0fdff;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdff;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 6px 28px rgba(1,187,214,0.14);">
          <tr>
            <td style="background:linear-gradient(135deg, ${BRAND_TEAL}, ${BRAND_TEAL_DARK});padding:28px 32px;text-align:center;">
              <span style="font-family:'Poppins',Helvetica,Arial,sans-serif;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:0.02em;">Colon H<span style="font-size:14px;vertical-align:sub;">2</span>O</span>
              <div style="font-size:12px;color:rgba(255,255,255,0.85);margin-top:4px;">Colon Hydrotherapy &middot; Silver Lakes, Pretoria</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;color:${BRAND_INK};font-size:15px;line-height:1.65;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;background:#f7fdfe;border-top:1px solid rgba(1,187,214,0.12);text-align:center;">
              <div style="font-size:12px;color:${BRAND_MUTED};">
                082 564 2526 &middot; jeanette@colonh2o.co.za<br />
                9 Nicklaus Street, Silver Lakes Golf Estate, Pretoria, 0081
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function statusBadge(isApproved: boolean) {
  const bg = isApproved ? '#d4edda' : '#fdecea'
  const color = isApproved ? '#1e6b32' : '#c0392b'
  const label = isApproved ? 'Confirmed' : 'Not Available'
  return `<span style="display:inline-block;padding:4px 12px;border-radius:999px;background:${bg};color:${color};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;">${label}</span>`
}

function bookingDetailsTable(booking: any) {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 0;color:${BRAND_MUTED};font-size:13px;width:110px;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;font-size:14px;font-weight:600;color:${BRAND_INK};">${escapeHtml(value)}</td>
    </tr>`
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;background:#f7fdfe;border-radius:10px;padding:16px;border:1px solid rgba(1,187,214,0.12);">
    ${row('Service', booking.service)}
    ${row('Date', booking.requested_date)}
    ${row('Time', booking.requested_time)}
  </table>`
}

function noteBox(note: string) {
  return `<div style="margin:16px 0;padding:12px 16px;background:#fff8e6;border-left:3px solid #e0b400;border-radius:6px;font-size:14px;color:${BRAND_INK};">
    <strong>Note from Colon H2O:</strong> ${escapeHtml(note)}
  </div>`
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { booking, decision, adminNote } = await req.json()

    if (!booking?.email || !booking?.name || !decision) {
      return new Response(JSON.stringify({ error: 'Missing booking or decision' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const isApproved = decision === 'approved'
    const subject = isApproved
      ? `Your Colon H2O booking is confirmed — ${booking.requested_date}`
      : `Update on your Colon H2O booking request`

    const clientBody = isApproved
      ? `<p style="margin:0 0 12px;">Hi ${escapeHtml(booking.name)},</p>
         <p style="margin:0 0 8px;">Great news — your booking request has been confirmed. ${statusBadge(true)}</p>
         ${bookingDetailsTable(booking)}
         ${adminNote ? noteBox(adminNote) : ''}
         <p style="margin:16px 0 0;">We look forward to seeing you at Colon H2O. If your plans change, just reply to this email or WhatsApp us on <a href="tel:+27825642526" style="color:${BRAND_TEAL_DARK};">082 564 2526</a>.</p>
         <p style="margin:20px 0 0;color:${BRAND_MUTED};">— Jeanette &amp; the Colon H2O team</p>`
      : `<p style="margin:0 0 12px;">Hi ${escapeHtml(booking.name)},</p>
         <p style="margin:0 0 8px;">Unfortunately we're unable to confirm the following request. ${statusBadge(false)}</p>
         ${bookingDetailsTable(booking)}
         ${adminNote ? noteBox(adminNote) : ''}
         <p style="margin:16px 0 0;">Please get in touch or submit a new request for a different date/time — we'd love to help you find a slot that works.</p>
         <p style="margin:20px 0 0;color:${BRAND_MUTED};">— Jeanette &amp; the Colon H2O team</p>`

    await sendEmail([booking.email], subject, emailShell(subject, clientBody))

    if (RESPONSIBLE_EMAILS.length > 0) {
      const staffSubject = `Booking ${decision}: ${booking.name}`
      const staffBody = `<p style="margin:0 0 12px;">Booking ${isApproved ? 'approved' : 'denied'} for <strong>${escapeHtml(booking.name)}</strong>. ${statusBadge(isApproved)}</p>
        ${bookingDetailsTable(booking)}
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:12px 0;">
          <tr><td style="padding:4px 0;color:${BRAND_MUTED};font-size:13px;width:110px;">Email</td><td style="padding:4px 0;font-size:14px;">${escapeHtml(booking.email)}</td></tr>
          <tr><td style="padding:4px 0;color:${BRAND_MUTED};font-size:13px;">Phone</td><td style="padding:4px 0;font-size:14px;">${escapeHtml(booking.phone)}</td></tr>
        </table>
        ${adminNote ? noteBox(adminNote) : ''}`
      await sendEmail(RESPONSIBLE_EMAILS, staffSubject, emailShell(staffSubject, staffBody))
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
