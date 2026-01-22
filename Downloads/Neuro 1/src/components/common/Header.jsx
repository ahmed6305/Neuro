import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain } from 'lucide-react';

const Header = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition"
                    >
                        <Brain className="w-6 h-6 text-blue-500" />
                        NEURO
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center gap-1">
                        <Link
                            to="/dashboard"
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isActive('/dashboard')
                                    ? 'bg-blue-500/10 text-blue-400'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/play"
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isActive('/play')
                                    ? 'bg-purple-500/10 text-purple-400'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            Play
                        </Link>
                        <Link
                            to="/learn"
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isActive('/learn')
                                    ? 'bg-green-500/10 text-green-400'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            Learn
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
