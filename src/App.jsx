import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import RequireAdminAuth from './components/RequireAdminAuth'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const Products = lazy(() => import('./pages/Products'))
const Contact = lazy(() => import('./pages/Contact'))
const Book = lazy(() => import('./pages/Book'))
const ThankYou = lazy(() => import('./pages/ThankYou'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsPolicy = lazy(() => import('./pages/TermsPolicy'))
const FAQ = lazy(() => import('./pages/FAQ'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))

export default function App() {
  return (
    <div className="app-root">
      <Header />
      <main>
        <Suspense fallback={<div className="loading">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book" element={<Book />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-policy" element={<TermsPolicy />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<RequireAdminAuth><AdminDashboard /></RequireAdminAuth>} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
