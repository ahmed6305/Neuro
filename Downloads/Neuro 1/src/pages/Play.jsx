import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Play = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>
                <h1 className="text-4xl font-bold mb-8">Game Center</h1>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Link to="/play/memory-matrix" className="block bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500 transition group hover:shadow-lg hover:shadow-blue-500/10">
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition">Memory Matrix</h3>
                        <p className="text-slate-400">Test your pattern recall abilities. How many tiles can you remember?</p>
                        <div className="mt-4 text-blue-500 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                            Play Now &rarr;
                        </div>
                    </Link>

                    <Link to="/play/speed-match" className="block bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-purple-500 transition group hover:shadow-lg hover:shadow-purple-500/10">
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition">Speed Match</h3>
                        <p className="text-slate-400">Rapidly decide if the current card matches the previous one. Think fast!</p>
                        <div className="mt-4 text-purple-500 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                            Play Now &rarr;
                        </div>
                    </Link>

                    <Link to="/play/color-chaos" className="block bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-red-500 transition group hover:shadow-lg hover:shadow-red-500/10">
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-red-400 transition">Color Chaos</h3>
                        <p className="text-slate-400">Don't read the word! Select the color of the ink. Tricky and addictive.</p>
                        <div className="mt-4 text-red-500 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                            Play Now &rarr;
                        </div>
                    </Link>

                    <Link to="/play/quantum-math" className="block bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-green-500 transition group hover:shadow-lg hover:shadow-green-500/10">
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-green-400 transition">Quantum Math</h3>
                        <p className="text-slate-400">Solve falling math problems before they hit the ground. Type fast!</p>
                        <div className="mt-4 text-green-500 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                            Play Now &rarr;
                        </div>
                    </Link>

                    <Link to="/play/eagle-eye" className="block bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-yellow-500 transition group hover:shadow-lg hover:shadow-yellow-500/10">
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-yellow-400 transition">Eagle Eye</h3>
                        <p className="text-slate-400">Find the unique emoji hidden in the grid. Trains visual scanning.</p>
                        <div className="mt-4 text-yellow-500 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                            Play Now &rarr;
                        </div>
                    </Link>

                    <Link to="/play/pattern-path" className="block bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-indigo-500 transition group hover:shadow-lg hover:shadow-indigo-500/10">
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-indigo-400 transition">Pattern Path</h3>
                        <p className="text-slate-400">Memorize and retrace the path on the grid. Spatial reasoning challenge.</p>
                        <div className="mt-4 text-indigo-500 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                            Play Now &rarr;
                        </div>
                    </Link>

                    <Link to="/play/word-scramble" className="block bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-pink-500 transition group hover:shadow-lg hover:shadow-pink-500/10">
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-pink-400 transition">Word Scramble</h3>
                        <p className="text-slate-400">Unscramble the words against the clock. Test your verbal fluency.</p>
                        <div className="mt-4 text-pink-500 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                            Play Now &rarr;
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Play;
