/**
 * NEURO Design System
 * Unified design tokens for consistent UX across the platform
 */

export const colors = {
    // Primary palette - Neon Blue
    primary: {
        DEFAULT: '#3B82F6', // blue-500
        light: '#60A5FA',   // blue-400
        dark: '#2563EB',    // blue-600
        glow: 'rgba(59, 130, 246, 0.5)',
    },

    // Secondary palette - Neon Purple
    secondary: {
        DEFAULT: '#A855F7', // purple-500
        light: '#C084FC',   // purple-400
        dark: '#9333EA',    // purple-600
        glow: 'rgba(168, 85, 247, 0.5)',
    },

    // Feedback colors
    success: '#10B981',  // green-500
    error: '#EF4444',    // red-500
    warning: '#F59E0B',  // amber-500

    // Neutrals
    background: {
        primary: '#020617',   // slate-950
        secondary: '#0F172A', // slate-900
        tertiary: '#1E293B',  // slate-800
    },

    text: {
        primary: '#FFFFFF',
        secondary: '#94A3B8', // slate-400
        tertiary: '#64748B',  // slate-500
    },

    border: {
        DEFAULT: '#334155',   // slate-700
        light: '#475569',     // slate-600
    }
};

export const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
};

export const typography = {
    // Font sizes
    h1: '3.75rem',    // 60px
    h2: '3rem',       // 48px
    h3: '2.25rem',    // 36px
    h4: '1.875rem',   // 30px
    h5: '1.5rem',     // 24px
    h6: '1.25rem',    // 20px
    body: '1rem',     // 16px
    small: '0.875rem', // 14px
    tiny: '0.75rem',  // 12px

    // Font weights
    weight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
    },

    // Line heights
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    }
};

export const borderRadius = {
    sm: '0.5rem',   // 8px
    md: '0.75rem',  // 12px
    lg: '1rem',     // 16px
    xl: '1.5rem',   // 24px
    full: '9999px',
};

export const shadows = {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    glow: {
        primary: `0 0 20px ${colors.primary.glow}`,
        secondary: `0 0 20px ${colors.secondary.glow}`,
        success: 'rgba(16, 185, 129, 0.3)',
        error: 'rgba(239, 68, 68, 0.3)',
    }
};

export const transitions = {
    fast: '150ms ease-in-out',
    normal: '200ms ease-in-out',
    slow: '300ms ease-in-out',
};

// Game-specific constants
export const gameConfig = {
    maxLevel: 10,

    // Skill categories
    skills: {
        MEMORY: 'Memory',
        FOCUS: 'Focus',
        SPEED: 'Speed',
        LOGIC: 'Logic',
        VISUAL: 'Visual',
        VERBAL: 'Verbal',
    },

    // Difficulty settings
    difficulty: {
        EASY: 'Easy',
        MEDIUM: 'Medium',
        HARD: 'Hard',
    }
};

// Game metadata
export const games = {
    'memory-matrix': {
        name: 'Memory Matrix',
        skill: 'Memory & Visual Recall',
        description: 'Remember and recreate tile patterns',
        color: colors.primary.DEFAULT,
        icon: '🧠',
    },
    'speed-match': {
        name: 'Speed Match',
        skill: 'Processing Speed',
        description: 'Match cards at lightning speed',
        color: '#A855F7', // purple
        icon: '⚡',
    },
    'color-chaos': {
        name: 'Color Chaos',
        skill: 'Focus & Inhibition',
        description: 'Name the color, not the word',
        color: '#EF4444', // red
        icon: '🎨',
    },
    'quantum-math': {
        name: 'Quantum Math',
        skill: 'Logic & Speed',
        description: 'Solve equations before time runs out',
        color: '#10B981', // green
        icon: '🔢',
    },
    'eagle-eye': {
        name: 'Eagle Eye',
        skill: 'Visual Scanning',
        description: 'Find the unique item in the grid',
        color: '#F59E0B', // amber
        icon: '👁️',
    },
    'pattern-path': {
        name: 'Pattern Path',
        skill: 'Spatial Memory',
        description: 'Memorize and retrace the path',
        color: '#6366F1', // indigo
        icon: '🗺️',
    },
    'word-scramble': {
        name: 'Word Scramble',
        skill: 'Verbal Fluency',
        description: 'Unscramble words against the clock',
        color: '#EC4899', // pink
        icon: '📝',
    },
};
