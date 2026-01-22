import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RefreshCw, Timer, Pause, ArrowLeft } from 'lucide-react';
import { useGameContext } from '../../context/GameContext';
import GameInstructions from '../common/GameInstructions';
import soundManager from '../../utils/SoundManager';

const COLORS = [
    { name: 'RED', value: 'text-red-500', hex: '#ef4444' },
    { name: 'BLUE', value: 'text-blue-500', hex: '#3b82f6' },
    { name: 'GREEN', value: 'text-green-500', hex: '#22c55e' },
    { name: 'YELLOW', value: 'text-yellow-500', hex: '#eab308' },
    { name: 'PURPLE', value: 'text-purple-500', hex: '#a855f7' },
];

const ColorChaos = () => {
    const { addGameSession, state } = useGameContext();
    const timerRef = useRef(null);
    const [gameState, setGameState] = useState('start'); // start, playing, paused, gameover
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(45);
    const [currentWord, setCurrentWord] = useState(null);
    const [options, setOptions] = useState([]);
    const [showInstructions, setShowInstructions] = useState(false);

    const [difficulty, setDifficulty] = useState('Medium');

    // Sync sound settings
    useEffect(() => {
        if (state?.settings?.soundEnabled !== undefined) {
            soundManager.setEnabled(state.settings.soundEnabled);
        }
    }, [state]);

    const generateRound = (diff = difficulty) => {
        const wordObj = COLORS[Math.floor(Math.random() * COLORS.length)];
        let colorObj = COLORS[Math.floor(Math.random() * COLORS.length)];
        const correctAnswer = colorObj;

        let numWrong = 2;
        if (diff === 'Easy') numWrong = 1;
        if (diff === 'Hard') numWrong = 3;

        const wrongAnswers = COLORS.filter(c => c.name !== correctAnswer.name)
            .sort(() => 0.5 - Math.random())
            .slice(0, numWrong);
        const roundOptions = [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());

        setCurrentWord({ text: wordObj.name, color: colorObj.value });
        setOptions(roundOptions);
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

        let time = 45;
        if (selectedDifficulty === 'Easy') time = 60;
        if (selectedDifficulty === 'Hard') time = 30;

        setTimeLeft(time);
        setGameState('playing');
        generateRound(selectedDifficulty);

        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    endGame();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const togglePause = () => {
        soundManager.playClick();
        if (gameState === 'playing') {
            setGameState('paused');
            clearInterval(timerRef.current);
        } else if (gameState === 'paused') {
            setGameState('playing');
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        endGame();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    };

    const endGame = () => {
        clearInterval(timerRef.current);
        soundManager.playGameOver();
        setGameState('gameover');
    };

    useEffect(() => {
        if (gameState === 'gameover') {
            addGameSession('color-chaos', score, ['attention', 'speed']);
        }
    }, [gameState]);

    const handleAnswer = (selectedColor) => {
        if (gameState !== 'playing') return;

        if (selectedColor.value === currentWord.color) {
            soundManager.playSuccess();
            setScore(s => s + 150);
        } else {
            soundManager.playFailure();
            setScore(s => Math.max(0, s - 50));
        }
        generateRound();
    };

    useEffect(() => {
        return () => clearInterval(timerRef.current);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-4 relative">
            <GameInstructions
                title="Color Chaos"
                isOpen={showInstructions}
                onStart={startGame}
                instructions={[
                    "A word will appear in a specific color.",
                    "Ignore the word itself! Look at the INK COLOR.",
                    "Tap the button that matches the INK COLOR.",
                    "Example: If the word 'RED' is written in blue ink, tap 'BLUE'."
                ]}
            />

            <div className="flex justify-between w-full mb-8 max-w-[400px] items-center">
                <Link to="/dashboard" className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="flex items-center text-xl font-bold text-slate-400">
                    <Timer className="w-5 h-5 mr-2" /> {timeLeft}s
                </div>

                {(gameState === 'playing' || gameState === 'paused') && (
                    <button
                        onClick={togglePause}
                        className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition"
                    >
                        {gameState === 'paused' ? <Play className="w-5 h-5 text-green-500" /> : <Pause className="w-5 h-5 text-yellow-500" />}
                    </button>
                )}

                <div className="text-xl font-bold text-blue-400">Score: {score}</div>
            </div>

            <div className="relative w-full max-w-[400px] h-64 mb-8 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center shadow-2xl">
                <AnimatePresence mode='wait'>
                    {(gameState === 'playing' || gameState === 'paused') && currentWord && (
                        <motion.div
                            key={score} // Re-animate on new round
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`text-6xl font-black ${currentWord.color} tracking-wider`}
                        >
                            {currentWord.text}
                        </motion.div>
                    )}
                </AnimatePresence>

                {gameState === 'paused' && (
                    <div className="absolute inset-0 z-10 bg-slate-900/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center border border-slate-700">
                        <h3 className="text-2xl font-bold text-white mb-4">PAUSED</h3>
                        <button
                            onClick={togglePause}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-full font-bold flex items-center"
                        >
                            <Play className="w-5 h-5 mr-2" /> Resume
                        </button>
                    </div>
                )}

                {gameState === 'start' && (
                    <div className="text-center px-6">
                        <p className="text-slate-400 text-lg mb-2">Click the button that matches the</p>
                        <p className="text-white font-bold text-2xl mb-2">INK COLOR</p>
                        <p className="text-slate-500 text-sm">(Not the word!)</p>
                    </div>
                )}
            </div>

            {gameState === 'playing' && (
                <div className="grid grid-cols-3 gap-4 w-full max-w-[400px]">
                    {options.map((opt) => (
                        <button
                            key={opt.name}
                            onClick={() => handleAnswer(opt)}
                            className="py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-bold text-white transition hover:scale-105 active:scale-95"
                        >
                            {opt.name}
                        </button>
                    ))}
                </div>
            )}

            {gameState === 'start' && (
                <button
                    onClick={handleStartClick}
                    className="flex items-center px-8 py-4 bg-red-600 hover:bg-red-500 rounded-full text-xl font-bold transition shadow-lg hover:shadow-red-500/25"
                >
                    <Play className="mr-2" /> Start Chaos
                </button>
            )}

            {gameState === 'gameover' && (
                <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <h3 className="text-3xl font-bold text-red-500 mb-4">Chaos Ended!</h3>
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
    );
};

export default ColorChaos;
