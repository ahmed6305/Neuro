import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight, Home, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Unified Post-Level Complete Screen
 * Shows after successfully completing a level
 */
const PostLevelScreen = ({
    level,
    score,
    accuracy,
    timeBonus,
    onNextLevel,
    onBackToGames,
    isLastLevel = false,
    encouragementMessage
}) => {
    // Default encouragement messages based on level
    const getDefaultMessage = () => {
        if (isLastLevel) return "🎉 Mastery Achieved!";
        if (level >= 8) return "Outstanding! You're almost there!";
        if (level >= 5) return "Great progress! Keep it up!";
        if (level >= 3) return "Nice work! You're improving!";
        return "Good start! Let's keep going!";
    };

    const message = encouragementMessage || getDefaultMessage();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center min-h-[500px] p-8"
        >
            <div className="max-w-md w-full text-center">
                {/* Success Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-6 shadow-lg shadow-green-500/50"
                >
                    <Trophy className="w-10 h-10 text-white" />
                </motion.div>

                {/* Level Complete */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl font-bold mb-3 text-green-400"
                >
                    Level {level} Complete!
                </motion.h2>

                {/* Encouragement Message */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-slate-400 mb-8"
                >
                    {message}
                </motion.p>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-2 gap-4 mb-8"
                >
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                        <div className="text-2xl font-bold text-blue-400">{score}</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Score</div>
                    </div>

                    {accuracy !== undefined && (
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <div className="text-2xl font-bold text-purple-400">{accuracy}%</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Accuracy</div>
                        </div>
                    )}

                    {timeBonus !== undefined && (
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 col-span-2">
                            <div className="text-2xl font-bold text-green-400">+{timeBonus}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Time Bonus</div>
                        </div>
                    )}
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-3"
                >
                    {!isLastLevel && onNextLevel && (
                        <button
                            onClick={onNextLevel}
                            className="group w-full px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full text-lg font-bold transition shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-3"
                        >
                            <TrendingUp className="w-5 h-5" />
                            Next Level
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    )}

                    {isLastLevel && (
                        <Link
                            to="/dashboard"
                            className="group w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full text-lg font-bold transition shadow-lg flex items-center justify-center gap-3"
                        >
                            <Trophy className="w-5 h-5" />
                            View Progress
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}

                    {onBackToGames && (
                        <button
                            onClick={onBackToGames}
                            className="w-full px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-full text-sm font-medium text-slate-400 hover:text-white transition flex items-center justify-center gap-2"
                        >
                            <Home className="w-4 h-4" />
                            Back to Games
                        </button>
                    )}
                </motion.div>

                {/* Progress Indicator */}
                {!isLastLevel && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="mt-6"
                    >
                        <div className="flex items-center justify-center gap-1">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1 w-8 rounded-full transition-colors ${i < level ? 'bg-blue-500' : 'bg-slate-700'
                                        }`}
                                />
                            ))}
                        </div>
                        <div className="text-xs text-slate-500 mt-2">
                            {level} / 10 Levels Complete
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default PostLevelScreen;
