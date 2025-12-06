"use client"
import React, { useState } from 'react'
import { Difficulty, difficultyOrder, getNextDifficulty, difficultyConfigs } from '../../lib/gameLevels'

interface Story {
  id: string
  fragments: string[]
  correct: number[]
}

const allStories: Story[] = [
  {
    id: 'story1',
    fragments: ['Once upon a time, there was a brave knight.', 'He encountered a fearsome dragon.', 'Together they became the best of friends.'],
    correct: [0, 1, 2]
  },
  {
    id: 'story2',
    fragments: ['A young adventurer set out to find treasure.', 'After many trials, she discovered a hidden map.', 'The treasure led her to a magical kingdom.'],
    correct: [0, 1, 2]
  },
  {
    id: 'story3',
    fragments: ['The wise old sage began to teach.', 'His student learned the secret of magic.', 'Soon, she became the greatest wizard.'],
    correct: [0, 1, 2]
  },
  {
    id: 'story4',
    fragments: ['In a bustling city, a mysterious package arrived.', 'It contained a secret that would change everything.', 'The discovery sparked an unexpected adventure.'],
    correct: [0, 1, 2]
  },
  {
    id: 'story5',
    fragments: ['Two strangers met at a crossroads.', 'Their conversation sparked an unusual friendship.', 'Years later, they became legendary companions.'],
    correct: [0, 1, 2]
  }
]

const storySets = {
  Easy: 2,
  Medium: 3,
  Hard: 4,
  Critical: 5
}

export default function StorySplitChallenge() {
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy')
  const [currentStory, setCurrentStory] = useState(0)
  const [order, setOrder] = useState([0, 1, 2].sort(() => Math.random() - 0.5))
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState('')
  const [checked, setChecked] = useState(false)

  const config = difficultyConfigs[difficulty]
  const storyCount = storySets[difficulty]
  const stories = allStories.slice(0, storyCount)
  const scoreMultiplier = config.speedMultiplier

  const currentStoryData = stories[currentStory]
  const isCorrect = JSON.stringify(order) === JSON.stringify(currentStoryData.correct)

  const handleCheck = () => {
    setChecked(true)
    if (isCorrect) {
      setMessage('✅ Story ordered correctly!')
      setScore(s => s + Math.floor(10 * scoreMultiplier))
      setTimeout(() => {
        if (currentStory + 1 >= stories.length) {
          setGameOver(true)
        } else {
          setCurrentStory(c => c + 1)
          setOrder([0, 1, 2].sort(() => Math.random() - 0.5))
          setChecked(false)
          setMessage('')
        }
      }, 1500)
    } else {
      setMessage('❌ Wrong order! Try again.')
      setTimeout(() => setChecked(false), 1000)
    }
  }

  const moveUp = (index: number) => {
    if (index > 0 && !checked) {
      const newOrder = [...order]
      ;[newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]]
      setOrder(newOrder)
    }
  }

  const moveDown = (index: number) => {
    if (index < order.length - 1 && !checked) {
      const newOrder = [...order]
      ;[newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]]
      setOrder(newOrder)
    }
  }

  const startGame = (diff: Difficulty = 'Easy') => {
    setDifficulty(diff)
    setGameStarted(true)
    setCurrentStory(0)
    setScore(0)
    setGameOver(false)
    setMessage('')
    setChecked(false)
    setOrder([0, 1, 2].sort(() => Math.random() - 0.5))
  }

  const handleNextDifficulty = () => {
    const next = getNextDifficulty(difficulty)
    if (next) startGame(next)
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', width: '100%'}}>
      <div style={{display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '0.875rem', color: '#9ca3af'}}>Score</div>
          <div style={{fontSize: '2rem', fontWeight: '700', color: '#a78bfa'}}>{score}</div>
        </div>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '0.875rem', color: '#9ca3af'}}>Story</div>
          <div style={{fontSize: '2rem', fontWeight: '700', color: '#60a5fa'}}>{currentStory + 1}/{stories.length}</div>
        </div>
      </div>

      {!gameStarted ? (
        <div style={{textAlign: 'center', color: '#e5e7eb', display: 'flex', flexDirection: 'column', gap: '2rem'}}>
          <div>
            <h2 style={{fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '700'}}>📖 Story Split Challenge</h2>
            <p style={{color: '#9ca3af', marginBottom: '1.5rem'}}>Reorder the story fragments to make sense!</p>
            <div style={{backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '0.5rem', padding: '1rem', textAlign: 'left', display: 'inline-block', maxWidth: '400px'}}>
              <p style={{margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#d8b4fe', fontWeight: '600'}}>How to play:</p>
              <ul style={{margin: '0', paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#9ca3af'}}>
                <li>Use arrow buttons to rearrange story fragments</li>
                <li>Place them in the correct order</li>
                <li>Click "Check Order" to verify</li>
                <li>Easy: {storySets.Easy} stories • Medium: {storySets.Medium} • Hard: {storySets.Hard} • Critical: {storySets.Critical}</li>
              </ul>
            </div>
          </div>

          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            {difficultyOrder.map(diff => (
              <button
                key={diff}
                onClick={() => startGame(diff)}
                style={{padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer'}}
              >
                Start: {diff}
              </button>
            ))}
          </div>
        </div>
      ) : gameOver ? (
        <div style={{textAlign: 'center', color: '#e5e7eb', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center'}}>
          <div>
            <h2 style={{fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '700'}}>All Stories Solved!</h2>
            <div style={{fontSize: '1.25rem', color: '#a78bfa', marginBottom: '0.5rem'}}>Final Score: {Math.floor(score)}</div>
            <div style={{fontSize: '1rem', color: '#60a5fa'}}>Difficulty: {difficulty} • Stories: {stories.length}</div>
          </div>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <button onClick={() => startGame(difficulty)} style={{padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer'}}>
              Play Again ({difficulty})
            </button>
            {getNextDifficulty(difficulty) && (
              <button onClick={handleNextDifficulty} style={{padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer'}}>
                Next Difficulty
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div style={{fontSize: '0.875rem', color: '#9ca3af', textAlign: 'center'}}>
            Reorder the story to make it flow correctly
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '500px'}}>
            {order.map((fragmentIdx, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: checked && isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                  border: '2px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '0.5rem'
                }}
              >
                <div style={{flex: 1, color: '#e5e7eb', fontSize: '0.95rem'}}>
                  {currentStoryData.fragments[fragmentIdx]}
                </div>
                {!checked && (
                  <div style={{display: 'flex', gap: '0.25rem'}}>
                    <button onClick={() => moveUp(idx)} disabled={idx === 0} style={{padding: '0.25rem 0.5rem', backgroundColor: 'rgba(99, 102, 241, 0.2)', border: 'none', color: '#a5b4fc', borderRadius: '0.25rem', cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.5 : 1}}>↑</button>
                    <button onClick={() => moveDown(idx)} disabled={idx === order.length - 1} style={{padding: '0.25rem 0.5rem', backgroundColor: 'rgba(99, 102, 241, 0.2)', border: 'none', color: '#a5b4fc', borderRadius: '0.25rem', cursor: idx === order.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === order.length - 1 ? 0.5 : 1}}>↓</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {message && <div style={{fontSize: '1rem', color: message.includes('✅') ? '#10b981' : '#ef4444', fontWeight: '600'}}>{message}</div>}
          {!checked && <button onClick={handleCheck} style={{padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer'}}>Check Order</button>}
        </>
      )}
    </div>
  )
}
