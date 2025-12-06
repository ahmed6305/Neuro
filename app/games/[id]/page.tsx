import React from 'react'
import Link from 'next/link'
import { games } from '../../../lib/mockData'
import GameRenderer from '../../../components/GameRenderer'
import { GameShell } from '../../../components/ui/GameShell'
import { NeonButton } from '../../../components/ui/NeonButton'

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const game = games.find(g => g.id === id)

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="text-6xl">🎮</div>
        <h1 className="text-3xl font-bold text-white">Game Not Found</h1>
        <p className="text-slate-400">The game you're looking for doesn't exist.</p>
        <Link href="/">
          <NeonButton variant="primary">
            ← Back to Dashboard
          </NeonButton>
        </Link>
      </div>
    )
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'bg-neon-green/10 text-neon-green border-neon-green/20'
      case 'Medium': return 'bg-neon-yellow/10 text-neon-yellow border-neon-yellow/20'
      case 'Hard': return 'bg-neon-red/10 text-neon-red border-neon-red/20'
      default: return 'bg-slate-700/50 text-slate-300 border-slate-700'
    }
  }

  return (
    <GameShell
      title={game.name}
      subtitle={game.description}
      showBackButton={true}
    >
      {/* Tags and Metadata */}
      <div className="flex gap-3 flex-wrap mb-8">
        <span className={`px-3 py-1 rounded-lg text-sm font-bold border ${getDifficultyColor(game.difficulty)}`}>
          {game.difficulty}
        </span>
        {game.tags.map(tag => (
          <span key={tag} className="px-3 py-1 rounded-lg text-sm bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            #{tag}
          </span>
        ))}
      </div>

      {/* Game Renderer */}
      <div className="w-full">
        <GameRenderer gameId={game.id as any} />
      </div>

    </GameShell>
  )
}
