import React from 'react'
import Seo from '../components/Seo'

export default function ThankYou(){
  return (
    <section>
      <Seo title="Thank you — Colon H2O" description="Thanks — your message has been received. We will contact you shortly." />
      <div className="card">
        <h1 className="h1">Thank you</h1>
        <p className="lead">Your submission was successful. We will contact you shortly to confirm details.</p>
        <p><a className="btn" href="/contact">Back to contact</a></p>
      </div>
    </section>
  )
}
