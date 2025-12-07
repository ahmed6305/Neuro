// Session tracking and streak management for Neuro warm-ups
export interface WarmupSession {
    id: string
    date: string // ISO string
    duration: number // in seconds
    gamesPlayed: string[] // game IDs
    completed: boolean
}

export interface StreakData {
    current: number
    longest: number
    lastActivity: string // ISO string
}

const STORAGE_KEY = 'neuro_sessions'
const STREAK_KEY = 'neuro_streak'

// Get all sessions from last 30 days
export function getSessions(): WarmupSession[] {
    if (typeof window === 'undefined') return []

    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []

    const sessions: WarmupSession[] = JSON.parse(data)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Filter to last 30 days
    return sessions.filter(s => new Date(s.date) > thirtyDaysAgo)
}

// Save a new session
export function saveSession(session: Omit<WarmupSession, 'id'>): void {
    if (typeof window === 'undefined') return

    const sessions = getSessions()
    const newSession: WarmupSession = {
        ...session,
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    sessions.push(newSession)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))

    updateStreak(session.date)
}

// Get streak data
export function getStreak(): StreakData {
    if (typeof window === 'undefined') return { current: 0, longest: 0, lastActivity: '' }

    const data = localStorage.getItem(STREAK_KEY)
    if (!data) return { current: 0, longest: 0, lastActivity: '' }

    return JSON.parse(data)
}

// Update streak based on new activity
function updateStreak(activityDate: string): void {
    const streak = getStreak()
    const today = new Date(activityDate).toDateString()
    const lastActivity = streak.lastActivity ? new Date(streak.lastActivity).toDateString() : ''

    if (!lastActivity) {
        // First session ever
        streak.current = 1
        streak.longest = 1
        streak.lastActivity = activityDate
    } else {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toDateString()

        if (today === lastActivity) {
            // Same day, no change
            return
        } else if (today === yesterdayStr || isSameDay(new Date(activityDate), addDays(new Date(lastActivity), 1))) {
            // Consecutive day
            streak.current += 1
            streak.longest = Math.max(streak.longest, streak.current)
            streak.lastActivity = activityDate
        } else {
            // Streak broken
            streak.current = 1
            streak.lastActivity = activityDate
        }
    }

    localStorage.setItem(STREAK_KEY, JSON.stringify(streak))
}

// Helper functions
function isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString()
}

function addDays(date: Date, days: number): Date {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
}

// Get weekly summary
export function getWeeklySummary() {
    const sessions = getSessions()
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const thisWeek = sessions.filter(s => new Date(s.date) > weekAgo)
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
    const lastWeek = sessions.filter(s => {
        const date = new Date(s.date)
        return date > twoWeeksAgo && date <= weekAgo
    })

    return {
        thisWeekCount: thisWeek.length,
        lastWeekCount: lastWeek.length,
        totalMinutes: Math.round(thisWeek.reduce((sum, s) => sum + s.duration, 0) / 60),
        streak: getStreak().current
    }
}

// Export sessions to CSV
export function exportToCSV(): string {
    const sessions = getSessions()
    const header = 'Date,Duration (min),Games Played,Completed\n'
    const rows = sessions.map(s =>
        `${new Date(s.date).toLocaleDateString()},${Math.round(s.duration / 60)},${s.gamesPlayed.length},${s.completed}`
    ).join('\n')

    return header + rows
}

export function downloadCSV(): void {
    const csv = exportToCSV()
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `neuro-sessions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
}
