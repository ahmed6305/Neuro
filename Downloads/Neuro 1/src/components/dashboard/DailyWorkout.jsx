import React from 'react';
import { Link } from 'react-router-dom';
import { Play, CheckCircle, Lock } from 'lucide-react';

const DailyWorkout = () => {
    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-white">Daily Mind Workout</h3>
                    <p className="text-slate-400 text-sm">Complete 3 games to keep your streak!</p>
                </div>
                <div className="text-center bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                    <p className="text-xs text-slate-500 uppercase font-bold">Streak</p>
                    <p className="text-xl font-bold text-orange-500">🔥 3</p>
                </div>
            </div>

            <div className="space-y-4">
                <Link to="/play/memory" className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-blue-500 transition group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold">1</div>
                        <div>
                            <p className="font-bold group-hover:text-blue-400 transition">Memory Matrix</p>
                            <p className="text-xs text-slate-500">Focus & Recall</p>
                        </div>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                </Link>

                <Link to="/play/chaos" className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-red-500 transition group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 font-bold">2</div>
                        <div>
                            <p className="font-bold group-hover:text-red-400 transition">Color Chaos</p>
                            <p className="text-xs text-slate-500">Impulse Control</p>
                        </div>
                    </div>
                    <Play className="w-6 h-6 text-slate-600 group-hover:text-white transition" />
                </Link>

                <div className="flex items-center justify-between p-4 bg-slate-950/30 rounded-xl border border-slate-800 opacity-75">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 font-bold">3</div>
                        <div>
                            <p className="font-bold text-slate-500">Quantum Math</p>
                            <p className="text-xs text-slate-600">Unlock by completing previous</p>
                        </div>
                    </div>
                    <Lock className="w-5 h-5 text-slate-600" />
                </div>
            </div>

            <div className="mt-6 text-center">
                <p className="text-xs text-slate-500">Resets in 14h 32m</p>
            </div>
        </div>
    );
};

export default DailyWorkout;
