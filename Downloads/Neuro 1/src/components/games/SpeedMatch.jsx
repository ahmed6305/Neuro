import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Check, X, RefreshCw, Timer, Pause, ArrowLeft } from 'lucide-react';
import { useGameContext } from '../../context/GameContext';
import GameInstructions from '../common/GameInstructions';
import soundManager from '../../utils/SoundManager';

const SHAPES = ['Square', 'Circle', 'Triangle', 'Star', 'Diamond'];
const COLORS = ['text-red-500', 'text-blue-500', 'text-green-500', 'text-yellow-500', 'text-purple-500'];

const SpeedMatch = () => {
    const { addGameSession, state } = useGameContext();
    const [gameState, setGameState] = useState('start'); // start, playing, paused, gameover
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [currentCard, setCurrentCard] = useState(null);
    const [previousCard, setPreviousCard] = useState(null);
    const [feedback, setFeedback] = useState(null); // 'correct', 'wrong'
    const [showInstructions, setShowInstructions] = useState(false);

    const timerRef = useRef(null);

    const [difficulty, setDifficulty] = useState('Medium');

    // Sync sound settings
    useEffect(() => {
        if (state?.settings?.soundEnabled !== undefined) {
            soundManager.setEnabled(state.settings.soundEnabled);
        }
    }, [state]);

    const generateCard = () => {
        return {
            shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            id: Math.random()
        };
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
        setPreviousCard(null);
        setCurrentCard(generateCard());

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

    // Watch for gameover state to save score
    useEffect(() => {
        if (gameState === 'gameover') {
            addGameSession('speed-match', score, ['speed', 'attention']);
        }
    }, [gameState]);

    const handleAnswer = (isMatch) => {
        if (gameState !== 'playing') return;

        if (!previousCard) {
            soundManager.playClick();
            nextTurn();
            return;
        }

        const isActuallyMatch =
            currentCard.shape === previousCard.shape &&
            currentCard.color === previousCard.color;

        if (isMatch === isActuallyMatch) {
            soundManager.playSuccess();
            setScore(s => s + 10);
            setFeedback('correct');
        } else {
            soundManager.playFailure();
            setScore(s => Math.max(0, s - 5));
            setFeedback('wrong');
        }

        setTimeout(() => setFeedback(null), 200);
        nextTurn();
    };

    const nextTurn = () => {
        setPreviousCard(currentCard);

        if (Math.random() < 0.3 && currentCard) {
            setCurrentCard({ ...currentCard, id: Math.random() });
        } else {
            setCurrentCard(generateCard());
        }
    };

    useEffect(() => {
        return () => clearInterval(timerRef.current);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-4 relative">
            <GameInstructions
                title="Speed Match"
                isOpen={showInstructions}
                onStart={startGame}
                instructions={[
                    "Cards will appear one by one.",
                    "Decide if the CURRENT card matches the PREVIOUS card.",
                    "Match means same SHAPE and same COLOR.",
                    "Be fast! You have 60 seconds to get the highest score."
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

            <div className="relative w-full max-w-[300px] aspect-[3/4] mb-8">
                <AnimatePresence mode='wait'>
                    {(gameState === 'playing' || gameState === 'paused') && currentCard && (
                        <motion.div
                            key={currentCard.id}
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: -20 }}
                            transition={{ duration: 0.15 }}
                            className={`
                absolute inset-0 bg-slate-800 rounded-2xl border-2 border-slate-700 
                flex flex-col items-center justify-center shadow-2xl
                ${feedback === 'correct' ? 'border-green-500' : ''}
                ${feedback === 'wrong' ? 'border-red-500' : ''}
              `}
                        >
                            <div className={`text-6xl mb-4 ${currentCard.color}`}>
                                {currentCard.shape === 'Square' && '■'}
                                {currentCard.shape === 'Circle' && '●'}
                                {currentCard.shape === 'Triangle' && '▲'}
                                {currentCard.shape === 'Star' && '★'}
                                {currentCard.shape === 'Diamond' && '◆'}
                            </div>
                            <div className="text-2xl font-bold text-slate-300">{currentCard.shape}</div>
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
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 rounded-2xl border border-slate-800">
                        <p className="text-slate-400 text-center px-6">
                            Does the card match the <strong>previous</strong> one?
                        </p>
                    </div>
                )}
            </div>

            {gameState === 'playing' && (
                <div className="flex gap-4 w-full max-w-[400px]">
                    <button
                        onClick={() => handleAnswer(false)}
                        className="flex-1 py-6 bg-slate-800 hover:bg-red-500/20 border border-slate-700 hover:border-red-500 rounded-xl transition flex flex-col items-center group"
                    >
                        <X className="w-8 h-8 text-red-500 mb-2 group-hover:scale-110 transition" />
                        <span className="font-bold text-slate-300">NO</span>
                    </button>
                    <button
                        onClick={() => handleAnswer(true)}
                        className="flex-1 py-6 bg-slate-800 hover:bg-green-500/20 border border-slate-700 hover:border-green-500 rounded-xl transition flex flex-col items-center group"
                    >
                        <Check className="w-8 h-8 text-green-500 mb-2 group-hover:scale-110 transition" />
                        <span className="font-bold text-slate-300">YES</span>
                    </button>
                </div>
            )}

            {gameState === 'start' && (
                <button
                    onClick={handleStartClick}
                    className="flex items-center px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-full text-xl font-bold transition shadow-lg hover:shadow-purple-500/25"
                >
                    <Play className="mr-2" /> Start Game
                </button>
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
    );
};

export default SpeedMatch;
