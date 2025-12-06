"use client";
import React, { useState, useEffect } from "react";
import { NeonButton } from "../ui/NeonButton";
import { NeonCard } from "../ui/NeonCard";
import { VictoryBanner } from "../ui/VictoryBanner";
import { useSound } from "../../lib/useSound";
import { playTone } from "../../lib/sounds";

type Difficulty = "Easy" | "Medium" | "Hard" | "Critical";

type Card = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const EMOJIS = [
  "🎨", "🎭", "🎪", "🎬", "🎤", "🎧", "🎮", "🎯",
  "🎲", "🎳", "🎰", "🎷", "🎸", "🎹", "🎺", "🎻",
  "🍎", "🍊", "🍋", "🍌", "🍉", "🍓", "🍒", "🍑"
];

const gridConfigs: Record<Difficulty, { cols: number; rows: number }> = {
  Easy: { cols: 3, rows: 4 },
  Medium: { cols: 4, rows: 4 },
  Hard: { cols: 4, rows: 5 },
  Critical: { cols: 5, rows: 6 },
};

const nextDifficulty: Record<Difficulty, Difficulty | null> = {
  Easy: "Medium",
  Medium: "Hard",
  Hard: "Critical",
  Critical: null,
};

export default function EmojiMemoryBattle() {
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy")
  const [cards, setCards] = useState<Card[]>([])
  const [firstCard, setFirstCard] = useState<Card | null>(null)
  const [secondCard, setSecondCard] = useState<Card | null>(null)
  const [moves, setMoves] = useState(0)
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  // Sound hooks
  const { play: playClick } = useSound("/sounds/click.mp3", 0.5);
  const { play: playMatch } = useSound("/sounds/success.mp3", 0.7);
  const { play: playWin } = useSound("/sounds/level-up.mp3", 0.7);

  const config = gridConfigs[difficulty]
  const totalPairs = (config.cols * config.rows) / 2

  const initializeGame = (diff: Difficulty = difficulty) => {
    setDifficulty(diff)
    const cfg = gridConfigs[diff]
    const pairCount = (cfg.cols * cfg.rows) / 2
    const emojiSet = EMOJIS.slice(0, pairCount)
    const shuffled = [...emojiSet, ...emojiSet]
      .sort(() => Math.random() - 0.5)
      .map((emoji, idx) => ({
        id: idx,
        emoji,
        isFlipped: false,
        isMatched: false
      }))
    setCards(shuffled)
    setFirstCard(null)
    setSecondCard(null)
    setMoves(0)
    setMatchedPairs(0)
    setTime(0)
    setGameWon(false)
    setGameStarted(true)
    setIsRunning(true)
  }

  useEffect(() => {
    if (!isRunning || gameWon) return
    const id = setInterval(() => setTime(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [isRunning, gameWon])

  useEffect(() => {
    if (!firstCard || !secondCard) return

    const delay = setTimeout(() => {
      if (firstCard.emoji === secondCard.emoji) {
        playTone(800, 150);
        playMatch();
        setCards(prev =>
          prev.map(card =>
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, isMatched: true, isFlipped: true }
              : card
          )
        )
        const newMatched = matchedPairs + 1
        setMatchedPairs(newMatched)

        if (newMatched === totalPairs) {
          playWin();
          setGameWon(true)
          setIsRunning(false)
        }
      } else {
        playTone(300, 100);
        setCards(prev =>
          prev.map(card =>
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, isFlipped: false }
              : card
          )
        )
      }
      setFirstCard(null)
      setSecondCard(null)
    }, 700)

    return () => clearTimeout(delay)
  }, [firstCard, secondCard, matchedPairs, totalPairs, playMatch, playWin])

  const handleCardClick = (id: number) => {
    if (gameWon) return

    const card = cards.find(c => c.id === id)
    if (!card || card.isMatched || card.isFlipped) return

    playClick();
    const flippedCard = { ...card, isFlipped: true }

    if (!firstCard) {
      setFirstCard(flippedCard)
      setCards(prev =>
        prev.map(c => (c.id === id ? flippedCard : c))
      )
    } else if (!secondCard) {
      setSecondCard(flippedCard)
      setCards(prev =>
        prev.map(c => (c.id === id ? flippedCard : c))
      )
      setMoves(m => m + 1)
    }
  }

  const handlePlayAgain = () => {
    initializeGame()
  }

  useEffect(() => {
    initializeGame("Easy")
  }, [])

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center gap-8 w-full">
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            🎲 Emoji Memory Battle
          </h2>
          <p className="text-gray-400 mb-6">Find all matching pairs! Select a difficulty to start.</p>
        </div>

        <div className="flex gap-3 flex-wrap justify-center">
          {(["Easy", "Medium", "Hard", "Critical"] as Difficulty[]).map(diff => (
            <NeonButton
              key={diff}
              onClick={() => initializeGame(diff)}
              variant="primary"
            >
              Start: {diff}
            </NeonButton>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
          🎲 Emoji Memory Battle
        </h2>
        <p className="text-gray-400">Click cards to flip them and find matching pairs!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        <NeonCard className="p-3 text-center">
          <div className="text-xs text-gray-400">Difficulty</div>
          <div className="text-lg font-bold text-purple-300">{difficulty}</div>
        </NeonCard>
        <NeonCard className="p-3 text-center">
          <div className="text-xs text-gray-400">Moves</div>
          <div className="text-2xl font-bold text-purple-300">{moves}</div>
        </NeonCard>
        <NeonCard className="p-3 text-center">
          <div className="text-xs text-gray-400">Time</div>
          <div className="text-2xl font-bold text-purple-300">{time}s</div>
        </NeonCard>
      </div>

      <NeonCard className="p-4 w-full max-w-xs">
        <div className="text-sm text-gray-300">Matched: {matchedPairs} / {totalPairs}</div>
        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${(matchedPairs / totalPairs) * 100}%` }}
          />
        </div>
      </NeonCard>

      {/* Game Grid */}
      <div className={`grid gap-3 w-full max-w-2xl`} style={{ gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))` }}>
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={card.isMatched || card.isFlipped || gameWon}
            className={`
              aspect-square rounded-lg font-bold text-xl sm:text-2xl
              transition-all duration-200 ease-in-out
              border-2 border-opacity-30
              ${
                card.isMatched
                  ? "bg-gradient-to-br from-green-600/30 to-green-700/30 border-green-500 text-white cursor-default opacity-100 shadow-[0_0_15px_rgba(74,222,128,0.3)]"
                  : card.isFlipped
                  ? "bg-gradient-to-br from-purple-600 to-blue-600 border-purple-400 text-white cursor-default shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                  : "bg-gray-800 border-gray-600 hover:border-purple-400 hover:bg-gray-700 cursor-pointer text-gray-500 hover:scale-105 hover:shadow-[0_0_10px_rgba(168,85,247,0.3)]"
              }
            `}
          >
            {card.isFlipped || card.isMatched ? card.emoji : "?"}
          </button>
        ))}
      </div>

      {/* Victory Banner */}
      {gameWon && (
        <VictoryBanner
          level={difficulty === "Easy" ? 1 : difficulty === "Medium" ? 2 : difficulty === "Hard" ? 3 : 4}
          score={Math.max(0, 1000 - moves * 50 - time * 5)}
          onNext={nextDifficulty[difficulty] ? () => initializeGame(nextDifficulty[difficulty]!) : undefined}
          onReplay={() => initializeGame(difficulty)}
        />
      )}
    </div>
  )
}
