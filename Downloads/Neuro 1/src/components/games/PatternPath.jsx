import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RefreshCw, Map, Pause, ArrowLeft } from 'lucide-react';
import { useGameContext } from '../../context/GameContext';
import GameInstructions from '../common/GameInstructions';
import soundManager from '../../utils/SoundManager';

const PatternPath = () => {
    const { addGameSession, state } = useGameContext();
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [gridSize, setGridSize] = useState(3);
    const [path, setPath] = useState([]);
    const [userPath, setUserPath] = useState([]);
    const [gameState, setGameState] = useState('start'); // start, memorize, recall, paused, success, gameover
    const [memorizeTimeLeft, setMemorizeTimeLeft] = useState(0);
    const [showInstructions, setShowInstructions] = useState(false);

    const [difficulty, setDifficulty] = useState('Medium');

    // Sync sound settings
    useEffect(() => {
        if (state?.settings?.soundEnabled !== undefined) {
            soundManager.setEnabled(state.settings.soundEnabled);
        }
    }, [state]);

    // Timer for memorization phase
    useEffect(() => {
        let interval;
        if (gameState === 'memorize' && memorizeTimeLeft > 0) {
            interval = setInterval(() => {
                setMemorizeTimeLeft(prev => {
                    if (prev <= 100) {
                        setGameState('recall');
                        return 0;
                    }
                    return prev - 100;
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [gameState, memorizeTimeLeft]);

    const generatePath = (lvl, size, diff = difficulty) => {
        let growth = 1;
        if (diff === 'Easy') growth = 0.5;
        if (diff === 'Hard') growth = 1.5;

        const pathLength = Math.min(size * size, 3 + Math.floor(lvl * growth));
        const newPath = [];
        let current = Math.floor(Math.random() * (size * size));
        newPath.push(current);

        for (let i = 0; i < pathLength - 1; i++) {
            const neighbors = getNeighbors(current, size);
            const validNeighbors = neighbors.filter(n => !newPath.includes(n));

            if (validNeighbors.length === 0) break; // Stuck, just end path here

            const next = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
            newPath.push(next);
            current = next;
        }
        return newPath;
    };

    const getNeighbors = (index, size) => {
        const neighbors = [];
        const row = Math.floor(index / size);
        const col = index % size;

        if (row > 0) neighbors.push(index - size); // Up
        if (row < size - 1) neighbors.push(index + size); // Down
        if (col > 0) neighbors.push(index - 1); // Left
        if (col < size - 1) neighbors.push(index + 1); // Right

        return neighbors;
    };

    const startLevel = (lvl, size, diff) => {
        setUserPath([]);
        const newPath = generatePath(lvl, size, diff);
        setPath(newPath);

        let showTime = Math.max(1500, 2000 - (lvl * 100));
        if (diff === 'Easy') showTime += 1000;
        if (diff === 'Hard') showTime = Math.max(1000, showTime - 500);

        setMemorizeTimeLeft(showTime);
        setGameState('memorize');
    };

    const handleStartClick = () => {
        soundManager.playClick();
        setShowInstructions(true);
    };

    const startGame = (selectedDifficulty) => {
        soundManager.playClick();
        setDifficulty(selectedDifficulty);
        setShowInstructions(false);
        setLevel(1);
        setScore(0);
        setGridSize(3);
        startLevel(1, 3, selectedDifficulty);
    };

    const togglePause = () => {
        soundManager.playClick();
        if (gameState === 'memorize' || gameState === 'recall') {
            // Store previous state to resume to? 
            // Actually, if we pause during memorize, we resume to memorize.
            // If we pause during recall, we resume to recall.
            // We can use a ref or just check logic.
            // But we need to know which one to go back to.
            // Let's use a 'pausedFrom' state or just deduce.
            // Simpler: setGameState('paused') and store 'previousState' in a ref.
        }
    };

    // Better Pause Logic with Ref
    const previousStateRef = useRef(null);
    const handlePauseToggle = () => {
        soundManager.playClick();
        if (gameState === 'paused') {
            setGameState(previousStateRef.current);
        } else if (gameState === 'memorize' || gameState === 'recall') {
            previousStateRef.current = gameState;
            setGameState('paused');
        }
    };

    const handleTileClick = (index) => {
        if (gameState !== 'recall') return;

        const expectedIndex = userPath.length;
        const expectedTile = path[expectedIndex];

        if (index === expectedTile) {
            soundManager.playClick();
            const newUserPath = [...userPath, index];
            setUserPath(newUserPath);

            if (newUserPath.length === path.length) {
                soundManager.playSuccess();
                setGameState('success');
                setScore(s => s + (path.length * 20));
                setTimeout(() => {
                    const nextLevel = level + 1;
                    setLevel(nextLevel);
                    const nextSize = Math.floor((nextLevel - 1) / 3) + 3;
                    setGridSize(nextSize);
                    startLevel(nextLevel, nextSize, difficulty);
                }, 1000);
            }
        } else {
            soundManager.playFailure();
            soundManager.playGameOver();
            setGameState('gameover');
            addGameSession('pattern-path', score, ['visual', 'memory']);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-4 relative">
            <GameInstructions
                title="Pattern Path"
                isOpen={showInstructions}
                onStart={startGame}
                instructions={[
                    "A path will appear on the grid connecting tiles.",
                    "Memorize the EXACT order of the path.",
                    "Retrace the path by clicking the tiles in the correct order.",
                    "The path gets longer and more complex as you level up!"
                ]}
            />

            <div className="flex justify-between w-full mb-8 max-w-[400px] items-center">
                <Link to="/dashboard" className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="text-xl font-bold">Level: {level}</div>

                {(gameState === 'memorize' || gameState === 'recall' || gameState === 'paused') && (
                    <button
                        onClick={handlePauseToggle}
                        className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition"
                    >
                        {gameState === 'paused' ? <Play className="w-5 h-5 text-green-500" /> : <Pause className="w-5 h-5 text-yellow-500" />}
                    </button>
                )}

                <div className="text-xl font-bold text-blue-400">Score: {score}</div>
            </div>

            <div className="relative w-full max-w-[400px]">
                {(gameState === 'memorize' || gameState === 'recall' || gameState === 'paused' || gameState === 'success' || gameState === 'gameover') && (
                    <div
                        className={`grid gap-2 bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-2xl transition-opacity duration-300 ${gameState === 'paused' ? 'opacity-0' : 'opacity-100'}`}
                        style={{
                            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                            width: '100%',
                            aspectRatio: '1/1'
                        }}
                    >
                        {Array.from({ length: gridSize * gridSize }).map((_, i) => {
                            let bgColor = 'bg-slate-800';
                            let content = '';

                            if (gameState === 'memorize') {
                                const pathIndex = path.indexOf(i);
                                if (pathIndex !== -1) {
                                    bgColor = 'bg-blue-500';
                                    content = pathIndex + 1;
                                }
                            } else if (gameState === 'recall') {
                                const userIndex = userPath.indexOf(i);
                                if (userIndex !== -1) {
                                    bgColor = 'bg-green-500';
                                    content = userIndex + 1;
                                }
                            } else if (gameState === 'gameover') {
                                const pathIndex = path.indexOf(i);
                                if (pathIndex !== -1) {
                                    bgColor = 'bg-blue-900/50';
                                    content = pathIndex + 1;
                                }
                            }

                            return (
                                <motion.button
                                    key={i}
                                    whileHover={{ scale: gameState === 'recall' ? 0.95 : 1 }}
                                    whileTap={{ scale: gameState === 'recall' ? 0.9 : 1 }}
                                    onClick={() => handleTileClick(i)}
                                    className={`
                                        rounded-lg transition-all duration-200 ${bgColor} 
                                        flex items-center justify-center text-white font-bold text-lg
                                        ${gameState === 'recall' ? 'cursor-pointer hover:bg-slate-700' : 'cursor-default'}
                                    `}
                                    disabled={gameState !== 'recall'}
                                >
                                    {content}
                                </motion.button>
                            );
                        })}
                    </div>
                )}

                {gameState === 'paused' && (
                    <div className="absolute inset-0 z-10 bg-slate-900/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center border border-slate-700">
                        <h3 className="text-2xl font-bold text-white mb-4">PAUSED</h3>
                        <button
                            onClick={handlePauseToggle}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-full font-bold flex items-center"
                        >
                            <Play className="w-5 h-5 mr-2" /> Resume
                        </button>
                    </div>
                )}
            </div>

            {gameState === 'start' && (
                <div className="text-center">
                    <Map className="w-16 h-16 text-blue-500 mx-auto mb-6" />
                    <button
                        onClick={handleStartClick}
                        className="flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full text-xl font-bold transition shadow-lg hover:shadow-blue-500/25 mx-auto"
                    >
                        <Play className="mr-2" /> Start Game
                    </button>
                </div>
            )}

            {gameState === 'gameover' && (
                <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-50 animate-in fade-in duration-300">
                    <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center max-w-md mx-4">
                        <h3 className="text-3xl font-bold text-red-500 mb-4">Game Over</h3>
                        <p className="text-slate-400 mb-6">Final Score: {score}</p>
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

            {gameState === 'success' && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-green-500 animate-bounce pointer-events-none">
                    Path Complete!
                </div>
            )}
        </div>
    );
};

export default PatternPath;
