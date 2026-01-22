import React from 'react';
import { motion } from 'framer-motion';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';
import { useGameContext } from '../context/GameContext';
import BrainChart from '../components/dashboard/BrainChart';
import Leaderboard from '../components/dashboard/Leaderboard';
import Achievements from '../components/dashboard/Achievements';
import { ArrowLeft, TrendingUp, Activity, PieChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Stats = () => {
    const { state } = useGameContext();
    const { gameHistory, skills } = state;

    // Process history for Line Chart (Score over time)
    const historyData = [...gameHistory].reverse().map((game, index) => ({
        name: index + 1,
        score: game.score,
        game: game.gameId,
        date: new Date(game.date).toLocaleDateString()
    }));

    // Process history for Bar Chart (Games Played Distribution)
    const gameCounts = gameHistory.reduce((acc, game) => {
        acc[game.gameId] = (acc[game.gameId] || 0) + 1;
        return acc;
    }, {});

    const distributionData = Object.keys(gameCounts).map(key => ({
        name: key.replace('-', ' ').toUpperCase(),
        count: gameCounts[key]
    }));

    const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#eab308', '#a855f7', '#ec4899', '#06b6d4'];

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 pb-20">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center mb-8">
                    <Link to="/dashboard" className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition mr-4">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-3xl font-bold">Detailed Statistics</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Skill Profile */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-purple-500/10 rounded-xl">
                                <Activity className="w-6 h-6 text-purple-500" />
                            </div>
                            <h2 className="text-xl font-bold">Skill Profile</h2>
                        </div>
                        <div className="h-[300px] flex items-center justify-center">
                            <BrainChart skills={skills} />
                        </div>
                    </motion.div>

                    {/* Performance History */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-500/10 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-blue-500" />
                            </div>
                            <h2 className="text-xl font-bold">Performance History</h2>
                        </div>
                        <div className="h-[300px]">
                            {historyData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={historyData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                        <XAxis dataKey="name" stroke="#64748b" />
                                        <YAxis stroke="#64748b" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-500">
                                    No game history yet. Play some games!
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Game Distribution */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl lg:col-span-2"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-green-500/10 rounded-xl">
                                <PieChart className="w-6 h-6 text-green-500" />
                            </div>
                            <h2 className="text-xl font-bold">Game Distribution</h2>
                        </div>
                        <div className="h-[300px]">
                            {distributionData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={distributionData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                        <XAxis dataKey="name" stroke="#64748b" />
                                        <YAxis stroke="#64748b" />
                                        <Tooltip
                                            cursor={{ fill: '#1e293b' }}
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                                        />
                                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                                            {distributionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-500">
                                    No games played yet.
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Leaderboard */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2"
                    >
                        <Leaderboard />
                    </motion.div>

                    {/* Achievements */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2"
                    >
                        <Achievements />
                    </motion.div>
                </div>
            </div >
        </div >
    );
};

export default Stats;
