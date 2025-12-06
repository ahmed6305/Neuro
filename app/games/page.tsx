"use client"
import React, { useState } from 'react'
import { games as allGames, Game } from '../../lib/mockData'
import GameCard from '../../components/GameCard'

// Games page: displays a grid of games with simple front-end filtering.
export default function GamesPage(){
  const [filter, setFilter] = useState<'All'|'Memory'|'Reflex'|'Logic'>('All')

  const filters: Array<'All'|'Memory'|'Reflex'|'Logic'> = ['All','Memory','Reflex','Logic']

  const visible = allGames.filter(g => {
    if(filter === 'All') return true
    return g.tags.includes(filter)
  })

  return (
    <div>
      <div style={{marginBottom: '3rem'}}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#e5e7eb',
          marginBottom: '1.5rem'
        }}>
          All Games
        </h1>
        <p style={{color: '#9ca3af', marginBottom: '2rem'}}>
          Explore {allGames.length} brain-training games. Choose your challenge!
        </p>

        <div style={{display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap'}}>
          {filters.map(f=> (
            <button 
              key={f} 
              onClick={()=>setFilter(f)} 
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '0.5rem',
                backgroundColor: filter===f? 'rgba(79, 70, 229, 0.9)' : 'rgba(99, 102, 241, 0.1)',
                color: filter===f? '#e5e7eb' : '#a5b4fc',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                border: filter===f? '1px solid rgba(99, 102, 241, 0.6)' : '1px solid rgba(99, 102, 241, 0.3)',
                transition: 'all 0.3s ease',
                boxShadow: filter===f? '0 0 12px rgba(79, 70, 229, 0.4)' : 'none'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem'}}>
        {visible.length > 0 ? (
          visible.map((g:Game)=> (
            <GameCard key={g.id} id={g.id} name={g.name} description={g.description} difficulty={g.difficulty} tags={g.tags} />
          ))
        ) : (
          <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', color: '#6b7280'}}>
            <p style={{fontSize: '1.125rem'}}>No games found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
