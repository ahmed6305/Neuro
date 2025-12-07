// Badge definitions for warm-up achievements
export interface Badge {
    id: string
    name: string
    description: string
    emoji: string
    category: 'streak' | 'volume' | 'special'
    requirement: (userStats: UserStats) => boolean
    unlocked?: boolean
}

export interface UserStats {
    totalSessions: number
    currentStreak: number
    longestStreak: number
    morningSessionsCount: number // sessions before 12pm
    totalMinutes: number
}

export const BADGES: Badge[] = [
    {
        id: 'first_warmup',
        name: 'Getting Started',
        description: 'Complete your first warm-up',
        emoji: '🎯',
        category: 'special',
        requirement: (stats) => stats.totalSessions >= 1
    },
    {
        id: 'early_bird',
        name: 'Early Bird',
        description: '7 morning warm-ups (before noon)',
        emoji: '🌅',
        category: 'special',
        requirement: (stats) => stats.morningSessionsCount >= 7
    },
    {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Complete a 5-minute session',
        emoji: '⚡',
        category: 'special',
        requirement: (stats) => stats.totalSessions >= 1 // Will track 5min sessions separately
    },
    {
        id: 'week_warrior',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        emoji: '🔥',
        category: 'streak',
        requirement: (stats) => stats.currentStreak >= 7
    },
    {
        id: 'consistency_king',
        name: 'Consistency King',
        description: 'Maintain a 30-day streak',
        emoji: '👑',
        category: 'streak',
        requirement: (stats) => stats.currentStreak >= 30
    },
    {
        id: 'century_club',
        name: 'Century Club',
        description: 'Complete 100 warm-up sessions',
        emoji: '💯',
        category: 'volume',
        requirement: (stats) => stats.totalSessions >= 100
    },
    {
        id: 'brain_gym_regular',
        name: 'Brain Gym Regular',
        description: 'Spend 500 minutes warming up',
        emoji: '🧠',
        category: 'volume',
        requirement: (stats) => stats.totalMinutes >= 500
    },
    {
        id: 'dedication',
        name: 'Ultimate Dedication',
        description: 'Reach a 100-day streak',
        emoji: '🏆',
        category: 'streak',
        requirement: (stats) => stats.longestStreak >= 100
    }
]

// Get user stats from localStorage
export function getUserStats(): UserStats {
    if (typeof window === 'undefined') {
        return {
            totalSessions: 0,
            currentStreak: 0,
            longestStreak: 0,
            morningSessionsCount: 0,
            totalMinutes: 0
        }
    }

    // Import these from sessionTracking in actual implementation
    const sessions = JSON.parse(localStorage.getItem('neuro_sessions') || '[]')
    const streak = JSON.parse(localStorage.getItem('neuro_streak') || '{"current":0,"longest":0}')

    const morningSessions = sessions.filter((s: any) => {
        const hour = new Date(s.date).getHours()
        return hour < 12
    })

    const totalMinutes = sessions.reduce((sum: number, s: any) => sum + (s.duration || 0), 0) / 60

    return {
        totalSessions: sessions.length,
        currentStreak: streak.current,
        longestStreak: streak.longest,
        morningSessionsCount: morningSessions.length,
        totalMinutes: Math.round(totalMinutes)
    }
}

// Check which badges user has earned
export function checkBadges(): Badge[] {
    const stats = getUserStats()
    return BADGES.map(badge => ({
        ...badge,
        unlocked: badge.requirement(stats)
    }))
}

// Get newly unlocked badges (for notifications)
export function getNewlyUnlockedBadges(): Badge[] {
    if (typeof window === 'undefined') return []

    const unlockedBadgeIds = JSON.parse(localStorage.getItem('neuro_unlocked_badges') || '[]') as string[]
    const currentBadges = checkBadges()

    const newBadges = currentBadges.filter(badge =>
        badge.unlocked && !unlockedBadgeIds.includes(badge.id)
    )

    // Update storage
    if (newBadges.length > 0) {
        const updatedIds = [...unlockedBadgeIds, ...newBadges.map(b => b.id)]
        localStorage.setItem('neuro_unlocked_badges', JSON.stringify(updatedIds))
    }

    return newBadges
}
