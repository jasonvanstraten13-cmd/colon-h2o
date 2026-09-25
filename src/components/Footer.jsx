import React from 'react'

export default function Footer(){
  return (
    <footer className="footer" role="contentinfo">
      <div className="container grid" style={{gap:18}}>
        <div className="card" style={{display:'flex',flexDirection:'column',gap:12}}>
          <div style={{fontWeight:700}}>Contact</div>
          <div className="small">Jeanette van der Merwe — RICTAT certified</div>
          <div className="small">Tel: <a href="tel:+27825642526">082 564 2526</a></div>
          <div className="small">Email: <a href="mailto:jeanette@colonh2o.co.za">jeanette@colonh2o.co.za</a></div>
          <div className="small">Address: 9 Nicklaus Street, Silver Lakes Golf Estate, 0081</div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <nav style={{display:'flex',gap:10,flexWrap:'wrap'}} aria-label="footer links">
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            <a href="/terms-policy" target="_blank" rel="noopener noreferrer">Terms of Use</a>
            <a href="/contact">Contact</a>
            <a href="/faq">FAQ</a>
          </nav>

          <div style={{marginTop:8}} className="footer-credit" tabIndex={0}>
            <div className="small">© {new Date().getFullYear()} Colon H2O — All rights reserved.</div>
            <div style={{textAlign:'right'}}>
              <a href="https://stratstudios.co.za" target="_blank" rel="noopener noreferrer">Designed by StratStudios</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
