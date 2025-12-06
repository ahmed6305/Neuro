"use client"
import React, { useState, useEffect, useRef } from 'react'
import { Difficulty, getNextDifficulty } from '../../lib/gameLevels'

type Category = {
  name: string
  difficulty: Difficulty
  examples: string[]
}

const categories: Category[] = [
  { name: 'Fruits', difficulty: 'Easy', examples: ['Apple', 'Banana', 'Orange'] },
  { name: 'Animals', difficulty: 'Easy', examples: ['Cat', 'Dog', 'Bird'] },
  { name: 'Colors', difficulty: 'Easy', examples: ['Red', 'Blue', 'Green'] },
  { name: 'Countries', difficulty: 'Medium', examples: ['France', 'Japan', 'Brazil'] },
  { name: 'Sports', difficulty: 'Medium', examples: ['Soccer', 'Tennis', 'Basketball'] },
  { name: 'Programming Languages', difficulty: 'Hard', examples: ['Python', 'JavaScript', 'Rust'] },
  { name: 'Planets', difficulty: 'Medium', examples: ['Mars', 'Venus', 'Jupiter'] },
  { name: 'Things That Fly', difficulty: 'Easy', examples: ['Plane', 'Bird', 'Balloon'] },
  { name: 'Emotions', difficulty: 'Medium', examples: ['Happy', 'Sad', 'Angry'] },
  { name: 'Musical Instruments', difficulty: 'Hard', examples: ['Guitar', 'Piano', 'Drums'] },
  { name: 'Vegetables', difficulty: 'Easy', examples: ['Carrot', 'Broccoli', 'Spinach'] },
  { name: 'Movies', difficulty: 'Hard', examples: ['Avatar', 'Inception', 'Titanic'] },
  { name: 'Cities', difficulty: 'Medium', examples: ['Paris', 'Tokyo', 'New York'] },
  { name: 'Books', difficulty: 'Hard', examples: ['1984', 'Pride and Prejudice', 'Dune'] },
  { name: 'Desserts', difficulty: 'Easy', examples: ['Cake', 'Ice Cream', 'Pie'] },
]

const timeLimits: Record<Difficulty, number> = {
  Easy: 20,
  Medium: 15,
  Hard: 10,
  Critical: 7
}

const roundCounts: Record<Difficulty, number> = {
  Easy: 3,
  Medium: 4,
  Hard: 5,
  Critical: 6
}

