import React, { useEffect, useMemo, useState } from 'react'
import Seo from '../components/Seo'
import { supabase } from '../lib/supabaseClient'
import { hourlySlots, isClosedDate } from '../lib/bookingHours'

const SERVICES = ['Colon Hydrotherapy Session', 'InBody Scan', 'Consultation', 'Other']
const SLOTS = hourlySlots()

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export default function Book() {
  const [details, setDetails] = useState({ name: '', email: '', phone: '', service: SERVICES[0], message: '' })
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [takenSlots, setTakenSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!date) { setTakenSlots([]); return }
    setLoadingSlots(true)
    setTime('')
    supabase
      .from('approved_slots')
      .select('requested_time')
      .eq('requested_date', date)
      .then(({ data, error }) => {
        setTakenSlots(error ? [] : (data || []).map((r) => r.requested_time))
        setLoadingSlots(false)
      })
  }, [date])

  const closed = useMemo(() => isClosedDate(date), [date])

  const handleChange = (e) => {
    const { name, value } = e.target
    setDetails((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!date || !time) return
    setStatus('submitting')
    setErrorMsg('')
    const { error } = await supabase.from('bookings').insert({
      ...details,
      requested_date: date,
      requested_time: time,
      status: 'pending',
    })
    if (error) {
      setStatus('error')
      setErrorMsg('Something went wrong sending your request. Please try again or contact us directly.')
      return
    }
    setStatus('success')
  }

  if (status === 'success') {
    return (
      <section>
        <Seo title="Booking requested — Colon H2O" description="Your booking request has been received." />
        <div className="card">
          <h1 className="h1">Thank you</h1>
          <p>Your booking request for {date} at {time} has been received. We'll confirm by email once it's approved.</p>
        </div>
      </section>
    )
  }

  return (
    <section>
      <Seo title="Book a session — Colon H2O" description="Request a colon hydrotherapy booking in Silver Lakes, Pretoria." />
      <div className="card">
        <h1 className="h1">Book a session</h1>
        <p className="small">Pick an open hourly slot below — Jeanette will confirm your appointment by email.</p>

        <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
          <div>
            <label htmlFor="date">Date</label>
            <input id="date" type="date" min={todayStr()} value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          {date && closed && <p className="small" style={{ color: '#b91c1c', marginTop: 12 }}>We're closed on this day — please pick another date.</p>}

          {date && !closed && (
            <div style={{ marginTop: 12 }}>
              <label>Time</label>
              {loadingSlots && <p className="small">Checking availability…</p>}
              {!loadingSlots && (
                <div className="slot-grid">
                  {SLOTS.map((s) => {
                    const isTaken = takenSlots.includes(s)
                    return (
                      <button
                        key={s}
                        type="button"
                        disabled={isTaken}
                        onClick={() => setTime(s)}
                        className={`slot-btn ${time === s ? 'selected' : ''} ${isTaken ? 'taken' : ''}`}
                      >
                        {s}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          <div className="form-row two" style={{ marginTop: 16 }}>
            <div>
              <label htmlFor="name">Name</label>
              <input id="name" name="name" value={details.name} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={details.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row two" style={{ marginTop: 12 }}>
            <div>
              <label htmlFor="phone">Telephone</label>
              <input id="phone" name="phone" value={details.phone} onChange={handleChange} required placeholder="e.g. 082 564 2526" />
            </div>
            <div>
              <label htmlFor="service">Service</label>
              <select id="service" name="service" value={details.service} onChange={handleChange}>
                {SERVICES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label htmlFor="message">Message (optional)</label>
            <textarea id="message" name="message" rows={4} value={details.message} onChange={handleChange} />
          </div>

          {status === 'error' && <p className="small" style={{ color: '#b91c1c', marginTop: 12 }}>{errorMsg}</p>}

          <div style={{ marginTop: 16 }}>
            <button className="btn" type="submit" disabled={status === 'submitting' || !date || !time || closed}>
              {status === 'submitting' ? 'Sending…' : 'Request booking'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
