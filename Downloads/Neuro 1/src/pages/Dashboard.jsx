import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Flame, Target, Settings as SettingsIcon, Activity } from 'lucide-react';
import BrainChart from '../components/dashboard/BrainChart';
import DailyWorkout from '../components/dashboard/DailyWorkout';
import { useGameContext } from '../context/GameContext';

const Dashboard = () => {
    const { state } = useGameContext();
    const { stats, skills, gameHistory } = state;

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>

                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <div className="flex items-center gap-4">
                        <Link to="/settings" className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition">
                            <SettingsIcon className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
                            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-sm font-bold text-slate-300">Online</span>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
                        <div className="p-3 bg-yellow-500/10 rounded-xl">
                            <Trophy className="w-8 h-8 text-yellow-500" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Total Score</p>
                            <p className="text-2xl font-bold">{stats.totalScore.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
                        <div className="p-3 bg-orange-500/10 rounded-xl">
                            <Flame className="w-8 h-8 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Day Streak</p>
                            <p className="text-2xl font-bold">{stats.currentStreak} Days</p>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <Target className="w-8 h-8 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Games Played</p>
                            <p className="text-2xl font-bold">{stats.gamesPlayed}</p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-8">
                        <div className="relative">
                            <BrainChart skills={skills} />
                            <div className="absolute top-0 right-0">
                                <Link to="/stats" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800 backdrop-blur-sm transition">
                                    <Activity className="w-3 h-3 mr-1" /> Detailed Stats
                                </Link>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                            <h3 className="font-bold text-xl mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                {gameHistory.length === 0 ? (
                                    <p className="text-slate-500 text-center py-4">No games played yet. Start training!</p>
                                ) : (
                                    gameHistory.slice(0, 5).map((game) => (
                                        <div key={game.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${game.gameId.includes('memory') ? 'bg-blue-500' :
                                                    game.gameId.includes('speed') ? 'bg-purple-500' :
                                                        game.gameId.includes('math') ? 'bg-green-500' :
                                                            game.gameId.includes('chaos') ? 'bg-red-500' :
                                                                'bg-yellow-500'
                                                    }`}></div>
                                                <span className="capitalize">{game.gameId.replace('-', ' ')}</span>
                                            </div>
                                            <span className="font-mono text-green-400">+{game.score} pts</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <DailyWorkout />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
