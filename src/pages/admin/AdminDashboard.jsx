import React, { useEffect, useMemo, useState } from 'react'
import Seo from '../../components/Seo'
import { supabase } from '../../lib/supabaseClient'

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function buildMonthGrid(monthDate) {
  const first = startOfMonth(monthDate)
  const firstWeekday = first.getDay() // 0=Sun
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(monthDate.getFullYear(), monthDate.getMonth(), d))
  return cells
}

function toDateKey(d) {
  return d.toISOString().slice(0, 10)
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [monthDate, setMonthDate] = useState(startOfMonth(new Date()))
  const [selectedDay, setSelectedDay] = useState(null)
  const [actionError, setActionError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('requested_date', { ascending: true })
    if (!error) setBookings(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const pending = bookings.filter((b) => b.status === 'pending')
  const approved = bookings.filter((b) => b.status === 'approved')

  const approvedByDay = useMemo(() => {
    const map = {}
    for (const b of approved) {
      map[b.requested_date] = map[b.requested_date] || []
      map[b.requested_date].push(b)
    }
    return map
  }, [approved])

  const cells = buildMonthGrid(monthDate)

  const decide = async (booking, decision) => {
    setBusyId(booking.id)
    setActionError('')
    const { error } = await supabase
      .from('bookings')
      .update({ status: decision })
      .eq('id', booking.id)

    if (error) {
      setActionError('Failed to update booking status.')
      setBusyId(null)
      return
    }

    try {
      await supabase.functions.invoke('send-booking-email', {
        body: { booking, decision },
      })
    } catch {
      setActionError('Booking updated, but the notification email failed to send.')
    }

    await load()
    setBusyId(null)
  }

  const signOut = () => supabase.auth.signOut()

  return (
    <section>
      <Seo title="Admin dashboard — Colon H2O" description="Admin dashboard" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="h1">Admin dashboard</h1>
        <button className="btn" style={{ background: 'transparent', color: 'var(--color-accent)', border: '1px solid rgba(2,6,23,.08)' }} onClick={signOut}>Sign out</button>
      </div>

      {actionError && <p className="small" style={{ color: '#b91c1c' }}>{actionError}</p>}

      <div className="card" style={{ marginTop: 16 }}>
        <h2>Pending requests {loading ? '' : `(${pending.length})`}</h2>
        {loading && <p className="small">Loading…</p>}
        {!loading && pending.length === 0 && <p className="small">No pending requests.</p>}
        {pending.map((b) => (
          <div key={b.id} style={{ borderTop: '1px solid rgba(2,6,23,.06)', padding: '12px 0' }}>
            <p style={{ margin: 0, fontWeight: 700 }}>{b.name} — {b.service}</p>
            <p className="small" style={{ margin: '4px 0' }}>{b.requested_date} at {b.requested_time} • {b.email} • {b.phone}</p>
            {b.message && <p className="small" style={{ margin: '4px 0' }}>{b.message}</p>}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="btn" disabled={busyId === b.id} onClick={() => decide(b, 'approved')}>Approve</button>
              <button
                className="btn"
                style={{ background: '#b91c1c' }}
                disabled={busyId === b.id}
                onClick={() => decide(b, 'denied')}
              >
                Deny
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn" onClick={() => setMonthDate(new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1))}>&larr;</button>
          <h2 style={{ margin: 0 }}>{monthDate.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</h2>
          <button className="btn" onClick={() => setMonthDate(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1))}>&rarr;</button>
        </div>

        <div className="calendar-grid" style={{ marginTop: 16 }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="calendar-headcell">{d}</div>
          ))}
          {cells.map((day, i) => {
            const key = day ? toDateKey(day) : `empty-${i}`
            const dayBookings = day ? (approvedByDay[toDateKey(day)] || []) : []
            return (
              <div
                key={key}
                className="calendar-cell"
                onClick={() => day && setSelectedDay(toDateKey(day))}
                style={{ cursor: day ? 'pointer' : 'default', opacity: day ? 1 : 0.3 }}
              >
                {day && <div className="small">{day.getDate()}</div>}
                {dayBookings.slice(0, 2).map((b) => (
                  <div key={b.id} className="calendar-chip">{b.requested_time} {b.name}</div>
                ))}
                {dayBookings.length > 2 && <div className="small">+{dayBookings.length - 2} more</div>}
              </div>
            )
          })}
        </div>
      </div>

      {selectedDay && (
        <div className="card" style={{ marginTop: 16 }}>
          <h2>Bookings on {selectedDay}</h2>
          {(approvedByDay[selectedDay] || []).length === 0 && <p className="small">No approved bookings on this day.</p>}
          {(approvedByDay[selectedDay] || []).map((b) => (
            <div key={b.id} style={{ borderTop: '1px solid rgba(2,6,23,.06)', padding: '8px 0' }}>
              <p style={{ margin: 0, fontWeight: 700 }}>{b.name} — {b.service}</p>
              <p className="small" style={{ margin: '4px 0' }}>{b.requested_time} • {b.email} • {b.phone}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
