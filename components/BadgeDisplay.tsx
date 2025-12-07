"use client"
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { NeonCard } from './ui/NeonCard'
import { checkBadges, type Badge } from '../lib/badges'

export default function BadgeDisplay() {
    const [badges, setBadges] = useState<Badge[]>([])

    useEffect(() => {
        setBadges(checkBadges())
    }, [])

    const unlockedBadges = badges.filter(b => b.unlocked)
    const lockedBadges = badges.filter(b => !b.unlocked)

    return (
        <NeonCard className="p-6 border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-6">Achievement Badges</h3>

            {/* Unlocked Badges */}
            {unlockedBadges.length > 0 && (
                <div className="mb-6">
                    <div className="text-sm text-slate-400 mb-3">Unlocked ({unlockedBadges.length})</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {unlockedBadges.map((badge) => (
                            <motion.div
                                key={badge.id}
                                whileHover={{ scale: 1.05 }}
                                className="p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-neon-purple/30 text-center cursor-pointer group"
                                title={badge.description}
                            >
                                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{badge.emoji}</div>
                                <div className="text-xs font-semibold text-white mb-1">{badge.name}</div>
                                <div className="text-xs text-slate-400 line-clamp-2">{badge.description}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Locked Badges */}
            {lockedBadges.length > 0 && (
                <div>
                    <div className="text-sm text-slate-400 mb-3">Locked ({lockedBadges.length})</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {lockedBadges.map((badge) => (
                            <div
                                key={badge.id}
                                className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center opacity-40"
                                title={badge.description}
                            >
                                <div className="text-4xl mb-2 filter grayscale">{badge.emoji}</div>
                                <div className="text-xs font-semibold text-slate-500 mb-1">{badge.name}</div>
                                <div className="text-xs text-slate-600 line-clamp-2">{badge.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {unlockedBadges.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                    <div className="text-4xl mb-2">🎯</div>
                    <p className="text-sm">Complete warm-ups to unlock achievement badges!</p>
                </div>
            )}
        </NeonCard>
    )
}
