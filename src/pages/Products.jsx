import React from 'react'
import Seo from '../components/Seo'

const PRODUCTS = [
  {name:'Probiotic Liquid (200ml)', price:'R300', desc:'High-strength live probiotics to support gut flora.', image:'/images/probiotic-liquid-product.png'},
  {name:'Digestive Enzyme (90 caps)', price:'R300', desc:'Full-spectrum digestive enzymes for bloating and indigestion.', image:'/images/digestive-enzyme-product.png'},
  {name:'Probiotic Capsules (30)', price:'R300', desc:'Convenient probiotic capsule for daily maintenance.', image:'/images/probiotic-capsules-product.png'},
  {name:'Rafaa (500ml)', price:'R250', desc:'Natural probiotic tonic.', image:'/images/rafaa-product.png'},
  {name:'Parasite Cleanser (60 caps)', price:'R300', desc:'Herbal formulation for parasite cleanse.', image:'/images/parasite-cleanser-product.png'}
]

export default function Products(){
  return (
    <section>
      <Seo title="Products — Colon H2O" description="Probiotic and digestive health products available at Colon H2O." />
      <div className="card">
        <h1 className="h1">Products</h1>
        <img src="/images/products-display.png" alt="Colon H2O product range" style={{width:'100%',maxWidth:480,borderRadius:12,margin:'12px 0'}} />
        <div className="grid" style={{marginTop:12}}>
          {PRODUCTS.map(p=> (
            <div className="card" key={p.name}>
              <img src={p.image} alt={p.name} style={{width:'100%',maxHeight:180,objectFit:'contain',marginBottom:8}} />
              <h3>{p.name}</h3>
              <p className="small">{p.desc}</p>
              <div style={{marginTop:8,fontWeight:700}}>{p.price}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
