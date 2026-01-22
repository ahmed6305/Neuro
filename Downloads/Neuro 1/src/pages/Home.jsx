import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Zap, BookOpen } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
            <header className="flex justify-between items-center mb-16 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    MindShift
                </h1>
                <nav className="space-x-8 text-sm font-medium">
                    <Link to="/dashboard" className="hover:text-green-400 transition">DASHBOARD</Link>
                    <Link to="/play" className="hover:text-blue-400 transition">PLAY</Link>
                    <Link to="/learn" className="hover:text-purple-400 transition">LEARN</Link>
                </nav>
            </header>

            <main className="max-w-4xl mx-auto text-center">
                <div className="mb-16">
                    <h2 className="text-6xl font-extrabold mb-6 tracking-tight">
                        Reclaim Your <span className="text-blue-500">Focus</span>
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Stop scrolling, start growing. Replace your social media habit with productive micro-games and bite-sized learning.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        <Link to="/play" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-full text-lg font-bold transition shadow-lg hover:shadow-blue-500/25">
                            Start Training
                        </Link>
                        <Link to="/learn" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-full text-lg font-bold transition">
                            Explore Feed
                        </Link>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 text-left">
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition group backdrop-blur-sm">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition">
                            <Brain className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Memory Matrix</h3>
                        <p className="text-slate-400 text-sm">Train your pattern recall in under 2 minutes. Perfect for quick breaks.</p>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition group backdrop-blur-sm">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition">
                            <Zap className="w-6 h-6 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Speed Match</h3>
                        <p className="text-slate-400 text-sm">Boost your processing speed and reaction time with rapid-fire challenges.</p>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-green-500/50 transition group backdrop-blur-sm">
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition">
                            <BookOpen className="w-6 h-6 text-green-500" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Knowledge Feed</h3>
                        <p className="text-slate-400 text-sm">Learn something new instead of doomscrolling. Curated facts and tips.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
