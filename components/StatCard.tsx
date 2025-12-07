import React from 'react'
import { NeonCard } from './ui/NeonCard'

type Props = {
  title: string
  value: string | number
  subtitle?: string
}

export default function StatCard({ title, value, subtitle }: Props) {
  return (
    <NeonCard className="p-6 border-slate-700/50 hover:border-neon-blue/30 transition-colors">
      <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold">{title}</div>
      <div className="text-3xl font-bold mt-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
        {value}
      </div>
      {subtitle && <div className="text-xs text-slate-500 mt-2 font-mono">{subtitle}</div>}
    </NeonCard>
  )
}
