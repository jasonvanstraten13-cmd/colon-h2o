import React from 'react'
import Seo from '../components/Seo'

export default function TermsPolicy(){
  return (
    <section>
      <Seo title="Terms of Use — Colon H2O" description="Terms of use for Colon H2O website and services." />
      <div className="card">
        <h1 className="h1">Terms of Use</h1>
        <p>These Terms of Use govern access to and use of the Colon H2O website and services operated by <strong>Jeanette van der Merwe</strong>.</p>

        <h2>Bookings & Payments</h2>
        <p>Appointments are subject to availability. Payment and cancellation terms will be provided at booking.</p>

        <h2>Health information</h2>
        <p>All clinical information supplied is used only for the purpose of providing treatment and is handled in accordance with our Privacy Policy.</p>

        <h2>Limitation of liability</h2>
        <p>To the maximum extent permitted by law, Colon H2O is not liable for indirect, incidental or consequential losses arising from use of the site or services.</p>

        <h2>Governing law</h2>
        <p>These terms are governed by the laws of the Republic of South Africa.</p>

        <h2>Contact</h2>
        <p>Questions about these terms: <a href="mailto:jeanette@colonh2o.co.za">jeanette@colonh2o.co.za</a></p>
      </div>
    </section>
  )
}
