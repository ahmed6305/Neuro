import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Zap, Target, TrendingUp, Award, Clock } from 'lucide-react';
import { useGameContext } from '../context/GameContext';
import { games } from '../utils/designSystem';

const Home = () => {
    const { state } = useGameContext();

    // Get progress for a game
    const getGameProgress = (gameId) => {
        const profile = state?.profiles?.[state?.currentProfile];
        if (!profile) return { level: 1, bestScore: 0 };

        const gameData = profile.games?.[gameId];
        return {
            level: gameData?.currentLevel || 1,
            bestScore: gameData?.bestScore || 0,
        };
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent pointer-events-none" />

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 tracking-tight">
                            Train your brain,{' '}
                            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                5 minutes a day
                            </span>
                        </h1>
                        <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                            Build memory, focus, and mental agility through science-backed cognitive games.
                            No ads, no distractions—just pure brain training.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/play"
                                className="group px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full text-lg font-bold transition shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                            >
                                <Zap className="w-5 h-5" />
                                Start Training
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                            <Link
                                to="/dashboard"
                                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-full text-lg font-bold transition flex items-center justify-center gap-2"
                            >
                                <TrendingUp className="w-5 h-5" />
                                View Progress
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                            <Target className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Focused Training</h3>
                        <p className="text-slate-400 text-sm">
                            Each game targets specific cognitive skills. Track your progress across memory, speed, and focus.
                        </p>
                    </div>

                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                            <Clock className="w-6 h-6 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Quick Sessions</h3>
                        <p className="text-slate-400 text-sm">
                            Perfect for breaks. Each game takes 2-5 minutes. Build the habit without the time commitment.
                        </p>
                    </div>

                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
                            <Award className="w-6 h-6 text-green-500" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Level Up</h3>
                        <p className="text-slate-400 text-sm">
                            10 levels per game. Difficulty adapts as you improve. See measurable progress every session.
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Games */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-3">Choose Your Challenge</h2>
                    <p className="text-slate-400">7 games, each targeting different cognitive skills</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(games).map(([gameId, game]) => {
                        const progress = getGameProgress(gameId);

                        return (
                            <Link
                                key={gameId}
                                to={`/play/${gameId}`}
                                className="group bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition hover:shadow-lg hover:shadow-blue-500/5"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="text-3xl">{game.icon}</div>
                                    <div className="text-right">
                                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Level</div>
                                        <div className="text-lg font-bold text-blue-400">{progress.level}/10</div>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-1 group-hover:text-blue-400 transition">
                                    {game.name}
                                </h3>
                                <p className="text-sm text-slate-500 mb-3">{game.skill}</p>
                                <p className="text-sm text-slate-400 mb-4">{game.description}</p>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500">
                                        Best: {progress.bestScore}
                                    </span>
                                    <span className="text-sm font-semibold text-blue-500 group-hover:translate-x-1 transition-transform">
                                        Play →
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default Home;

