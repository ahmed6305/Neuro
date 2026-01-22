import React from 'react';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Standardized Game Header Component
 * Consistent header for all games showing level, score, and navigation
 */
const GameHeader = ({
    gameName,
    level,
    maxLevel = 10,
    score,
    timer,
    showBackButton = true,
    backTo = '/play'
}) => {
    const navigate = useNavigate();

    return (
        <div className="sticky top-16 z-40 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
            <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Left: Back Button */}
                    <div className="flex items-center gap-4 min-w-[120px]">
                        {showBackButton && (
                            <button
                                onClick={() => navigate(backTo)}
                                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                                aria-label="Go back"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Center: Game Info */}
                    <div className="flex-1 text-center">
                        <div className="text-sm text-slate-500 mb-1">{gameName}</div>
                        <div className="flex items-center justify-center gap-2">
                            <Trophy className="w-4 h-4 text-blue-400" />
                            <span className="text-lg font-bold text-blue-400">
                                Level {level}/{maxLevel}
                            </span>
                        </div>
                    </div>

                    {/* Right: Score & Timer */}
                    <div className="flex items-center gap-4 min-w-[120px] justify-end">
                        {timer !== undefined && (
                            <div className="text-right">
                                <div className="text-xs text-slate-500 uppercase tracking-wider">Time</div>
                                <div className="text-lg font-bold text-purple-400">{timer}s</div>
                            </div>
                        )}
                        {score !== undefined && (
                            <div className="text-right">
                                <div className="text-xs text-slate-500 uppercase tracking-wider">Score</div>
                                <div className="text-lg font-bold text-green-400">{score}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameHeader;
