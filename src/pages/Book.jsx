import React, { useState } from 'react'
import Seo from '../components/Seo'
import { supabase } from '../lib/supabaseClient'

const SERVICES = ['Colon Hydrotherapy Session', 'InBody Scan', 'Consultation', 'Other']

export default function Book() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: SERVICES[0],
    requested_date: '',
    requested_time: '',
    message: '',
  })
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')
    const { error } = await supabase.from('bookings').insert({ ...form, status: 'pending' })
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
          <p>Your booking request has been received. We'll confirm by email once it's approved.</p>
        </div>
      </section>
    )
  }

  return (
    <section>
      <Seo title="Book a session — Colon H2O" description="Request a colon hydrotherapy booking in Silver Lakes, Pretoria." />
      <div className="card">
        <h1 className="h1">Book a session</h1>
        <p className="small">Submit a request below — Jeanette will confirm your appointment by email.</p>

        <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
          <div className="form-row two">
            <div>
              <label htmlFor="name">Name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row two" style={{ marginTop: 12 }}>
            <div>
              <label htmlFor="phone">Telephone</label>
              <input id="phone" name="phone" value={form.phone} onChange={handleChange} required placeholder="e.g. 082 564 2526" />
            </div>
            <div>
              <label htmlFor="service">Service</label>
              <select id="service" name="service" value={form.service} onChange={handleChange}>
                {SERVICES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row two" style={{ marginTop: 12 }}>
            <div>
              <label htmlFor="requested_date">Preferred date</label>
              <input id="requested_date" name="requested_date" type="date" value={form.requested_date} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="requested_time">Preferred time</label>
              <input id="requested_time" name="requested_time" type="time" value={form.requested_time} onChange={handleChange} required />
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label htmlFor="message">Message (optional)</label>
            <textarea id="message" name="message" rows={4} value={form.message} onChange={handleChange} />
          </div>

          {status === 'error' && <p className="small" style={{ color: '#b91c1c', marginTop: 12 }}>{errorMsg}</p>}

          <div style={{ marginTop: 16 }}>
            <button className="btn" type="submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Sending…' : 'Request booking'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
