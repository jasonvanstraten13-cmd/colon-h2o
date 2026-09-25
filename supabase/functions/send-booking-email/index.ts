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

    const clientHtml = isApproved
      ? `<p>Hi ${booking.name},</p>
         <p>Your booking request for <strong>${booking.service}</strong> on
         <strong>${booking.requested_date} at ${booking.requested_time}</strong> has been
         <strong>confirmed</strong>.</p>
         ${adminNote ? `<p>Note from Colon H2O: ${adminNote}</p>` : ''}
         <p>We look forward to seeing you.</p>
         <p>— Colon H2O</p>`
      : `<p>Hi ${booking.name},</p>
         <p>Unfortunately we're unable to confirm your booking request for
         <strong>${booking.service}</strong> on <strong>${booking.requested_date} at ${booking.requested_time}</strong>.</p>
         ${adminNote ? `<p>Note from Colon H2O: ${adminNote}</p>` : ''}
         <p>Please get in touch or submit a new request for a different time.</p>
         <p>— Colon H2O</p>`

    await sendEmail([booking.email], subject, clientHtml)

    if (RESPONSIBLE_EMAILS.length > 0) {
      const staffHtml = `<p>Booking ${isApproved ? 'approved' : 'denied'} for ${booking.name}
        (${booking.email}, ${booking.phone}) — ${booking.service} on
        ${booking.requested_date} at ${booking.requested_time}.</p>
        ${adminNote ? `<p>Note: ${adminNote}</p>` : ''}`
      await sendEmail(RESPONSIBLE_EMAILS, `Booking ${decision}: ${booking.name}`, staffHtml)
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
