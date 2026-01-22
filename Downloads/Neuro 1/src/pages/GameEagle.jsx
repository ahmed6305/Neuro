import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import EagleEye from '../components/games/EagleEye';

const GameEagle = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <Link to="/play" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Games
                </Link>
                <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
                    Eagle Eye
                </h1>
                <EagleEye />
            </div>
        </div>
    );
};

export default GameEagle;
