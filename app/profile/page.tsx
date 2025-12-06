"use client"
import React from 'react'
import { mockUser } from '../../lib/mockData'
import StatCard from '../../components/StatCard'

// Profile page: shows mock user progress and stats.
export default function Profile(){
  const user = mockUser

  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div>
          <h1 style={{fontSize: '1.875rem', fontWeight: '600'}}>{user.username}</h1>
          <div style={{fontSize: '0.875rem', color: '#64748b'}}>Streak: {user.streakDays} days</div>
        </div>
        <div style={{fontSize: '0.875rem', color: '#4b5563'}}>Total games played: {user.totalGames}</div>
      </div>

      <div style={{marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
        {Object.entries(user.progress).map(([k,v])=> (
          <StatCard key={k} title={k} value={v} subtitle="Progress" />
        ))}
      </div>
    </div>
  )
}
