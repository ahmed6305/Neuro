export type Difficulty = "Easy" | "Medium" | "Hard" | "Critical"

export const difficultyOrder: Difficulty[] = ["Easy", "Medium", "Hard", "Critical"]

export interface DifficultyConfig {
  timePerRound: number
  lives: number
  minScore: number
  speedMultiplier: number
}

export const difficultyConfigs: Record<Difficulty, DifficultyConfig> = {
  Easy: {
    timePerRound: 2,
    lives: 5,
    minScore: 0,
    speedMultiplier: 1
  },
  Medium: {
    timePerRound: 1.5,
    lives: 4,
    minScore: 50,
    speedMultiplier: 1.3
  },
  Hard: {
    timePerRound: 1.2,
    lives: 3,
    minScore: 100,
    speedMultiplier: 1.6
  },
  Critical: {
    timePerRound: 0.9,
    lives: 2,
    minScore: 200,
    speedMultiplier: 2
  }
}

export function getNextDifficulty(current: Difficulty): Difficulty | null {
  const index = difficultyOrder.indexOf(current)
  return index < difficultyOrder.length - 1 ? difficultyOrder[index + 1] : null
}
