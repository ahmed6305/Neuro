"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { NeonCard } from './ui/NeonCard';
import { NeonButton } from './ui/NeonButton';
import type { Game } from '../lib/mockData';

export default function HomeClient({ games }: { games: Game[] }) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Color mapping for game cards
  const getGameColor = (id: string) => {
    switch (id) {
      case 'emoji-memory-battle': return 'border-neon-purple/50 shadow-neon-purple/20';
      case 'sound-memory-beat': return 'border-neon-blue/50 shadow-neon-blue/20';
      case 'chaos-room-challenge': return 'border-neon-green/50 shadow-neon-green/20';
      case 'color-switch-reflex': return 'border-neon-red/50 shadow-neon-red/20';
      default: return 'border-slate-700 shadow-slate-900/50';
    }
  };

  return (
    <div className="space-y-20">

      {/* Hero Section */}
      <section className="relative text-center space-y-8 pt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="inline-block"
        >
          <div className="text-8xl mb-4 animate-[float_6s_ease-in-out_infinite]">🧠</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl font-display font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-red bg-clip-text text-transparent mb-6">
            Neuro Brain Training
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Elevate your cognitive performance with scientifically-inspired challenges.
            <span className="block mt-2 text-neon-blue font-semibold">Focus. React. Remember.</span>
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center gap-4 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {['Progressive Difficulty', 'Real-time Feedback', 'Performance Tracking'].map((feature, i) => (
            <span key={i} className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-sm font-medium text-slate-300">
              {feature}
            </span>
          ))}
        </motion.div>
      </section>

      {/* Games Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Featured Challenges</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent ml-8" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {games.map((game) => (
            <Link key={game.id} href={`/games/${game.id}`}>
              <NeonCard className={`h-full p-6 flex flex-col group cursor-pointer border hover:border-opacity-100 ${getGameColor(game.id)}`}>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {game.id === 'emoji-memory-battle' && '🧩'}
                    {game.id === 'sound-memory-beat' && '🔊'}
                    {game.id === 'chaos-room-challenge' && '🎯'}
                    {game.id === 'color-switch-reflex' && '⚡'}
                    {!['emoji-memory-battle', 'sound-memory-beat', 'chaos-room-challenge', 'color-switch-reflex'].includes(game.id) && '🎮'}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
                    ${game.difficulty === 'Easy' ? 'bg-neon-green/10 text-neon-green' :
                      game.difficulty === 'Medium' ? 'bg-neon-yellow/10 text-neon-yellow' :
                        'bg-neon-red/10 text-neon-red'}`}>
                    {game.difficulty}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-purple transition-colors">
                  {game.name}
                </h3>
                <p className="text-slate-400 text-sm flex-grow mb-6">
                  {game.description}
                </p>

                <NeonButton variant="ghost" size="sm" className="w-full justify-between group-hover:bg-slate-800">
                  Start Training <span className="group-hover:translate-x-1 transition-transform">→</span>
                </NeonButton>
              </NeonCard>
            </Link>
          ))}
        </motion.div>
      </section>

      {/* Pro Tip Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative p-8 rounded-3xl bg-gradient-to-r from-neon-purple/10 to-neon-blue/10 border border-slate-800 text-center overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple via-neon-blue to-neon-purple opacity-50" />
        <h3 className="text-2xl font-bold text-white mb-4">💡 Neuro Scientist's Tip</h3>
        <p className="text-slate-300 max-w-2xl mx-auto text-lg">
          "Regular brain training can improve cognitive flexibility, working memory, and processing speed. Aim for <span className="text-neon-yellow font-bold">10-15 minutes</span> of focused practice daily for best results."
        </p>
      </motion.section>

    </div>
  );
}
