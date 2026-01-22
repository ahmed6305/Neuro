import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, BarChart } from 'lucide-react';
import soundManager from '../../utils/SoundManager';

const GameInstructions = ({ title, instructions, onStart, isOpen }) => {
    const [difficulty, setDifficulty] = useState('Medium');

    if (!isOpen) return null;

    const handleStart = () => {
        soundManager.playClick();
        onStart(difficulty);
    };

    const handleDifficultyChange = (level) => {
        soundManager.playClick();
        setDifficulty(level);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <Info className="w-6 h-6 text-blue-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">{title}</h2>
                    </div>

                    <div className="space-y-4 mb-8 text-slate-300">
                        {instructions.map((instruction, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-500">
                                    {index + 1}
                                </span>
                                <p>{instruction}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-3 text-slate-400 text-sm font-bold uppercase tracking-wider">
                            <BarChart className="w-4 h-4" /> Select Difficulty
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {['Easy', 'Medium', 'Hard'].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => handleDifficultyChange(level)}
                                    className={`
                                        py-2 rounded-lg font-bold text-sm transition border
                                        ${difficulty === level
                                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'}
                                    `}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleStart}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 transition shadow-lg hover:shadow-blue-500/25"
                    >
                        <Play className="w-5 h-5" />
                        Start Playing
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default GameInstructions;
