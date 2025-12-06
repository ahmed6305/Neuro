"use client"
import React, { useState, useEffect, useRef } from 'react'
import { Difficulty, difficultyOrder, getNextDifficulty, difficultyConfigs } from '../../lib/gameLevels'

export default function SpeedSwipeMatch() {
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy')
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(difficultyConfigs.Easy.lives)
  const [level, setLevel] = useState(1)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState('')
  const [timeLeft, setTimeLeft] = useState(difficultyConfigs.Easy.timePerRound)
  const [targetDirection, setTargetDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('UP')
  const [combo, setCombo] = useState(0)
  const dragStartRef = useRef<{x: number, y: number} | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const roundStartRef = useRef(false)

  const config = difficultyConfigs[difficulty]

  const generateNewRound = () => {
    const directions: ('UP' | 'DOWN' | 'LEFT' | 'RIGHT')[] = ['UP', 'DOWN', 'LEFT', 'RIGHT']
    setTargetDirection(directions[Math.floor(Math.random() * directions.length)])
    setTimeLeft(config.timePerRound)
    roundStartRef.current = true
    setMessage('')
  }

  useEffect(() => {
    if (!gameStarted || gameOver) return

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 0.05) {
          handleTimeout()
          return config.timePerRound
        }
        return t - 0.05
      })
    }, 50)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [gameStarted, gameOver, config.timePerRound])

  const handleTimeout = () => {
    if (!roundStartRef.current) return
    roundStartRef.current = false
    setMessage('❌ Too slow!')
    setCombo(0)
    const newLives = lives - 1
    setLives(newLives)
    if (newLives <= 0) {
      setGameOver(true)
    } else {
      setTimeout(() => generateNewRound(), 600)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartRef.current = {x: e.clientX, y: e.clientY}
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!dragStartRef.current || !gameStarted || gameOver || !roundStartRef.current) {
      dragStartRef.current = null
      return
    }

    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    dragStartRef.current = null

    if (distance < 20) return

    let direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' = 'UP'
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)

    if (angle > -45 && angle <= 45) direction = 'RIGHT'
    else if (angle > 45 && angle <= 135) direction = 'DOWN'
    else if (angle > 135 || angle <= -135) direction = 'LEFT'
    else direction = 'UP'

    checkDirection(direction)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!gameStarted || gameOver || !roundStartRef.current) return

    let direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null = null
    if (e.key === 'ArrowUp') direction = 'UP'
    else if (e.key === 'ArrowDown') direction = 'DOWN'
    else if (e.key === 'ArrowLeft') direction = 'LEFT'
    else if (e.key === 'ArrowRight') direction = 'RIGHT'

    if (direction) {
      e.preventDefault()
      checkDirection(direction)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameStarted, gameOver, targetDirection])

  const checkDirection = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (!roundStartRef.current) return
    roundStartRef.current = false

    if (direction === targetDirection) {
      const speedBonus = Math.max(0, Math.floor(timeLeft * 5))
      const earnedPoints = (10 + speedBonus) * (1 + combo * 0.1) * config.speedMultiplier
      setScore(s => s + Math.floor(earnedPoints))
      setMessage(`✅ Correct! +${Math.floor(earnedPoints)} (Combo ×${combo + 1})`)
      setCombo(c => c + 1)
      if ((combo + 1) % 5 === 0) {
        setLevel(l => l + 1)
      }
      setTimeout(() => generateNewRound(), 400)
    } else {
      setMessage('❌ Wrong direction!')
      setCombo(0)
      const newLives = lives - 1
      setLives(newLives)
      if (newLives <= 0) {
        setGameOver(true)
      } else {
        setTimeout(() => generateNewRound(), 600)
      }
    }
  }

  const startGame = (diff: Difficulty = 'Easy') => {
    setDifficulty(diff)
    const diffConfig = difficultyConfigs[diff]
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
    setLives(diffConfig.lives)
    setLevel(1)
    setCombo(0)
    setMessage('')
    setTimeLeft(diffConfig.timePerRound)
    setTargetDirection('UP')
    roundStartRef.current = true
    setTimeout(() => generateNewRound(), 100)
  }

  const handleNextDifficulty = () => {
    const next = getNextDifficulty(difficulty)
    if (next) startGame(next)
  }

  if (!gameStarted) {
    return (
      <div style={{textAlign: 'center', color: '#e5e7eb', display: 'flex', flexDirection: 'column', gap: '2rem'}}>
        <div>
          <h2 style={{fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '700'}}>⚡ Speed Swipe Match</h2>
          <p style={{color: '#9ca3af', marginBottom: '1.5rem'}}>Swipe or press arrow keys in the direction shown before time runs out!</p>
          <div style={{backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '0.5rem', padding: '1rem', textAlign: 'left', display: 'inline-block', maxWidth: '400px'}}>
            <p style={{margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#d8b4fe', fontWeight: '600'}}>How to play:</p>
            <ul style={{margin: '0', paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#9ca3af'}}>
              <li>Watch the prompt for the required swipe direction</li>
              <li>Swipe on screen or use ↑ ↓ ← → arrow keys</li>
              <li>Correct swipes build combos for bonus points</li>
              <li>Lose all lives and it's game over!</li>
            </ul>
          </div>
        </div>

        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
          {difficultyOrder.map(diff => (
            <button
              key={diff}
              onClick={() => startGame(diff)}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
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
      <div style={{textAlign: 'center', color: '#e5e7eb', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center'}}>
        <div>
          <h2 style={{fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '700'}}>Game Over!</h2>
          <div style={{fontSize: '1.25rem', color: '#a78bfa', marginBottom: '0.5rem'}}>Score: {score}</div>
          <div style={{fontSize: '1rem', color: '#60a5fa'}}>Difficulty: {difficulty} • Level: {level} • Best Combo: {combo}</div>
        </div>
        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
          <button
            onClick={() => startGame(difficulty)}
            style={{
              padding: '0.75rem 2rem',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Play Again ({difficulty})
          </button>
          {getNextDifficulty(difficulty) && (
            <button
              onClick={handleNextDifficulty}
              style={{
                padding: '0.75rem 2rem',
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Next Difficulty
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{textAlign: 'center', color: '#e5e7eb', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', fontSize: '0.875rem'}}>
        <div>
          <div style={{color: '#9ca3af'}}>Score</div>
          <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#a78bfa'}}>{score}</div>
        </div>
        <div>
          <div style={{color: '#9ca3af'}}>Lives</div>
          <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#ef4444'}}>❤️ {lives}</div>
        </div>
        <div>
          <div style={{color: '#9ca3af'}}>Combo</div>
          <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#10b981'}}>×{combo}</div>
        </div>
        <div>
          <div style={{color: '#9ca3af'}}>Level</div>
          <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#60a5fa'}}>{level}</div>
        </div>
      </div>

      <div
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{
          userSelect: 'none',
          padding: '3rem 2rem',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          border: '3px solid rgba(99, 102, 241, 0.4)',
          borderRadius: '1rem',
          cursor: 'grab',
          minHeight: '280px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem'
        }}
      >
        <div style={{fontSize: '3.5rem'}}>👋</div>
        <div style={{fontSize: '1.1rem', color: '#9ca3af', fontWeight: '500'}}>
          Swipe or press arrow key:
        </div>
        <div style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          color: '#60a5fa',
          padding: '1.5rem',
          backgroundColor: 'rgba(96, 165, 250, 0.15)',
          borderRadius: '0.75rem',
          minWidth: '150px'
        }}>
          {targetDirection === 'UP' ? '↑' : targetDirection === 'DOWN' ? '↓' : targetDirection === 'LEFT' ? '←' : '→'}
        </div>
        <div style={{fontSize: '2.5rem', fontWeight: 'bold', color: timeLeft < 0.5 ? '#ef4444' : '#10b981'}}>
          {timeLeft.toFixed(1)}s
        </div>
      </div>

      {message && (
        <div style={{
          fontSize: '1.1rem',
          color: message.includes('✅') ? '#10b981' : '#ef4444',
          fontWeight: '600',
          padding: '0.75rem 1.5rem',
          backgroundColor: message.includes('✅') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          borderRadius: '0.5rem'
        }}>
          {message}
        </div>
      )}
    </div>
  )
}

