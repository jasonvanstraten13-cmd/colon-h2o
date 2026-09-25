import React from 'react'
import Seo from '../components/Seo'

export default function Home(){
  return (
    <section>
      <Seo title="Colon H2O — Colon Hydrotherapy | Pretoria" description="Colon H2O provides professional colon hydrotherapy in Silver Lakes, Pretoria. Book treatments, view services and products." />

      <div className="hero card" style={{backgroundImage:'linear-gradient(160deg, rgba(232,251,254,0.85) 0%, rgba(255,255,255,0.9) 100%), url(/images/hero.png)', backgroundSize:'cover', backgroundPosition:'center'}}>
        <h1 className="h1">Colon Hydrotherapy in Pretoria</h1>
        <p className="lead">Gentle, professional colon hydrotherapy and digestive health treatments by Jeanette van der Merwe (RICTAT certified). Book a consultation or single session.</p>
        <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
          <a className="btn" href="/book">Book now</a>
          <a className="btn" style={{background:'transparent',color:'var(--color-accent)',border:'1px solid rgba(2,6,23,.06)'}} href="/services">View services</a>
        </div>
      </div>

      <div className="grid grid-3" style={{marginTop:18}}>
        <div className="card">
          <h3>Colon Hydrotherapy</h3>
          <p className="small">A gentle procedure to clear the colon, support digestion and relieve constipation. Professional, private treatments.</p>
        </div>
        <div className="card">
          <h3>InBody Scan & Assessments</h3>
          <p className="small">Body composition scans and tailored advice to support your treatment outcomes.</p>
        </div>
        <div className="card">
          <h3>Products & Supplements</h3>
          <p className="small">Probiotics, digestive enzymes and practitioner-grade supplements to support gut health.</p>
        </div>
      </div>

      <div style={{marginTop:20}} className="card">
        <h2>Why choose Colon H2O?</h2>
        <ul>
          <li>RICTAT-certified therapist — professional and discreet</li>
          <li>Clean, modern practice in Silver Lakes</li>
          <li>Evidence-informed approach and aftercare</li>
        </ul>
      </div>
    </section>
  )
}
