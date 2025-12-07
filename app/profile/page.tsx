"use client"
import React from 'react'
import { mockUser } from '../../lib/mockData'
import StatCard from '../../components/StatCard'
import { NeonCard } from '../../components/ui/NeonCard'

// Profile page: shows mock user progress and stats.
export default function Profile() {
  const user = mockUser

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <NeonCard className="p-8 border-neon-purple/20 bg-gradient-to-br from-slate-900 to-slate-800/50">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue p-1 shadow-lg shadow-neon-purple/20">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-4xl">
              🧠
            </div>
          </div>
          <div className="text-center md:text-left space-y-2 flex-grow">
            <h1 className="text-3xl font-bold text-white">{user.username}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium">
              <span className="px-3 py-1 rounded-full bg-neon-purple/10 text-neon-purple border border-neon-purple/20">
                🔥 Streak: {user.streakDays} days
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                🎮 Total Games: {user.totalGames}
              </span>
            </div>
          </div>
        </div>
      </NeonCard>

      {/* Stats Grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6 pl-2 border-l-4 border-neon-blue">Performance Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(user.progress).map(([k, v]) => (
            <StatCard key={k} title={k} value={v} subtitle="Current Level" />
          ))}
        </div>
      </div>
    </div>
  )
}