export default function CategorySprint() {
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy')
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [currentRound, setCurrentRound] = useState(0)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(timeLimits.Easy)
  const [input, setInput] = useState('')
  const [submittedWords, setSubmittedWords] = useState<Set<string>>(new Set())
  const [message, setMessage] = useState('')
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const roundCount = roundCounts[difficulty]
  const timeLimit = timeLimits[difficulty]

  useEffect(() => {
    if (!gameStarted || gameOver) return

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 0.1) {
          finishRound()
          return timeLimit
        }
        return t - 0.1
      })
    }, 100)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [gameStarted, gameOver, timeLimit])

  const selectRandomCategory = () => {
    const validCategories = categories.filter(c => c.difficulty === difficulty)
    return validCategories[Math.floor(Math.random() * validCategories.length)]
  }

  const startGame = (diff: Difficulty = 'Easy') => {
    setDifficulty(diff)
    setGameStarted(true)
    setGameOver(false)
    setCurrentRound(0)
    setScore(0)
    setTimeLeft(timeLimits[diff])
    setInput('')
    setSubmittedWords(new Set())
    setMessage('')
    const cat = selectRandomCategory()
    setCurrentCategory(cat)
  }

  const finishRound = () => {
    if (currentRound + 1 >= roundCount) {
      setGameOver(true)
    } else {
      const nextRound = currentRound + 1
      setCurrentRound(nextRound)
      const cat = selectRandomCategory()
      setCurrentCategory(cat)
      setTimeLeft(timeLimit)
      setInput('')
      setSubmittedWords(new Set())
      setMessage('')
    }
  }

  const handleSubmitWord = () => {
    const word = input.trim().toLowerCase()
    if (!word) {
      setMessage('Please type a word!')
      return
    }

    if (submittedWords.has(word)) {
      setMessage('Already submitted!')
      setInput('')
      return
    }

    setMessage(`✅ +${timeLeft > 10 ? 5 : timeLeft > 5 ? 3 : 1}`)
    setScore(s => s + (timeLeft > 10 ? 5 : timeLeft > 5 ? 3 : 1))
    setSubmittedWords(prev => new Set([...prev, word]))
    setInput('')

    setTimeout(() => setMessage(''), 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitWord()
    }
  }

  const handleNextDifficulty = () => {
    const next = getNextDifficulty(difficulty)
    if (next) startGame(next)
  }

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center gap-6 w-full text-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">🏃 Category Sprint</h2>
          <p className="text-gray-400 mb-4">Type as many words as you can in the given category before time runs out!</p>
          <div className="bg-indigo-900 bg-opacity-10 border border-indigo-500 border-opacity-30 rounded-lg p-4 text-left inline-block max-w-md">
            <p className="text-sm text-indigo-300 font-semibold mb-2">How to play:</p>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• See a category name and examples</li>
              <li>• Type valid words matching that category</li>
              <li>• Press Enter to submit each word</li>
              <li>• No duplicates or invalid words</li>
              <li>• Earn points based on remaining time</li>
              <li>• Easy: 20s/round × 3 • Critical: 7s/round × 6</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap justify-center">
          {(["Easy", "Medium", "Hard", "Critical"] as Difficulty[]).map(diff => (
            <button
              key={diff}
              onClick={() => startGame(diff)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold rounded-lg hover:from-indigo-700 hover:to-purple-800 transition-all"
            >
              Start: {diff}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (gameOver) {
    return (
      <div className="flex flex-col items-center gap-6 w-full text-center">
        <div>
          <h2 className="text-3xl font-bold text-green-400 mb-4">🏁 Round Complete!</h2>
          <div className="text-2xl font-bold text-indigo-300 mb-2">Score: {score}</div>
          <div className="text-gray-300">Difficulty: {difficulty} • Categories: {roundCount}</div>
        </div>

        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => startGame(difficulty)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold rounded-lg hover:from-indigo-700 hover:to-purple-800 transition-all"
          >
            Play Again ({difficulty})
          </button>
          {getNextDifficulty(difficulty) && (
            <button
              onClick={handleNextDifficulty}
              className="px-6 py-3 bg-gradient-to-r from-purple-700 to-pink-700 text-white font-bold rounded-lg hover:from-purple-800 hover:to-pink-800 transition-all"
            >
              Next Difficulty
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
        <div className="bg-indigo-900 bg-opacity-30 border border-indigo-500 border-opacity-30 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400">Score</div>
          <div className="text-2xl font-bold text-indigo-300">{score}</div>
        </div>
        <div className="bg-indigo-900 bg-opacity-30 border border-indigo-500 border-opacity-30 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400">Round</div>
          <div className="text-2xl font-bold text-indigo-300">{currentRound + 1}/{roundCount}</div>
        </div>
        <div className="bg-indigo-900 bg-opacity-30 border border-indigo-500 border-opacity-30 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400">Time</div>
          <div className={`text-2xl font-bold ${timeLeft < 3 ? 'text-red-400' : 'text-indigo-300'}`}>{timeLeft.toFixed(1)}s</div>
        </div>
      </div>

      {currentCategory && (
        <>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-300 mb-3">{currentCategory.name}</div>
            <div className="text-sm text-gray-400">Examples: {currentCategory.examples.join(', ')}</div>
          </div>

          <div className="w-full max-w-md flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a word..."
              className="flex-1 px-4 py-2 bg-gray-800 border border-indigo-500 border-opacity-30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-400"
              autoFocus
            />
            <button
              onClick={handleSubmitWord}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold rounded-lg hover:from-indigo-700 hover:to-purple-800 transition-all"
            >
              Submit
            </button>
          </div>

          {message && (
            <div className={`text-sm font-semibold ${message.includes('✅') ? 'text-green-400' : 'text-amber-400'}`}>
              {message}
            </div>
          )}

          <div className="w-full max-w-md">
            <div className="text-xs text-gray-400 mb-2">Words submitted: {submittedWords.size}</div>
            <div className="bg-gray-900 rounded-lg p-3 max-h-32 overflow-y-auto">
              {submittedWords.size > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {Array.from(submittedWords).map(word => (
                    <span key={word} className="px-2 py-1 bg-indigo-900 bg-opacity-50 text-indigo-300 text-xs rounded">
                      {word}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm text-center">No words submitted yet</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
