import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();


export const useGameContext = () => {
    return useContext(GameContext);
};

export const GameProvider = ({ children }) => {
    // Initial State for a new profile
    const createInitialProfile = (name) => ({
        id: Date.now().toString(),
        name: name,
        joinDate: new Date().toISOString(),
        stats: {
            totalScore: 0,
            gamesPlayed: 0,
            currentStreak: 0,
            lastLoginDate: null,
        },
        skills: {
            memory: 20,
            speed: 20,
            attention: 20,
            math: 20,
            visual: 20,
        },
        gameHistory: [],
        achievements: [], // Array of achievement IDs
        settings: {
            soundEnabled: true,
        }
    });

    // Global State Structure
    // {
    //    activeProfileId: '...',
    //    profiles: { 'id': { ...profileData } },
    //    leaderboards: { 'gameId': [ { name, score, date } ] }
    // }

    const [state, setState] = useState(() => {
        const savedState = localStorage.getItem('neuro1_state_v2');
        if (savedState) {
            return JSON.parse(savedState);
        }

        // Migration from v1 to v2 or fresh start
        const oldState = localStorage.getItem('neuro1_state');
        if (oldState) {
            const parsedOld = JSON.parse(oldState);
            const defaultProfileId = 'default';
            return {
                activeProfileId: defaultProfileId,
                profiles: {
                    [defaultProfileId]: {
                        ...parsedOld,
                        id: defaultProfileId,
                        achievements: [],
                        settings: { soundEnabled: true }
                    }
                },
                leaderboards: {}
            };
        }

        // Fresh start
        const initialProfile = createInitialProfile('Neuro Explorer');
        return {
            activeProfileId: initialProfile.id,
            profiles: {
                [initialProfile.id]: initialProfile
            },
            leaderboards: {}
        };
    });

    // Save to localStorage whenever state changes
    useEffect(() => {
        localStorage.setItem('neuro1_state_v2', JSON.stringify(state));
    }, [state]);

    // Helper to get active profile
    const activeProfile = state.profiles[state.activeProfileId];

    // Check for streak update on mount (for active profile)
    useEffect(() => {
        if (!activeProfile) return;

        const today = new Date().toDateString();
        const lastLogin = activeProfile.stats.lastLoginDate ? new Date(activeProfile.stats.lastLoginDate).toDateString() : null;

        if (lastLogin !== today) {
            let newStreak = activeProfile.stats.currentStreak;
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastLogin === yesterday.toDateString()) {
                newStreak += 1;
            } else if (lastLogin && lastLogin !== today) {
                newStreak = 1;
            } else if (!lastLogin) {
                newStreak = 1;
            }

            updateProfile(state.activeProfileId, {
                stats: {
                    ...activeProfile.stats,
                    currentStreak: newStreak,
                    lastLoginDate: new Date().toISOString()
                }
            });
        }
    }, [state.activeProfileId]); // Run when active profile changes

    const updateProfile = (profileId, updates) => {
        setState(prev => ({
            ...prev,
            profiles: {
                ...prev.profiles,
                [profileId]: {
                    ...prev.profiles[profileId],
                    ...updates
                }
            }
        }));
    };

    // Achievements Definition
    const ACHIEVEMENTS = [
        { id: 'first_steps', title: 'First Steps', description: 'Play your first game', icon: '🌱' },
        { id: 'high_scorer', title: 'High Scorer', description: 'Score over 1000 points in a single game', icon: '🏆' },
        { id: 'dedicated', title: 'Dedicated', description: 'Play 10 games total', icon: '⭐' },
        { id: 'addicted', title: 'Brainiac', description: 'Play 50 games total', icon: '🧠' },
        { id: 'memory_master', title: 'Memory Master', description: 'Score > 1000 in Memory Matrix', icon: '🧩' },
        { id: 'speed_demon', title: 'Speed Demon', description: 'Score > 500 in Speed Match', icon: '⚡' },
        { id: 'math_whiz', title: 'Math Whiz', description: 'Score > 500 in Quantum Math', icon: '➗' },
        { id: 'eagle_eye', title: 'Eagle Eye', description: 'Score > 1000 in Eagle Eye', icon: '🦅' },
        { id: 'pattern_pro', title: 'Pattern Pro', description: 'Score > 500 in Pattern Path', icon: '🗺️' },
        { id: 'word_wizard', title: 'Word Wizard', description: 'Score > 500 in Word Scramble', icon: '📝' },
    ];

    const checkAchievements = (profile, gameId, score) => {
        const newAchievements = [];
        const currentIds = profile.achievements || [];

        // Helper to add if not exists
        const unlock = (id) => {
            if (!currentIds.includes(id)) {
                newAchievements.push(id);
            }
        };

        // Checks
        if (profile.stats.gamesPlayed + 1 >= 1) unlock('first_steps');
        if (score >= 1000) unlock('high_scorer');
        if (profile.stats.gamesPlayed + 1 >= 10) unlock('dedicated');
        if (profile.stats.gamesPlayed + 1 >= 50) unlock('addicted');

        if (gameId === 'memory-matrix' && score > 1000) unlock('memory_master');
        if (gameId === 'speed-match' && score > 500) unlock('speed_demon');
        if (gameId === 'quantum-math' && score > 500) unlock('math_whiz');
        if (gameId === 'eagle-eye' && score > 1000) unlock('eagle_eye');
        if (gameId === 'pattern-path' && score > 500) unlock('pattern_pro');
        if (gameId === 'word-scramble' && score > 500) unlock('word_wizard');

        return newAchievements;
    };

    const addGameSession = (gameId, score, skillTags) => {
        setState(prev => {
            const profile = prev.profiles[prev.activeProfileId];

            // Update Skills
            const newSkills = { ...profile.skills };
            skillTags.forEach(tag => {
                if (newSkills[tag] < 100) {
                    newSkills[tag] = Math.min(100, newSkills[tag] + 2);
                }
            });

            // Update Stats
            const newStats = {
                ...profile.stats,
                totalScore: profile.stats.totalScore + score,
                gamesPlayed: profile.stats.gamesPlayed + 1,
            };

            // Update History
            const newHistory = [
                {
                    id: Date.now(),
                    gameId,
                    score,
                    date: new Date().toISOString(),
                    skillTags
                },
                ...profile.gameHistory
            ].slice(0, 50);

            // Check Achievements
            const unlocked = checkAchievements(profile, gameId, score);
            const updatedAchievements = [...(profile.achievements || []), ...unlocked];

            // Update Leaderboard
            const currentLeaderboard = prev.leaderboards[gameId] || [];
            const newLeaderboardEntry = { name: profile.userProfile?.name || profile.name || 'Unknown', score, date: new Date().toISOString() };
            const updatedLeaderboard = [...currentLeaderboard, newLeaderboardEntry]
                .sort((a, b) => b.score - a.score)
                .slice(0, 5); // Keep top 5

            return {
                ...prev,
                profiles: {
                    ...prev.profiles,
                    [prev.activeProfileId]: {
                        ...profile,
                        stats: newStats,
                        skills: newSkills,
                        gameHistory: newHistory,
                        achievements: updatedAchievements
                    }
                },
                leaderboards: {
                    ...prev.leaderboards,
                    [gameId]: updatedLeaderboard
                }
            };
        });
    };

    const resetProgress = () => {
        if (window.confirm("Are you sure you want to reset all progress for this profile? This cannot be undone.")) {
            const initial = createInitialProfile(activeProfile.name);
            // Keep the ID same
            initial.id = activeProfile.id;

            setState(prev => ({
                ...prev,
                profiles: {
                    ...prev.profiles,
                    [prev.activeProfileId]: initial
                }
            }));
        }
    };

    const createProfile = (name) => {
        const newProfile = createInitialProfile(name);
        setState(prev => ({
            ...prev,
            profiles: {
                ...prev.profiles,
                [newProfile.id]: newProfile
            },
            activeProfileId: newProfile.id
        }));
    };

    const switchProfile = (profileId) => {
        if (state.profiles[profileId]) {
            setState(prev => ({
                ...prev,
                activeProfileId: profileId
            }));
        }
    };

    const updateSettings = (newSettings) => {
        updateProfile(state.activeProfileId, {
            settings: {
                ...activeProfile.settings,
                ...newSettings
            }
        });
    };

    const contextValue = {
        state: activeProfile,
        globalState: state,
        ACHIEVEMENTS,
        addGameSession,
        resetProgress,
        createProfile,
        switchProfile,
        updateSettings
    };

    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    );
};
