import React from 'react';
import { motion } from 'framer-motion';
import { Medal, Lock } from 'lucide-react';
import { useGameContext } from '../../context/GameContext';

const Achievements = () => {
    const { state, ACHIEVEMENTS } = useGameContext();
    const unlockedIds = state.achievements || [];

    return (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-amber-500/10 rounded-xl">
                    <Medal className="w-6 h-6 text-amber-500" />
                </div>
                <h2 className="text-xl font-bold">Achievements</h2>
                <span className="ml-auto text-sm font-bold text-slate-500">
                    {unlockedIds.length} / {ACHIEVEMENTS.length} Unlocked
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ACHIEVEMENTS.map((achievement, index) => {
                    const isUnlocked = unlockedIds.includes(achievement.id);
                    return (
                        <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`
                                p-4 rounded-xl border flex items-center gap-4 transition
                                ${isUnlocked
                                    ? 'bg-slate-800/50 border-amber-500/30 shadow-lg shadow-amber-500/5'
                                    : 'bg-slate-900 border-slate-800 opacity-50 grayscale'}
                            `}
                        >
                            <div className={`
                                text-3xl w-12 h-12 flex items-center justify-center rounded-full
                                ${isUnlocked ? 'bg-slate-800' : 'bg-slate-800'}
                            `}>
                                {isUnlocked ? achievement.icon : <Lock className="w-6 h-6 text-slate-600" />}
                            </div>
                            <div>
                                <h3 className={`font-bold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                                    {achievement.title}
                                </h3>
                                <p className="text-sm text-slate-500">{achievement.description}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Achievements;
