"use client"
import React, { useEffect, useState } from 'react'
import { NeonCard } from './ui/NeonCard'
import { NeonButton } from './ui/NeonButton'
import { getWeeklySummary, downloadCSV } from '../lib/sessionTracking'

export default function WeeklySummary() {
    const [summary, setSummary] = useState({
        thisWeekCount: 0,
        lastWeekCount: 0,
        totalMinutes: 0,
        streak: 0
    })

    useEffect(() => {
        setSummary(getWeeklySummary())
    }, [])

    const improvement = summary.thisWeekCount - summary.lastWeekCount
    const improvementText = improvement > 0
        ? `+${improvement} from last week!`
        : improvement < 0
            ? `${improvement} from last week`
            : 'Same as last week'

    return (
        <NeonCard className="p-6 border-neon-blue/20">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">This Week's Warm-ups</h3>
                <button
                    onClick={downloadCSV}
                    className="text-sm text-slate-400 hover:text-neon-blue transition-colors"
                    title="Export to CSV"
                >
                    📊 Export
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 rounded-xl bg-slate-800/50">
                    <div className="text-3xl font-bold text-neon-blue">{summary.thisWeekCount}</div>
                    <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Sessions</div>
                </div>

                <div className="text-center p-4 rounded-xl bg-slate-800/50">
                    <div className="text-3xl font-bold text-neon-purple">{summary.totalMinutes}</div>
                    <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Minutes</div>
                </div>

                <div className="text-center p-4 rounded-xl bg-slate-800/50">
                    <div className="text-3xl font-bold text-neon-green">{summary.streak}</div>
                    <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Day Streak</div>
                </div>

                <div className="text-center p-4 rounded-xl bg-slate-800/50">
                    <div className={`text-2xl font-bold ${improvement >= 0 ? 'text-neon-green' : 'text-neon-yellow'}`}>
                        {improvement >= 0 ? '📈' : '📉'} {Math.abs(improvement)}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">vs Last Week</div>
                </div>
            </div>

            {summary.thisWeekCount > 0 && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-neon-purple/10 to-neon-blue/10 border border-slate-700">
                    <p className="text-sm text-slate-300">
                        <span className="text-white font-semibold">Great job!</span> You completed {summary.thisWeekCount} warm-up{summary.thisWeekCount !== 1 ? 's' : ''} this week. {improvementText}
                    </p>
                </div>
            )}

            {summary.thisWeekCount === 0 && (
                <div className="p-4 rounded-xl bg-slate-800/30 border border-dashed border-slate-700 text-center">
                    <p className="text-sm text-slate-400">
                        No warm-ups this week yet. Start your first session at the top of the page!
                    </p>
                </div>
            )}
        </NeonCard>
    )
}
