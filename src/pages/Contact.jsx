import React from 'react'
import Seo from '../components/Seo'
import ContactForm from '../components/ContactForm'

export default function Contact(){
  return (
    <section>
      <Seo title="Contact — Colon H2O" description="Contact Colon H2O to book a colon hydrotherapy appointment in Pretoria." />

      <div className="card">
        <h1 className="h1">Contact</h1>
        <p className="small">Jeanette van der Merwe — RICTAT certified</p>
        <p className="small">Tel: <a href="tel:+27825642526">082 564 2526</a> • Email: <a href="mailto:jeanette@colonh2o.co.za">jeanette@colonh2o.co.za</a></p>

        <div style={{marginTop:12}}>
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
