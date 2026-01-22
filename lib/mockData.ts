// Mock data used by the app. Change values here to update UI content.

export type Game = {
  id: string
  name: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  tags: string[]
  description: string
}

export const games: Game[] = [
  {
    id: 'speed-swipe-match',
    name: 'Speed Swipe Match',
    difficulty: 'Medium',
    tags: ['Reflex', 'Speed', 'Memory'],
    description: 'Fast swipe + match reflex memory. React quickly to find matching pairs before time runs out.'
  },
  {
    id: 'emoji-memory-battle',
    name: 'Emoji Memory Battle',
    difficulty: 'Easy',
    tags: ['Memory', 'Pattern', 'Visual'],
    description: 'Recall emoji positions and win the battle. Perfect for warming up your visual memory.'
  },
  {
    id: 'aesthetic-puzzle-drops',
    name: 'Aesthetic Puzzle Drops',
    difficulty: 'Hard',
    tags: ['Logic', 'Puzzle', 'Speed'],
    description: 'Falling tile logic game. Match and clear tiles in this addictive drop puzzle.'
  },
  {
    id: 'sound-memory-beat',
    name: 'Sound Memory Beat',
    difficulty: 'Medium',
    tags: ['Memory', 'Audio', 'Rhythm'],
    description: 'Repeat beat patterns from memory. Train your auditory recall and rhythm recognition.'
  },
  {
    id: 'meme-logic-challenge',
    name: 'Meme Logic Challenge',
    difficulty: 'Hard',
    tags: ['Logic', 'Reasoning', 'Fun'],
    description: 'Meme-based logic puzzles. Solve humorous logic problems to advance through levels.'
  },
  {
    id: 'flash-visual-bomb',
    name: 'Flash Visual Bomb',
    difficulty: 'Hard',
    tags: ['Speed', 'Visual', 'Focus'],
    description: 'Quick flash visual details. Remember what you saw in milliseconds and answer correctly.'
  },
  {
    id: 'chaos-room-challenge',
    name: 'Chaos Room Challenge',
    difficulty: 'Medium',
    tags: ['Memory', 'Observation', 'Focus'],
    description: 'Remember changing objects. Spot what changed in the room before time expires.'
  },
  {
    id: 'story-split-challenge',
    name: 'Story Split Challenge',
    difficulty: 'Easy',
    tags: ['Logic', 'Sequencing', 'Reasoning'],
    description: 'Reorder story fragments to complete the narrative. Improve logic and sequencing skills.'
  },
  {
    id: 'color-switch-reflex',
    name: 'Color Switch Reflex',
    difficulty: 'Medium',
    tags: ['Reflex', 'Speed', 'Focus'],
    description: 'Fast reflex color rule game. React instantly as color rules change — keep up with the speed!'
  },
  {
    id: 'category-sprint',
    name: 'Category Sprint',
    difficulty: 'Hard',
    tags: ['Vocabulary', 'Speed', 'Thinking'],
    description: 'Type as many valid words as possible in the given category before time runs out.'
  }
]

export const mockUser = {
  username: 'NeuroPlayer01',
  streakDays: 7,
  totalGames: 42,
  progress: {
    Memory: '+12%',
    Focus: '+8%',
    Logic: '+5%'
  }
}
