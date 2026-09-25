import React from 'react'
import Seo from '../components/Seo'

export default function Services(){
  return (
    <section>
      <Seo title="Services — Colon H2O" description="Services: Colon Hydrotherapy, InBody scans and gut-health products. Book a consultation in Pretoria." />

      <div className="card">
        <h1 className="h1">Services</h1>
        <img src="/images/colon-hero.png" alt="Colon hydrotherapy treatment room" style={{width:'100%',maxWidth:480,borderRadius:12,margin:'12px 0'}} />
        <h2>Colon Hydrotherapy</h2>
        <p>Gentle, private colon hydrotherapy sessions to support bowel function and detoxification. Typical session time: 30–45 minutes.</p>
        <h3>Single Session</h3>
        <p className="small">R 750.00 — Free probiotic implant included.</p>

        <h2>InBody Scan</h2>
        <p>Detailed body composition scanning to support treatment monitoring and nutritional guidance.</p>

        <h2>Products & Practitioner Supplements</h2>
        <p>Probiotics, digestive enzymes and targeted supplements available for purchase.</p>

        <p style={{marginTop:12}}><a className="btn" href="/book">Book a session</a></p>
      </div>
    </section>
  )
}
