import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal } from 'lucide-react';
import { useGameContext } from '../../context/GameContext';

const Leaderboard = () => {
    const { state } = useGameContext();
    const { leaderboards } = state;
    const [selectedGame, setSelectedGame] = useState('all');

    const games = Object.keys(leaderboards);

    const getMedalColor = (index) => {
        switch (index) {
            case 0: return 'text-yellow-400';
            case 1: return 'text-slate-300';
            case 2: return 'text-amber-600';
            default: return 'text-slate-500';
        }
    };

    return (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-yellow-500/10 rounded-xl">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                </div>
                <h2 className="text-xl font-bold">Local Leaderboards</h2>
            </div>

            {games.length === 0 ? (
                <div className="text-center text-slate-500 py-8">
                    No records yet. Play some games to set high scores!
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {games.map(game => (
                            <button
                                key={game}
                                onClick={() => setSelectedGame(game)}
                                className={`
                                    px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition
                                    ${selectedGame === game
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}
                                `}
                            >
                                {game.replace('-', ' ').toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        {leaderboards[selectedGame] && leaderboards[selectedGame].map((entry, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-800 hover:border-slate-700 transition"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`font-bold text-lg w-8 text-center ${getMedalColor(index)}`}>
                                        #{index + 1}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{entry.name}</p>
                                        <p className="text-xs text-slate-500">{new Date(entry.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="font-mono font-bold text-xl text-blue-400">
                                    {entry.score.toLocaleString()}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
