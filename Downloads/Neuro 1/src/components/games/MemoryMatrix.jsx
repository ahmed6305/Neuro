import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RefreshCw, ArrowLeft } from 'lucide-react';
import { useGameContext } from '../../context/GameContext';
import GameInstructions from '../common/GameInstructions';
import soundManager from '../../utils/SoundManager';

const MemoryMatrix = () => {
    const { addGameSession, state } = useGameContext();
    const [gameState, setGameState] = useState('start'); // start, memorizing, recalling, gameover
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [gridSize, setGridSize] = useState(3);
    const [pattern, setPattern] = useState([]);
    const [userPattern, setUserPattern] = useState([]);
    const [showInstructions, setShowInstructions] = useState(false);

    const [difficulty, setDifficulty] = useState('Medium');

    // Sync sound settings
    useEffect(() => {
        if (state?.settings?.soundEnabled !== undefined) {
            soundManager.setEnabled(state.settings.soundEnabled);
        }
    }, [state]);

    const generatePattern = useCallback((size, lvl, diff) => {
        const tiles = size * size;
        let base = 3;
        let growth = 0.5; // Medium default

        if (diff === 'Easy') {
            base = 2;
            growth = 0.3;
        } else if (diff === 'Hard') {
            base = 4;
            growth = 0.7;
        }

        const numActive = Math.min(tiles - 1, base + Math.floor(lvl * growth));
        const newPattern = [];
        while (newPattern.length < numActive) {
            const rand = Math.floor(Math.random() * tiles);
            if (!newPattern.includes(rand)) {
                newPattern.push(rand);
            }
        }
        return newPattern;
    }, []);

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
        setGridSize(3);
        startLevel(1, 3, selectedDifficulty);
    };

    const startLevel = (lvl, size, diff) => {
        setGameState('memorizing');
        setUserPattern([]);
        const newPattern = generatePattern(size, lvl, diff);
        setPattern(newPattern);

        let showTime = 1000 + (lvl * 200);
        if (diff === 'Easy') showTime += 500;
        if (diff === 'Hard') showTime = Math.max(500, showTime - 500);

        setTimeout(() => {
            setGameState('recalling');
        }, showTime);
    };

    const handleTileClick = (index) => {
        if (gameState !== 'recalling') return;

        // Check if already clicked
        if (userPattern.includes(index)) return;

        const newUserPattern = [...userPattern, index];
        setUserPattern(newUserPattern);

        if (pattern.includes(index)) {
            soundManager.playClick();
            // Correct tile
            if (newUserPattern.length === pattern.length) {
                // Level Complete
                soundManager.playSuccess();
                const levelScore = (level * 100) + (gridSize * 50);
                setScore(s => s + levelScore);

                setTimeout(() => {
                    const nextLevel = level + 1;
                    setLevel(nextLevel);
                    const nextSize = Math.floor(nextLevel / 3) + 3;
                    setGridSize(Math.min(6, nextSize));
                    startLevel(nextLevel, Math.min(6, nextSize), difficulty);
                }, 500);
            }
        } else {
            // Wrong tile - Game Over
            soundManager.playFailure();
            soundManager.playGameOver();
            setGameState('gameover');
            addGameSession('memory-matrix', score, ['memory', 'visual']);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-4 min-h-[calc(100vh-4rem)]">
            <GameInstructions
                title="Memory Matrix"
                isOpen={showInstructions}
                onStart={startGame}
                instructions={[
                    "Watch the grid carefully as tiles light up.",
                    "Memorize the pattern.",
                    "Tap the tiles to recreate the pattern.",
                    "The pattern gets longer and the grid gets larger as you progress."
                ]}
            />

            <div className="flex justify-between w-full mb-8 max-w-[400px] items-center">
                <Link to="/dashboard" className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="text-xl font-bold text-slate-400">Level {level}</div>
                <div className="text-xl font-bold text-blue-400">Score: {score}</div>
            </div>

            <div className="relative w-full bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl min-h-[400px]">
                {gameState === 'start' && (
                    <div className="flex items-center justify-center min-h-[350px]">
                        <div className="text-center py-12 px-4">
                            <h2 className="text-3xl font-bold mb-4">Memory Matrix</h2>
                            <p className="text-slate-400 mb-8">Test your pattern recall abilities.</p>

                            <div className="text-left max-w-sm mx-auto mb-8 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <h3 className="text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div> How to Play
                                </h3>
                                <ul className="space-y-2 text-slate-400 text-sm">
                                    <li className="flex gap-2">
                                        <span className="text-blue-500 font-bold">1.</span> Watch the tiles light up
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-blue-500 font-bold">2.</span> Memorize the pattern
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-blue-500 font-bold">3.</span> Recreate it to advance
                                    </li>
                                </ul>
                            </div>

                            <button
                                onClick={handleStartClick}
                                className="flex items-center mx-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full text-xl font-bold transition shadow-lg hover:shadow-blue-500/25"
                            >
                                <Play className="mr-2" /> Start Game
                            </button>
                        </div>
                    </div>
                )}

                {gameState === 'gameover' && (
                    <div className="flex items-center justify-center min-h-[350px]">
                        <div className="text-center py-12 px-4 animate-in fade-in zoom-in duration-300">
                            <h2 className="text-3xl font-bold text-red-500 mb-2">Game Over</h2>
                            <p className="text-slate-400 mb-6">Final Score: {score}</p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => startGame(difficulty)}
                                    className="flex items-center justify-center px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-full text-xl font-bold transition w-full"
                                >
                                    <RefreshCw className="mr-2" /> Play Again
                                </button>
                                <Link
                                    to="/dashboard"
                                    className="flex items-center justify-center px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-full text-lg font-bold text-slate-400 hover:text-white transition w-full"
                                >
                                    <ArrowLeft className="mr-2 w-5 h-5" /> Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {(gameState === 'memorizing' || gameState === 'recalling') && (
                    <div
                        className="grid gap-3 mx-auto transition-all duration-300"
                        style={{
                            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                            width: 'min(100%, 400px)',
                            aspectRatio: '1/1'
                        }}
                    >
                        {Array.from({ length: gridSize * gridSize }).map((_, i) => {
                            const isPattern = pattern.includes(i);
                            const isSelected = userPattern.includes(i);
                            const isWrong = isSelected && !isPattern;

                            let bgClass = 'bg-slate-800';
                            if (gameState === 'memorizing' && isPattern) bgClass = 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]';
                            if (gameState === 'recalling') {
                                if (isSelected && isPattern) bgClass = 'bg-green-500';
                                if (isWrong) bgClass = 'bg-red-500';
                            }

                            return (
                                <motion.button
                                    key={i}
                                    whileHover={{ scale: gameState === 'recalling' ? 1.05 : 1 }}
                                    whileTap={{ scale: gameState === 'recalling' ? 0.95 : 1 }}
                                    onClick={() => handleTileClick(i)}
                                    className={`rounded-xl transition-colors duration-200 ${bgClass}`}
                                    disabled={gameState !== 'recalling'}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemoryMatrix;
