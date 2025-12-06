import React from 'react'

// Footer: simple footer with app name and placeholder links.
export default function Footer(){
  return (
    <footer style={{
      width: '100%',
      borderTop: '1px solid rgba(99, 102, 241, 0.2)',
      backgroundColor: 'rgba(13, 13, 20, 0.5)',
      marginTop: '4rem',
      backdropFilter: 'blur(10px)'
    }}>
      <style>{`
        .footer-link {
          cursor: pointer;
          color: #a5b4fc;
          transition: color 0.3s ease;
        }
        .footer-link:hover {
          color: #c4b5fd;
          text-decoration: underline;
        }
      `}</style>
      <div style={{
        maxWidth: '80rem',
        margin: '0 auto',
        padding: '2rem 1rem',
        fontSize: '0.875rem',
        color: '#9ca3af',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>© {new Date().getFullYear()} Neuro — Brain Training</div>
        <div style={{display: 'flex', gap: '1.5rem'}}>
          <span className="footer-link">Privacy</span>
          <span className="footer-link">Terms</span>
          <span className="footer-link">Contact</span>
        </div>
      </div>
    </footer>
  )
}
