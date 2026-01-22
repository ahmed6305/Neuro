import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Plus, Volume2, VolumeX, Trash2, Settings as SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGameContext } from '../context/GameContext';
import soundManager from '../utils/SoundManager';

const Settings = () => {
    const { state, globalState, createProfile, switchProfile, updateSettings, resetProgress } = useGameContext();
    const [newProfileName, setNewProfileName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateProfile = (e) => {
        e.preventDefault();
        if (newProfileName.trim()) {
            createProfile(newProfileName.trim());
            setNewProfileName('');
            setIsCreating(false);
            soundManager.playSuccess();
        }
    };

    const handleToggleSound = () => {
        const newEnabled = !state.settings.soundEnabled;
        updateSettings({ soundEnabled: newEnabled });
        soundManager.setEnabled(newEnabled);
        if (newEnabled) soundManager.playClick();
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 pb-20">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center mb-8">
                    <Link to="/dashboard" className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition mr-4">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-3xl font-bold">Settings</h1>
                </div>

                <div className="space-y-8">
                    {/* Profile Management */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-500/10 rounded-xl">
                                <User className="w-6 h-6 text-blue-500" />
                            </div>
                            <h2 className="text-xl font-bold">Profiles</h2>
                        </div>

                        <div className="space-y-4">
                            {Object.values(globalState.profiles).map(profile => (
                                <div
                                    key={profile.id}
                                    onClick={() => switchProfile(profile.id)}
                                    className={`
                                        flex items-center justify-between p-4 rounded-xl border cursor-pointer transition
                                        ${state.id === profile.id
                                            ? 'bg-blue-600/20 border-blue-500'
                                            : 'bg-slate-800/50 border-slate-800 hover:bg-slate-800'}
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`
                                            w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                                            ${state.id === profile.id ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'}
                                        `}>
                                            {profile.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className={`font-bold ${state.id === profile.id ? 'text-blue-400' : 'text-white'}`}>
                                                {profile.name}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Level {Math.floor(profile.stats.totalScore / 1000) + 1} • {profile.stats.gamesPlayed} Games
                                            </p>
                                        </div>
                                    </div>
                                    {state.id === profile.id && (
                                        <span className="text-xs font-bold bg-blue-500 text-white px-2 py-1 rounded-full">
                                            Active
                                        </span>
                                    )}
                                </div>
                            ))}

                            {isCreating ? (
                                <form onSubmit={handleCreateProfile} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newProfileName}
                                        onChange={(e) => setNewProfileName(e.target.value)}
                                        placeholder="Enter profile name..."
                                        className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500"
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold transition"
                                    >
                                        Create
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsCreating(false)}
                                        className="bg-slate-800 hover:bg-slate-700 text-slate-400 px-4 py-2 rounded-xl font-bold transition"
                                    >
                                        Cancel
                                    </button>
                                </form>
                            ) : (
                                <button
                                    onClick={() => setIsCreating(true)}
                                    className="w-full py-3 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 transition flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Create New Profile
                                </button>
                            )}
                        </div>
                    </motion.div>

                    {/* App Settings */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-purple-500/10 rounded-xl">
                                <SettingsIcon className="w-6 h-6 text-purple-500" />
                            </div>
                            <h2 className="text-xl font-bold">Preferences</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-800">
                                <div className="flex items-center gap-3">
                                    {state.settings.soundEnabled ? (
                                        <Volume2 className="w-5 h-5 text-slate-400" />
                                    ) : (
                                        <VolumeX className="w-5 h-5 text-slate-500" />
                                    )}
                                    <span>Sound Effects</span>
                                </div>
                                <button
                                    onClick={handleToggleSound}
                                    className={`
                                        w-12 h-6 rounded-full transition-colors relative
                                        ${state.settings.soundEnabled ? 'bg-green-500' : 'bg-slate-700'}
                                    `}
                                >
                                    <div className={`
                                        w-4 h-4 bg-white rounded-full absolute top-1 transition-transform
                                        ${state.settings.soundEnabled ? 'left-7' : 'left-1'}
                                    `} />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Danger Zone */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-900 p-6 rounded-2xl border border-red-900/30 shadow-xl"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-red-500/10 rounded-xl">
                                <Trash2 className="w-6 h-6 text-red-500" />
                            </div>
                            <h2 className="text-xl font-bold text-red-500">Danger Zone</h2>
                        </div>

                        <div className="p-4 bg-red-950/30 rounded-xl border border-red-900/50">
                            <p className="text-slate-300 mb-4 text-sm">
                                Resetting your progress will wipe all stats, history, and achievements for the current profile. This action cannot be undone.
                            </p>
                            <button
                                onClick={resetProgress}
                                className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition"
                            >
                                Reset Progress
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
