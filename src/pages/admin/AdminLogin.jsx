import React from 'react'
import Seo from '../../components/Seo'
import { supabase } from '../../lib/supabaseClient'

export default function AdminLogin() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (signInError) setError('Invalid email or password.')
  }

  return (
    <section>
      <Seo title="Admin login — Colon H2O" description="Admin login" />
      <div className="card" style={{ maxWidth: 420, margin: '0 auto' }}>
        <h1 className="h1">Admin login</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div style={{ marginTop: 12 }}>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="small" style={{ color: '#b91c1c', marginTop: 12 }}>{error}</p>}
          <div style={{ marginTop: 16 }}>
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
          </div>
        </form>
      </div>
    </section>
  )
}
