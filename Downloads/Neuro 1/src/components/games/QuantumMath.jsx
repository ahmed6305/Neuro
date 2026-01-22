import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RefreshCw, Calculator, Pause, ArrowLeft } from 'lucide-react';
import { useGameContext } from '../../context/GameContext';
import GameInstructions from '../common/GameInstructions';
import soundManager from '../../utils/SoundManager';

const QuantumMath = () => {
    const { addGameSession, state } = useGameContext();
    const [gameState, setGameState] = useState('start'); // start, playing, paused, gameover
    const [score, setScore] = useState(0);
    const [problem, setProblem] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [lives, setLives] = useState(3);
    const [showInstructions, setShowInstructions] = useState(false);

    const [difficulty, setDifficulty] = useState('Medium');

    const fallDuration = useRef(10); // Seconds to fall, decreases over time
    const inputRef = useRef(null);

    // Sync sound settings
    useEffect(() => {
        if (state?.settings?.soundEnabled !== undefined) {
            soundManager.setEnabled(state.settings.soundEnabled);
        }
    }, [state]);

    const generateProblem = (diff = difficulty) => {
        let ops = ['+', '-', '*'];
        if (diff === 'Easy') ops = ['+', '-'];

        const op = ops[Math.floor(Math.random() * ops.length)];
        let a, b, ans;

        let maxVal = 20;
        if (diff === 'Easy') maxVal = 10;
        if (diff === 'Hard') maxVal = 30;

        if (op === '+') {
            a = Math.floor(Math.random() * maxVal) + 1;
            b = Math.floor(Math.random() * maxVal) + 1;
            ans = a + b;
        } else if (op === '-') {
            a = Math.floor(Math.random() * maxVal) + (maxVal / 2);
            b = Math.floor(Math.random() * (maxVal / 2)) + 1;
            ans = a - b;
        } else {
            const multMax = diff === 'Hard' ? 12 : 9;
            a = Math.floor(Math.random() * multMax) + 2;
            b = Math.floor(Math.random() * multMax) + 2;
            ans = a * b;
        }

        return { text: `${a} ${op} ${b}`, answer: ans, id: Math.random() };
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
        setLives(3);
        setGameState('playing');
        setInputValue('');

        let startSpeed = 10;
        if (selectedDifficulty === 'Easy') startSpeed = 12;
        if (selectedDifficulty === 'Hard') startSpeed = 8;

        fallDuration.current = startSpeed;
        setProblem(generateProblem(selectedDifficulty));
        // Focus input
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const togglePause = () => {
        soundManager.playClick();
        if (gameState === 'playing') {
            setGameState('paused');
        } else if (gameState === 'paused') {
            setGameState('playing');
            // Regenerate problem to restart animation
            setProblem(generateProblem());
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const handleInput = (e) => {
        setInputValue(e.target.value);
        const val = parseInt(e.target.value);

        if (problem && val === problem.answer) {
            // Correct!
            soundManager.playSuccess();
            setScore(s => s + 100);
            setInputValue('');
            fallDuration.current = Math.max(2, fallDuration.current * 0.95); // Speed up
            setProblem(generateProblem());
        }
    };

    const handleMiss = () => {
        if (gameState !== 'playing') return;

        soundManager.playFailure();
        setLives(l => {
            const newLives = l - 1;
            if (newLives <= 0) {
                soundManager.playGameOver();
                setGameState('gameover');
                addGameSession('quantum-math', score, ['math', 'speed']);
            } else {
                setProblem(generateProblem());
                setInputValue('');
            }
            return newLives;
        });
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-4 min-h-[500px] relative">
            <GameInstructions
                title="Quantum Math"
                isOpen={showInstructions}
                onStart={startGame}
                instructions={[
                    "Math problems will fall from the sky.",
                    "Type the correct answer before the problem hits the ground.",
                    "The problems fall faster as you progress!",
                    "You have 3 lives. Good luck!"
                ]}
            />

            <div className="flex justify-between w-full mb-8 max-w-[400px] items-center">
                <Link to="/dashboard" className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="flex items-center text-xl font-bold text-red-400">
                    Lives: {'❤️'.repeat(lives)}
                </div>

                {(gameState === 'playing' || gameState === 'paused') && (
                    <button
                        onClick={togglePause}
                        className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition"
                    >
                        {gameState === 'paused' ? <Play className="w-5 h-5 text-green-500" /> : <Pause className="w-5 h-5 text-yellow-500" />}
                    </button>
                )}

                <div className="text-xl font-bold text-green-400">Score: {score}</div>
            </div>

            <div className="relative w-full max-w-[400px] h-[400px] bg-slate-900 rounded-2xl border-b-4 border-slate-700 overflow-hidden mb-8 shadow-2xl">
                {/* Ground */}
                <div className="absolute bottom-0 w-full h-2 bg-green-500/50" />

                <AnimatePresence>
                    {gameState === 'playing' && problem && (
                        <motion.div
                            key={problem.id}
                            initial={{ y: -50 }}
                            animate={{ y: 380 }}
                            transition={{ duration: fallDuration.current, ease: 'linear' }}
                            onAnimationComplete={handleMiss}
                            className="absolute left-1/2 -translate-x-1/2 bg-slate-800 px-6 py-3 rounded-xl border border-slate-600 text-2xl font-bold shadow-lg"
                        >
                            {problem.text} = ?
                        </motion.div>
                    )}
                </AnimatePresence>

                {gameState === 'paused' && (
                    <div className="absolute inset-0 z-10 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center">
                        <h3 className="text-2xl font-bold text-white mb-4">PAUSED</h3>
                        <button
                            onClick={togglePause}
                            className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-full font-bold flex items-center"
                        >
                            <Play className="w-5 h-5 mr-2" /> Resume
                        </button>
                    </div>
                )}

                {gameState === 'start' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80">
                        <p className="text-slate-400 text-center px-6 mb-4">
                            Solve the math problems before they hit the ground!
                        </p>
                        <button
                            onClick={handleStartClick}
                            className="flex items-center px-8 py-4 bg-green-600 hover:bg-green-500 rounded-full text-xl font-bold transition shadow-lg hover:shadow-green-500/25"
                        >
                            <Play className="mr-2" /> Start Math
                        </button>
                    </div>
                )}

                {gameState === 'gameover' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 animate-in fade-in duration-300">
                        <h3 className="text-3xl font-bold text-red-500 mb-4">Game Over</h3>
                        <p className="text-slate-400 mb-6">Final Score: {score}</p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => startGame(difficulty)}
                                className="flex items-center justify-center px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-full text-xl font-bold transition w-full"
                            >
                                <RefreshCw className="mr-2" /> Try Again
                            </button>
                            <Link
                                to="/dashboard"
                                className="flex items-center justify-center px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-full text-lg font-bold text-slate-400 hover:text-white transition w-full"
                            >
                                <ArrowLeft className="mr-2 w-5 h-5" /> Dashboard
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {gameState === 'playing' && (
                <div className="w-full max-w-[400px]">
                    <input
                        ref={inputRef}
                        type="number"
                        value={inputValue}
                        onChange={handleInput}
                        placeholder="Type answer..."
                        className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-6 py-4 text-2xl text-center font-bold focus:border-green-500 focus:outline-none transition"
                        autoFocus
                    />
                </div>
            )}
        </div>
    );
};

export default QuantumMath;
