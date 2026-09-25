import React from 'react'
import Seo from '../components/Seo'

const FAQS = [
  {q:'What is colon hydrotherapy?', a:'A gentle internal cleansing procedure using temperature-controlled purified water to re-activate normal bowel function.'},
  {q:'Is the procedure painful?', a:'Rarely. Some clients experience mild cramping or gas but most report relief and improved comfort afterwards.'},
  {q:'How long is a session?', a:'Plan about 60–90 minutes for the first visit; subsequent sessions are typically 30–45 minutes.'}
]

export default function FAQ(){
  return (
    <section>
      <Seo title="FAQ — Colon H2O" description="Frequently asked questions about colon hydrotherapy at Colon H2O." />
      <div className="card">
        <h1 className="h1">FAQ</h1>
        {FAQS.map(f=> (
          <div key={f.q} style={{marginTop:12}}>
            <h3>{f.q}</h3>
            <p className="small">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
