import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RefreshCw, Eye, Pause, ArrowLeft } from 'lucide-react';
import { useGameContext } from '../../context/GameContext';
import GameInstructions from '../common/GameInstructions';
import soundManager from '../../utils/SoundManager';

const EMOJIS = ['😐', '😑', '😶', '🤔', '🤨', '🙄', '😬', '😮', '😯', '😲'];

const EagleEye = () => {
    const { addGameSession, state } = useGameContext();
    const [gameState, setGameState] = useState('start'); // start, playing, paused, gameover
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [grid, setGrid] = useState([]);
    const [targetIndex, setTargetIndex] = useState(0);
    const [targetEmoji, setTargetEmoji] = useState('');
    const [distractorEmoji, setDistractorEmoji] = useState('');
    const [showInstructions, setShowInstructions] = useState(false);

    const [difficulty, setDifficulty] = useState('Medium');

    // Sync sound settings
    useEffect(() => {
        if (state?.settings?.soundEnabled !== undefined) {
            soundManager.setEnabled(state.settings.soundEnabled);
        }
    }, [state]);

    const generateLevel = (lvl, diff = difficulty) => {
        let growth = 0.5;
        let maxGrid = 10;

        if (diff === 'Easy') {
            growth = 0.3;
            maxGrid = 6;
        } else if (diff === 'Hard') {
            growth = 0.8;
            maxGrid = 12;
        }

        const gridSize = Math.min(maxGrid, 4 + Math.floor(lvl * growth));
        const totalCells = gridSize * gridSize;

        // Pick emojis
        const t = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        let d = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        while (d === t) {
            d = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        }

        setTargetEmoji(t);
        setDistractorEmoji(d);

        const tIndex = Math.floor(Math.random() * totalCells);
        setTargetIndex(tIndex);

        const newGrid = Array(totalCells).fill(d);
        newGrid[tIndex] = t;

        setGrid(newGrid);
    };

    const handleStartClick = () => {
        soundManager.playClick();
        setShowInstructions(true);
    };

    const startGame = (selectedDifficulty) => {
        soundManager.playClick();
        setDifficulty(selectedDifficulty);
        setShowInstructions(false);
        setScore(0);
        setLevel(1);
        setGameState('playing');
        generateLevel(1, selectedDifficulty);
    };

    const togglePause = () => {
        soundManager.playClick();
        if (gameState === 'playing') {
            setGameState('paused');
        } else if (gameState === 'paused') {
            setGameState('playing');
        }
    };

    const handleCellClick = (index) => {
        if (gameState !== 'playing') return;

        if (index === targetIndex) {
            // Correct
            soundManager.playSuccess();
            setScore(s => s + (level * 100));
            setLevel(l => {
                const nextLevel = l + 1;
                generateLevel(nextLevel);
                return nextLevel;
            });
        } else {
            // Wrong
            soundManager.playFailure();
            soundManager.playGameOver();
            setGameState('gameover');
            addGameSession('eagle-eye', score, ['visual', 'attention']);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-4 relative">
            <GameInstructions
                title="Eagle Eye"
                isOpen={showInstructions}
                onStart={startGame}
                instructions={[
                    "A grid of emojis will appear.",
                    "Find the ONE unique emoji that is different from the rest.",
                    "Click it as fast as you can.",
                    "One wrong click ends the game!"
                ]}
            />

            <div className="flex justify-between w-full mb-8 max-w-[600px] items-center">
                <Link to="/dashboard" className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="text-xl font-bold">Level: {level}</div>

                {(gameState === 'playing' || gameState === 'paused') && (
                    <button
                        onClick={togglePause}
                        className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition"
                    >
                        {gameState === 'paused' ? <Play className="w-5 h-5 text-green-500" /> : <Pause className="w-5 h-5 text-yellow-500" />}
                    </button>
                )}

                <div className="flex items-center gap-4">
                    <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 flex items-center gap-2">
                        <span className="text-slate-400 text-sm">Find:</span>
                        <span className="text-2xl">{targetEmoji}</span>
                    </div>
                    <div className="text-xl font-bold text-yellow-400">Score: {score}</div>
                </div>
            </div>

            <div className="relative w-full max-w-[600px]">
                {(gameState === 'playing' || gameState === 'paused' || gameState === 'gameover') && (
                    <div
                        className={`grid gap-2 bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-2xl transition-opacity duration-300 ${gameState === 'paused' ? 'opacity-0' : 'opacity-100'}`}
                        style={{
                            gridTemplateColumns: `repeat(${Math.min(10, 4 + Math.floor(level / 2))}, minmax(0, 1fr))`,
                            width: '100%',
                            aspectRatio: '1/1'
                        }}
                    >
                        {grid.map((emoji, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleCellClick(i)}
                                className="flex items-center justify-center text-2xl sm:text-3xl md:text-4xl bg-slate-800 hover:bg-slate-700 rounded-lg transition cursor-pointer select-none"
                                disabled={gameState !== 'playing'}
                            >
                                {emoji}
                            </motion.button>
                        ))}
                    </div>
                )}

                {gameState === 'paused' && (
                    <div className="absolute inset-0 z-10 bg-slate-900/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center border border-slate-700">
                        <h3 className="text-2xl font-bold text-white mb-4">PAUSED</h3>
                        <button
                            onClick={togglePause}
                            className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 rounded-full font-bold flex items-center"
                        >
                            <Play className="w-5 h-5 mr-2" /> Resume
                        </button>
                    </div>
                )}
            </div>

            {gameState === 'start' && (
                <div className="text-center">
                    <Eye className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
                    <button
                        onClick={handleStartClick}
                        className="flex items-center px-8 py-4 bg-yellow-600 hover:bg-yellow-500 rounded-full text-xl font-bold transition shadow-lg hover:shadow-yellow-500/25 mx-auto"
                    >
                        <Play className="mr-2" /> Start Searching
                    </button>
                </div>
            )}

            {gameState === 'gameover' && (
                <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-50 animate-in fade-in duration-300">
                    <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center max-w-md mx-4">
                        <h3 className="text-3xl font-bold text-red-500 mb-4">Game Over</h3>
                        <p className="text-slate-400 mb-6">You reached Level {level}</p>
                        <p className="text-2xl font-bold text-white mb-8">Final Score: {score}</p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => startGame(difficulty)}
                                className="flex items-center justify-center w-full px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-full text-xl font-bold transition"
                            >
                                <RefreshCw className="mr-2" /> Try Again
                            </button>
                            <Link
                                to="/dashboard"
                                className="flex items-center justify-center w-full px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-full text-lg font-bold text-slate-400 hover:text-white transition"
                            >
                                <ArrowLeft className="mr-2 w-5 h-5" /> Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EagleEye;
