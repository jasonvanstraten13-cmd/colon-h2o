import React from 'react'
import Seo from '../components/Seo'

export default function PrivacyPolicy(){
  return (
    <section>
      <Seo title="Privacy Policy — Colon H2O" description="Privacy policy (POPIA-aligned) for Colon H2O — data collection, use and your rights." />

      <div className="card">
        <h1 className="h1">Privacy Policy</h1>

        <p>This Privacy Policy describes how <strong>Jeanette van der Merwe</strong> ("we", "us", "Colon H2O") collects, uses and discloses personal information in accordance with the Protection of Personal Information Act (POPIA).</p>

        <h2>Personal information we collect</h2>
        <ul>
          <li>Contact details (name, email, telephone)</li>
          <li>Medical / treatment notes and appointment history when relevant to care</li>
          <li>Payment and invoice information where applicable</li>
        </ul>

        <h2>Why we collect personal information</h2>
        <p>We collect personal information to: provide health services; manage bookings and payments; communicate with you; and comply with legal obligations.</p>

        <h2>Lawful processing and retention</h2>
        <p>We process personal information where necessary for performance of a service, to comply with legal obligations, or with your consent. We retain records only as long as necessary for treatment, legal or business purposes and then securely dispose of them.</p>

        <h2>Sharing and third parties</h2>
        <p>We do not sell personal information. Personal data may be shared with third-party processors (payment providers, accounting) who are bound by confidentiality. We may disclose information when required by law.</p>

        <h2>Security</h2>
        <p>We implement administrative, technical and physical safeguards to protect personal information against loss, unauthorised access and unlawful processing.</p>

        <h2>Your rights</h2>
        <p>You have the right to access, correct or request deletion of your personal information, and to lodge a complaint with the Information Regulator if you believe your POPIA rights have been breached.</p>

        <h2>Contact</h2>
        <p>For privacy requests contact: <a href="mailto:jeanette@colonh2o.co.za">jeanette@colonh2o.co.za</a></p>

        <h2>Effective date</h2>
        <p>This policy is effective from February 18, 2026.</p>
      </div>
    </section>
  )
}
