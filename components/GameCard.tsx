"use client"
import React, { useState } from 'react'
import Link from 'next/link'

type Props = {
  id: string
  name: string
  description: string
  difficulty: string
  tags: string[]
}

// GameCard: modern dark neon card with hover effects and gradient border.
export default function GameCard({id,name,description,difficulty,tags}:Props){
  const [isHovered, setIsHovered] = useState(false)

  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'Easy': return '#10b981'
      case 'Medium': return '#f59e0b'
      case 'Hard': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        backgroundColor: '#1a1a2e',
        borderRadius: '1rem',
        padding: '1.5rem',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        boxShadow: isHovered 
          ? '0 0 20px rgba(99, 102, 241, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)' 
          : '0 4px 6px rgba(0, 0, 0, 0.2)',
        transform: isHovered ? 'scale(1.03)' : 'scale(1)',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
    >
      <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem'}}>
        <div style={{flex: 1}}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '700',
            color: '#e5e7eb',
            marginBottom: '0.5rem'
          }}>{name}</h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#9ca3af',
            marginBottom: '0.75rem',
            lineHeight: '1.5'
          }}>{description}</p>
          <div style={{
            marginTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            <span style={{
              padding: '0.25rem 0.75rem',
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              borderRadius: '0.375rem',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: getDifficultyColor(difficulty),
              border: `1px solid ${getDifficultyColor(difficulty)}40`
            }}>
              {difficulty}
            </span>
            {tags.map(t=> (
              <span key={t} style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: 'rgba(139, 92, 246, 0.15)',
                borderRadius: '0.375rem',
                fontSize: '0.75rem',
                color: '#d8b4fe',
                border: '1px solid rgba(139, 92, 246, 0.3)'
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>
        <div>
          <Link href={`/games/${id}`} style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            color: 'white',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            boxShadow: isHovered ? '0 0 12px rgba(79, 70, 229, 0.5)' : 'none',
            transition: 'all 0.3s ease'
          }}>
            Play
          </Link>
        </div>
      </div>
    </div>
  )
}
