import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Header(){
  const [scrolled, setScrolled] = useState(false)
  useEffect(()=>{
    const onScroll = ()=> setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return ()=> window.removeEventListener('scroll', onScroll)
  },[])

  return (
    <header className={`header ${scrolled? 'scrolled':''}`} role="banner">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="Colon H2O home">
          <img src="/images/full-logo.png" alt="Colon H2O logo" width="120" height="44" style={{height:44,width:'auto'}} />
          <div style={{display:'flex',flexDirection:'column'}}>
            <strong style={{fontSize:16}}>Colon H2O</strong>
            <span style={{fontSize:12,color:'#6B7280'}}>Colon Hydrotherapy — Pretoria</span>
          </div>
        </Link>

        <nav className="nav" role="navigation" aria-label="Main navigation">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/book" className="cta">Book</NavLink>
        </nav>
      </div>
    </header>
  )
}
