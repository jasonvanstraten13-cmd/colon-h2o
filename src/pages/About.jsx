import React from 'react'
import Seo from '../components/Seo'

export default function About(){
  return (
    <section>
      <Seo title="About — Colon H2O" description="About Jeanette van der Merwe and Colon H2O — RICTAT certified colon hydrotherapist in Pretoria." />
      <div className="card">
        <h1 className="h1">About Colon H2O</h1>
        <img src="/images/jeanette-front-shop.png" alt="Jeanette van der Merwe outside the Colon H2O practice" style={{width:'100%',maxWidth:420,borderRadius:12,margin:'12px 0'}} />
        <p className="lead">Colon H2O is run by Jeanette van der Merwe — a RICTAT certified colon hydrotherapist dedicated to safe, professional colon hydrotherapy and digestive wellbeing.</p>
        <h2>Our practice</h2>
        <p>Private treatment rooms, single-use disposables and evidence-informed protocols ensure comfort and safety. We offer consultation, colon hydrotherapy sessions and follow-up support.</p>
        <h2>Meet Jeanette</h2>
        <p>Jeanette trained with recognised providers and brings a compassionate, clinical approach to every client.</p>
      </div>
    </section>
  )
}
