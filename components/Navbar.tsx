"use client"
import Link from 'next/link'
import React, { useState } from 'react'

// Navbar: top navigation with logo, links, and CTA.
export default function Navbar(){
  const [showMenu, setShowMenu] = useState(false)

  return (
    <nav style={{
      width: '100%',
      backgroundColor: 'rgba(13, 13, 20, 0.8)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      <style>{`
        @media (min-width: 640px) {
          .nav-links { display: flex !important; }
          .nav-view-games { display: inline-block !important; }
        }
        @media (max-width: 639px) {
          .nav-links { display: none; }
          .nav-view-games { display: none; }
        }
      `}</style>
      <div style={{maxWidth: '80rem', margin: '0 auto', padding: '0 1rem'}}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4rem'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
            <Link href="/" style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Neuro
            </Link>
            <div className="nav-links" style={{
              alignItems: 'center',
              gap: '2rem',
              fontSize: '0.95rem',
              color: '#d1d5db'
            }}>
              <Link href="/" style={{transition: 'color 0.3s', color: '#d1d5db'}}>Home</Link>
              <Link href="/games" style={{transition: 'color 0.3s', color: '#d1d5db'}}>Games</Link>
              <Link href="/profile" style={{transition: 'color 0.3s', color: '#d1d5db'}}>Profile</Link>
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <Link href="/games" className="nav-view-games" style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              fontSize: '0.875rem',
              color: '#a5b4fc',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}>View Games</Link>
            <Link href="/profile" style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: '600',
              boxShadow: '0 0 12px rgba(79, 70, 229, 0.4)',
              transition: 'all 0.3s ease'
            }}>Get Started</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
