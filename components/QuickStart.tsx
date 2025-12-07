"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { NeonCard } from './ui/NeonCard'
import { NeonButton } from './ui/NeonButton'
import { games } from '../lib/mockData'
import { saveSession, getStreak } from '../lib/sessionTracking'

type WarmupMode = '5min' | '10min' | 'custom'

interface WarmupConfig {
    mode: WarmupMode
    duration: number // in seconds
    gameCount: number
    description: string
}

const WARMUP_CONFIGS: Record<WarmupMode, WarmupConfig> = {
    '5min': {
        mode: '5min',
        duration: 300,
        gameCount: 2,
        description: 'Quick energizer - Memory + Reflex'
    },
    '10min': {
        mode: '10min',
        duration: 600,
        gameCount: 4,
        description: 'Power-up session - Balanced training'
    },
    custom: {
        mode: 'custom',
        duration: 0,
        gameCount: 3,
        description: 'Choose your games'
    }
}

export default function QuickStart() {
    const [selectedMode, setSelectedMode] = useState<WarmupMode | null>(null)
    const [isActive, setIsActive] = useState(false)
    const [currentGameIndex, setCurrentGameIndex] = useState(0)
    const [selectedGames, setSelectedGames] = useState<string[]>([])
    const [timeRemaining, setTimeRemaining] = useState(0)
    const [sessionStartTime, setSessionStartTime] = useState<number>(0)
    const streak = typeof window !== 'undefined' ? getStreak() : { current: 0 }

    // Select games based on mode
    const selectGamesForMode = (mode: WarmupMode) => {
        if (mode === '5min') {
            // Pick one memory game and one reflex game
            const memoryGames = games.filter(g => g.tags.includes('Memory'))
            const reflexGames = games.filter(g => g.tags.includes('Reflex'))
            return [
                memoryGames[Math.floor(Math.random() * memoryGames.length)]?.id,
                reflexGames[Math.floor(Math.random() * reflexGames.length)]?.id
            ].filter(Boolean)
        } else if (mode === '10min') {
            // Pick 4 random games from different categories
            const shuffled = [...games].sort(() => Math.random() - 0.5)
            return shuffled.slice(0, 4).map(g => g.id)
        }
        return []
    }

    const startWarmup = (mode: WarmupMode) => {
        const config = WARMUP_CONFIGS[mode]
        const gamesForSession = selectGamesForMode(mode)

        setSelectedMode(mode)
        setSelectedGames(gamesForSession)
        setCurrentGameIndex(0)
        setTimeRemaining(config.duration)
        setSessionStartTime(Date.now())
        setIsActive(true)
    }

    const completeSession = (completed: boolean) => {
        if (sessionStartTime) {
            const duration = Math.floor((Date.now() - sessionStartTime) / 1000)
            saveSession({
                date: new Date().toISOString(),
                duration,
                gamesPlayed: selectedGames,
                completed
            })
        }
        setIsActive(false)
        setSelectedMode(null)
    }

    // Timer countdown
    useEffect(() => {
        if (!isActive || timeRemaining <= 0) return

        const interval = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    completeSession(true)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [isActive, timeRemaining])

    if (isActive && selectedGames.length > 0) {
        const currentGame = games.find(g => g.id === selectedGames[currentGameIndex])
        const progress = ((currentGameIndex + 1) / selectedGames.length) * 100

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-lg flex flex-col"
            >
                {/* Header with timer and progress */}
                <div className="bg-slate-800/50 border-b border-slate-700 p-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => completeSession(false)}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    ← Exit
                                </button>
                                <div className="text-sm text-slate-400">
                                    Warm-up Session • Game {currentGameIndex + 1} of {selectedGames.length}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-2xl font-mono font-bold text-neon-blue">
                                    {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                                </div>
                            </div>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-neon-purple to-neon-blue"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>
                </div>

                {/* Game Area */}
                <div className="flex-grow flex items-center justify-center p-8">
                    {currentGame && (
                        <div className="max-w-4xl w-full">
                            <NeonCard className="p-8">
                                <h2 className="text-3xl font-bold text-white mb-4">{currentGame.name}</h2>
                                <p className="text-slate-400 mb-6">{currentGame.description}</p>
                                <Link href={`/games/${currentGame.id}`}>
                                    <NeonButton variant="primary" size="lg" className="w-full">
                                        Start Game →
                                    </NeonButton>
                                </Link>
                                {currentGameIndex < selectedGames.length - 1 && (
                                    <button
                                        onClick={() => setCurrentGameIndex(prev => prev + 1)}
                                        className="mt-4 text-slate-400 hover:text-white transition-colors text-sm"
                                    >
                                        Skip to next game
                                    </button>
                                )}
                            </NeonCard>
                        </div>
                    )}
                </div>
            </motion.div>
        )
    }

    return (
        <NeonCard className="p-8 border-neon-purple/20 bg-gradient-to-br from-slate-900/50 to-slate-800/30">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Quick Start Warm-up</h2>
                    <p className="text-slate-400">
                        Activate your brain in 5-10 minutes before deep training
                    </p>
                </div>
                {streak.current > 0 && (
                    <div className="text-right">
                        <div className="text-4xl mb-1">🔥</div>
                        <div className="text-2xl font-bold text-neon-purple">{streak.current}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">Day Streak</div>
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {/* 5-Minute Mode */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <NeonCard className="p-6 border-neon-blue/30 hover:border-neon-blue/60 transition-all cursor-pointer group">
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-4xl">⚡</div>
                            <div className="text-neon-blue text-2xl font-bold">5 min</div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Quick Energizer</h3>
                        <p className="text-slate-400 text-sm mb-4">
                            2 games • Memory + Reflex
                        </p>
                        <NeonButton
                            variant="secondary"
                            size="sm"
                            className="w-full"
                            onClick={() => startWarmup('5min')}
                        >
                            Start Now
                        </NeonButton>
                    </NeonCard>
                </motion.div>

                {/* 10-Minute Mode */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <NeonCard className="p-6 border-neon-purple/30 hover:border-neon-purple/60 transition-all cursor-pointer group">
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-4xl">🚀</div>
                            <div className="text-neon-purple text-2xl font-bold">10 min</div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Power-up Session</h3>
                        <p className="text-slate-400 text-sm mb-4">
                            4 games • Balanced domains
                        </p>
                        <NeonButton
                            variant="primary"
                            size="sm"
                            className="w-full"
                            onClick={() => startWarmup('10min')}
                        >
                            Start Now
                        </NeonButton>
                    </NeonCard>
                </motion.div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                <div className="flex items-center gap-3 text-sm text-slate-400">
                    <span className="text-2xl">💡</span>
                    <p>
                        <span className="text-white font-semibold">Pro Tip:</span> Use Neuro warm-ups before Lumosity or Elevate sessions for better focus!
                    </p>
                </div>
            </div>
        </NeonCard>
    )
}
