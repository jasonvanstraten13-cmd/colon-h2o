import React, { useRef, useState } from 'react'

const FORMSPARK_ID = 'hKJZmH4nT' // provided
const CLIENT_NAME = 'Colon H2O'

function formatWhatsapp(raw){
  if(!raw) return ''
  const digits = raw.replace(/\D/g,'')
  if(digits.startsWith('0')) return '27' + digits.slice(1)
  if(digits.startsWith('27')) return digits
  return digits
}

export default function ContactForm(){
  const whatsappRef = useRef(null)
  const [phone,setPhone] = useState('')

  const handlePhone = (e)=>{
    const v = e.target.value
    setPhone(v)
    if(whatsappRef.current) whatsappRef.current.value = formatWhatsapp(v)
  }

  const handleSubmit = (e)=>{
    // ensure hidden field is set BEFORE natural submission — DO NOT prevent default
    if(whatsappRef.current) whatsappRef.current.value = formatWhatsapp(phone)
    // allow native form POST to continue
  }

  return (
    <form method="POST" action={`https://submit-form.com/${FORMSPARK_ID}`} onSubmit={handleSubmit}>
      <input type="hidden" name="_redirect" value="https://colonh2o.co.za/thank-you" />
      <input type="hidden" name="_email.from" value="StratStudios Lead" />
      <input type="hidden" name="_email.subject" value={`New Lead • ${CLIENT_NAME}`} />
      <input type="hidden" id="whatsapp" name="whatsapp" ref={whatsappRef} value="" />

      <div className="form-row two">
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" required />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>
      </div>

      <div style={{marginTop:12}}>
        <label htmlFor="phone">Telephone</label>
        <input id="phone" name="phone" value={phone} onChange={handlePhone} required placeholder="e.g. 082 564 2526" />
      </div>

      <div style={{marginTop:12}}>
        <label htmlFor="subject">Subject</label>
        <input id="subject" name="subject" />
      </div>

      <div style={{marginTop:12}}>
        <label htmlFor="comments">Message</label>
        <textarea id="comments" name="comments" rows={5} />
      </div>

      <div style={{marginTop:14,display:'flex',gap:12,alignItems:'center'}}>
        <button className="btn" type="submit">Send enquiry</button>
        <a className="btn" style={{background:'transparent',color:'var(--color-accent',border:'1px solid rgba(2,6,23,.06)'}} href={`https://wa.me/${formatWhatsapp(phone || '27825642526')}`} target="_blank" rel="noopener noreferrer">Start WhatsApp</a>
      </div>
    </form>
  )
}
