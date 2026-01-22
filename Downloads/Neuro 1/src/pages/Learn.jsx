import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import KnowledgeFeed from '../components/feed/KnowledgeFeed';

const Learn = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>

                <div className="flex flex-col items-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                        Knowledge Feed
                    </h1>
                    <p className="text-slate-400 text-center max-w-lg">
                        Feed your brain with facts, not distractions. Scroll through curated insights to boost your productivity and knowledge.
                    </p>
                </div>

                <KnowledgeFeed />
            </div>
        </div>
    );
};

export default Learn;
