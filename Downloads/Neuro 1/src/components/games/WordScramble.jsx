import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RefreshCw, Type, Pause, ArrowLeft } from 'lucide-react';
import { useGameContext } from '../../context/GameContext';
import GameInstructions from '../common/GameInstructions';
import soundManager from '../../utils/SoundManager';

const WORDS = [
    'BRAIN', 'FOCUS', 'LOGIC', 'SPEED', 'MEMORY', 'NEURON', 'SYNAPSE', 'CORTEX',
    'PUZZLE', 'SMART', 'THINK', 'SOLVE', 'REACT', 'VISION', 'MENTAL', 'POWER',
    'GROWTH', 'SKILL', 'LEARN', 'QUICK', 'SHARP', 'ALERT', 'MIND', 'FLASH',
    'BRIGHT', 'CLEAR', 'LUCID', 'AWARE', 'AWAKE', 'READY'
];

const WordScramble = () => {
    const { addGameSession, state } = useGameContext();
    const [gameState, setGameState] = useState('start'); // start, playing, paused, gameover
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [currentWord, setCurrentWord] = useState('');
    const [scrambledWord, setScrambledWord] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [showInstructions, setShowInstructions] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const timerRef = useRef(null);
    const inputRef = useRef(null);

    const [difficulty, setDifficulty] = useState('Medium');

    // Sync sound settings
    useEffect(() => {
        if (state?.settings?.soundEnabled !== undefined) {
            soundManager.setEnabled(state.settings.soundEnabled);
        }
    }, [state]);

    const scramble = (word) => {
        const arr = word.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        // Ensure it's not the same
        if (arr.join('') === word) return scramble(word);
        return arr.join('');
    };

    const nextWord = () => {
        const word = WORDS[Math.floor(Math.random() * WORDS.length)];
        setCurrentWord(word);
        setScrambledWord(scramble(word));
        setInputValue('');
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

        let time = 60;
        if (selectedDifficulty === 'Easy') time = 90;
        if (selectedDifficulty === 'Hard') time = 45;

        setTimeLeft(time);
        setGameState('playing');
        nextWord();

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

        setTimeout(() => inputRef.current?.focus(), 100);
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
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const endGame = () => {
        clearInterval(timerRef.current);
        soundManager.playGameOver();
        setGameState('gameover');
    };

    useEffect(() => {
        if (gameState === 'gameover') {
            addGameSession('word-scramble', score, ['verbal', 'speed']);
        }
    }, [gameState]);

    const handleInput = (e) => {
        const val = e.target.value.toUpperCase();
        setInputValue(val);

        if (val === currentWord) {
            soundManager.playSuccess();
            setScore(s => s + 100 + (val.length * 10));
            setFeedback('correct');
            setTimeout(() => setFeedback(null), 500);
            nextWord();
        }
    };

    const handleSkip = () => {
        soundManager.playClick();
        setScore(s => Math.max(0, s - 20));
        nextWord();
        inputRef.current?.focus();
    };

    useEffect(() => {
        return () => clearInterval(timerRef.current);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-4 relative">
            <GameInstructions
                title="Word Scramble"
                isOpen={showInstructions}
                onStart={startGame}
                instructions={[
                    "A scrambled word will appear.",
                    "Unscramble the letters to form the correct word.",
                    "Type your answer in the box.",
                    "Solve as many as you can in 60 seconds!"
                ]}
            />

            <div className="flex justify-between w-full mb-8 max-w-[400px] items-center">
                <Link to="/dashboard" className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="text-xl font-bold text-slate-400">
                    {timeLeft}s
                </div>

                {(gameState === 'playing' || gameState === 'paused') && (
                    <button
                        onClick={togglePause}
                        className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition"
                    >
                        {gameState === 'paused' ? <Play className="w-5 h-5 text-green-500" /> : <Pause className="w-5 h-5 text-yellow-500" />}
                    </button>
                )}

                <div className="text-xl font-bold text-purple-400">Score: {score}</div>
            </div>

            <div className="relative w-full max-w-[500px] mb-8 bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl flex flex-col items-center">
                <AnimatePresence mode='wait'>
                    {(gameState === 'playing' || gameState === 'paused') && (
                        <>
                            <motion.div
                                key={scrambledWord}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`text-5xl font-black text-white tracking-widest mb-8 text-center ${gameState === 'paused' ? 'blur-md' : ''}`}
                            >
                                {scrambledWord}
                            </motion.div>

                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={handleInput}
                                className={`
                                    w-full bg-slate-800 border-2 rounded-xl px-6 py-4 text-3xl text-center font-bold uppercase focus:outline-none transition
                                    ${feedback === 'correct' ? 'border-green-500 text-green-500' : 'border-slate-700 text-white focus:border-purple-500'}
                                `}
                                placeholder={gameState === 'paused' ? "PAUSED" : "TYPE HERE"}
                                disabled={gameState === 'paused'}
                                autoFocus
                            />

                            <button
                                onClick={handleSkip}
                                className="mt-4 text-slate-500 hover:text-slate-300 text-sm font-bold"
                                disabled={gameState === 'paused'}
                            >
                                SKIP (-20 PTS)
                            </button>
                        </>
                    )}
                </AnimatePresence>

                {gameState === 'paused' && (
                    <div className="absolute inset-0 z-10 bg-slate-900/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center border border-slate-700">
                        <h3 className="text-2xl font-bold text-white mb-4">PAUSED</h3>
                        <button
                            onClick={togglePause}
                            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-full font-bold flex items-center"
                        >
                            <Play className="w-5 h-5 mr-2" /> Resume
                        </button>
                    </div>
                )}

                {gameState === 'start' && (
                    <div className="text-center">
                        <Type className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold mb-4">Word Scramble</h2>
                        <p className="text-slate-400 mb-8">
                            Unscramble the words as fast as you can!
                        </p>
                        <button
                            onClick={handleStartClick}
                            className="flex items-center px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-full text-xl font-bold transition shadow-lg hover:shadow-purple-500/25"
                        >
                            <Play className="mr-2" /> Start Game
                        </button>
                    </div>
                )}

                {gameState === 'gameover' && (
                    <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <h3 className="text-3xl font-bold text-purple-500 mb-4">Time's Up!</h3>
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
                )}
            </div>
        </div>
    );
};

export default WordScramble;
