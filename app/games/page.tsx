"use client"
import React, { useState } from 'react'
import { games as allGames, Game } from '../../lib/mockData'
import { NeonCard } from '../../components/ui/NeonCard'
import { NeonButton } from '../../components/ui/NeonButton'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Games page: displays a grid of games with filters
export default function GamesPage() {
  const [filter, setFilter] = useState<'All' | 'Memory' | 'Reflex' | 'Logic'>('All')
  const filters: Array<'All' | 'Memory' | 'Reflex' | 'Logic'> = ['All', 'Memory', 'Reflex', 'Logic']

  const visible = allGames.filter(g => {
    if (filter === 'All') return true
    return g.tags.includes(filter)
  })

  // Color mapping for game cards (reusing logic from Home for consistency)
  const getGameColor = (id: string) => {
    switch (id) {
      case 'emoji-memory-battle': return 'border-neon-purple/50 shadow-neon-purple/20';
      case 'sound-memory-beat': return 'border-neon-blue/50 shadow-neon-blue/20';
      case 'chaos-room-challenge': return 'border-neon-green/50 shadow-neon-green/20';
      case 'color-switch-reflex': return 'border-neon-red/50 shadow-neon-red/20';
      case 'category-sprint': return 'border-neon-yellow/50 shadow-neon-yellow/20';
      default: return 'border-slate-700 shadow-slate-900/50';
    }
  };

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">
          All Challenges
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          Explore {allGames.length} scientifically designed brain-training games.
          Choose your category and start pushing your limits.
        </p>

        <div className="flex flex-wrap gap-3">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${filter === f
                  ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-lg shadow-neon-blue/25 scale-105'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-slate-500 hover:text-white'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {visible.length > 0 ? (
          visible.map((g) => (
            <Link key={g.id} href={`/games/${g.id}`}>
              <NeonCard className={`h-full p-6 flex flex-col group cursor-pointer border hover:border-opacity-100 transition-all duration-300 hover:-translate-y-1 ${getGameColor(g.id)}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-lg bg-slate-800/50 group-hover:bg-slate-700/50 transition-colors">
                    <span className="text-3xl text-white">🎮</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
                     ${g.difficulty === 'Easy' ? 'bg-neon-green/10 text-neon-green' :
                      g.difficulty === 'Medium' ? 'bg-neon-yellow/10 text-neon-yellow' :
                        'bg-neon-red/10 text-neon-red'}`}>
                    {g.difficulty}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-purple transition-colors">
                  {g.name}
                </h3>
                <p className="text-slate-400 text-sm flex-grow mb-6 line-clamp-2">
                  {g.description}
                </p>

                <NeonButton variant="ghost" size="sm" className="w-full justify-between group-hover:bg-slate-800">
                  Play Now <span className="group-hover:translate-x-1 transition-transform">→</span>
                </NeonButton>
              </NeonCard>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-slate-500 bg-slate-800/30 rounded-3xl border border-dashed border-slate-700">
            <p className="text-lg">No games found for this filter.</p>
            <button onClick={() => setFilter('All')} className="text-neon-blue hover:underline mt-2">Clear filters</button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
