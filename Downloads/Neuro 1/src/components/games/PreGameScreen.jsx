import React from 'react';
import { Play, Info } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Unified Pre-Game Screen Component
 * Used by all games to provide consistent onboarding experience
 */
const PreGameScreen = ({
    gameName,
    skill,
    instructions = [],
    currentLevel = 1,
    onStart,
    icon
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center min-h-[500px] p-8"
        >
            <div className="max-w-md w-full text-center">
                {/* Game Icon */}
                {icon && (
                    <div className="text-6xl mb-6 animate-bounce-slow">
                        {icon}
                    </div>
                )}

                {/* Game Name */}
                <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    {gameName}
                </h2>

                {/* Skill Tag */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-sm font-medium text-blue-400">{skill}</span>
                </div>

                {/* Instructions */}
                {instructions.length > 0 && (
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 mb-8 text-left">
                        <div className="flex items-center gap-2 mb-4 text-slate-300">
                            <Info className="w-5 h-5" />
                            <h3 className="font-semibold">How to Play</h3>
                        </div>
                        <ul className="space-y-3">
                            {instructions.map((instruction, index) => (
                                <li key={index} className="flex gap-3 text-sm text-slate-400">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                                        {index + 1}
                                    </span>
                                    <span className="leading-relaxed">{instruction}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Start Button */}
                <button
                    onClick={onStart}
                    className="group w-full px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full text-lg font-bold transition shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-3"
                >
                    <Play className="w-5 h-5" />
                    Start Level {currentLevel}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>

                {/* Level Indicator */}
                <div className="mt-6 text-sm text-slate-500">
                    Level {currentLevel} / 10
                </div>
            </div>
        </motion.div>
    );
};

export default PreGameScreen;
