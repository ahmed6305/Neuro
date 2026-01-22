import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SpeedMatch from '../components/games/SpeedMatch';

const GameSpeed = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <Link to="/play" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Games
                </Link>
                <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                    Speed Match
                </h1>
                <SpeedMatch />
            </div>
        </div>
    );
};

export default GameSpeed;
