import React from 'react'

type Props = {
  title: string
  value: string | number
  subtitle?: string
}

// StatCard: small card for showing a stat on profile page.
export default function StatCard({title,value,subtitle}:Props){
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      padding: '1rem'
    }}>
      <div style={{fontSize: '0.875rem', color: '#64748b'}}>{title}</div>
      <div style={{fontSize: '1.875rem', fontWeight: '600', marginTop: '0.25rem'}}>{value}</div>
      {subtitle && <div style={{fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem'}}>{subtitle}</div>}
    </div>
  )
}
