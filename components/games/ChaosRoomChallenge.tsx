"use client";
import React, { useState, useEffect } from "react";
import { NeonButton } from "../ui/NeonButton";
import { NeonCard } from "../ui/NeonCard";
import { VictoryBanner } from "../ui/VictoryBanner";
import { useSound } from "../../lib/useSound";
import { playTone } from "../../lib/sounds";

type Difficulty = "Easy" | "Medium" | "Hard" | "Critical";
type GamePhase = "show" | "hide" | "question" | "result";

interface Round {
  itemsToShow: string[];
  itemsForQuestion: string[];
  missingItem: string;
}

// Item pools
const fruits = ["🍎", "🍊", "🍋", "🍌", "🍉", "🍓", "🍒", "🍑"];
const animals = ["🐱", "🐶", "🐰", "🐹", "🦊", "🐻", "🐼", "🐨"];
const vehicles = ["🚗", "🚕", "🚙", "🚌", "🏎️", "🚓", "🚑", "🚒"];
const food = ["🍕", "🍔", "🍟", "🌭", "🌮", "🌯", "🥙", "🥗"];

const createRound = (items: string[], itemCount: number): Round => {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  const itemsToShow = shuffled.slice(0, itemCount);
  const missingIndex = Math.floor(Math.random() * itemsToShow.length);
  const missingItem = itemsToShow[missingIndex];
  const itemsForQuestion = itemsToShow.filter((_, idx) => idx !== missingIndex);
  const questionOptions = [missingItem, ...shuffled.slice(itemCount, itemCount + 3)];
  
  return {
    itemsToShow,
    itemsForQuestion: questionOptions.sort(() => Math.random() - 0.5),
    missingItem,
  };
};

const allItemPools = [fruits, animals, vehicles, food];

const phaseDurations = {
  Easy: { show: 3000, hide: 1000 },
  Medium: { show: 2000, hide: 800 },
  Hard: { show: 1200, hide: 500 },
  Critical: { show: 800, hide: 300 },
};

const nextDifficulty: Record<Difficulty, Difficulty | null> = {
  Easy: "Medium",
  Medium: "Hard",
  Hard: "Critical",
  Critical: null,
};

export default function ChaosRoomChallenge() {
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [phase, setPhase] = useState<GamePhase>("show");
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [lives, setLives] = useState(3);
  const [rounds, setRounds] = useState<Round[]>([]);

  // Generate rounds based on difficulty
  useEffect(() => {
    if (!gameStarted) return;
    
    const itemCounts = { Easy: 6, Medium: 8, Hard: 10, Critical: 10 };
    const roundCount = { Easy: 3, Medium: 4, Hard: 5, Critical: 5 };
    const itemCount = itemCounts[difficulty];
    const count = roundCount[difficulty];

    const newRounds: Round[] = [];
    for (let i = 0; i < count; i++) {
      const pool = allItemPools[i % allItemPools.length];
      newRounds.push(createRound(pool, itemCount));
    }
    setRounds(newRounds);
  }, [gameStarted, difficulty]);

  // Manage phases
  useEffect(() => {
    if (!gameStarted || gameOver || rounds.length === 0) return;

    const duration = phaseDurations[difficulty];
    let timer: NodeJS.Timeout;

    if (phase === "show") {
      timer = setTimeout(() => setPhase("hide"), duration.show);
    } else if (phase === "hide") {
      timer = setTimeout(() => setPhase("question"), duration.hide);
    }

    return () => clearTimeout(timer);
  }, [phase, gameStarted, gameOver, difficulty, rounds]);

  const currentRound = rounds[currentRoundIndex];

  const handleAnswer = (item: string) => {
    setSelectedAnswer(item);
    const isCorrect = item === currentRound.missingItem;

    if (isCorrect) {
      playTone(800, 150);
      setMessage("✅ Correct!");
      setScore((s) => s + 10);
    } else {
      playTone(300, 100);
      setMessage("❌ Wrong!");
      setLives((l) => l - 1);
    }

    setPhase("result");

    setTimeout(() => {
      if (!isCorrect && lives - 1 <= 0) {
        setGameOver(true);
      } else if (currentRoundIndex + 1 >= rounds.length) {
        setGameOver(true);
      } else {
        setCurrentRoundIndex((idx) => idx + 1);
        setSelectedAnswer(null);
        setMessage("");
        setPhase("show");
      }
    }, 1500);
  };

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setGameStarted(true);
    setGameOver(false);
    setCurrentRoundIndex(0);
    setScore(0);
    setLives(3);
    setPhase("show");
    setMessage("");
    setSelectedAnswer(null);
  };

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center gap-8 w-full min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
        <div className="text-center max-w-md">
          <h2 className="text-4xl font-bold text-white mb-3">🔍 Chaos Room Challenge</h2>
          <p className="text-gray-400 mb-6">What's missing? A memory and observation game!</p>
          <div className="bg-indigo-900 bg-opacity-20 border border-indigo-500 border-opacity-30 rounded-lg p-4 text-left text-sm text-gray-300">
            <p className="font-semibold text-indigo-300 mb-2">How to play:</p>
            <ul className="space-y-1 text-xs">
              <li>• See a collection of items</li>
              <li>• Items disappear from view</li>
              <li>• Choose which one is missing</li>
              <li>• You have 3 lives</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap justify-center">
          {(["Easy", "Medium", "Hard", "Critical"] as Difficulty[]).map((diff) => (
            <NeonButton
              key={diff}
              onClick={() => startGame(diff)}
              variant="primary"
            >
              {diff}
            </NeonButton>
          ))}
        </div>
      </div>
    );
  }

  if (gameOver || (lives <= 0 && phase === "result")) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 w-full min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
        <div className="text-center">
          <div className={`text-5xl font-bold mb-4 ${lives <= 0 ? "text-red-500" : "text-green-400"}`}>
            {lives <= 0 ? "Game Over!" : "🎉 Complete!"}
          </div>
          <div className="text-2xl font-bold text-white mb-2">Final Score: {score}</div>
          <div className="text-gray-400 mb-6">Difficulty: {difficulty} • Lives: {lives}</div>
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          <NeonButton
            onClick={() => startGame(difficulty)}
            variant="primary"
          >
            Play Again
          </NeonButton>
          {nextDifficulty[difficulty] && (
            <NeonButton
              onClick={() => startGame(nextDifficulty[difficulty]!)}
              variant="secondary"
            >
              Next Level
            </NeonButton>
          )}
        </div>
      </div>
    );
  }

  if (!currentRound || rounds.length === 0) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-1">🔍 Chaos Room Challenge</h2>
        <p className="text-gray-400 text-sm">Round {currentRoundIndex + 1}/{rounds.length}</p>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <div className="bg-indigo-900 bg-opacity-30 border border-indigo-500 border-opacity-30 rounded-lg px-4 py-2 text-center">
          <div className="text-xs text-gray-400">Score</div>
          <div className="text-2xl font-bold text-indigo-300">{score}</div>
        </div>
        <div className={`border px-4 py-2 text-center rounded-lg ${lives > 1 ? "bg-green-900 bg-opacity-30 border-green-500 border-opacity-30" : "bg-red-900 bg-opacity-30 border-red-500 border-opacity-30"}`}>
          <div className="text-xs text-gray-400">Lives</div>
          <div className={`text-2xl font-bold ${lives > 1 ? "text-green-400" : "text-red-400"}`}>{"❤️".repeat(Math.max(0, lives))}</div>
        </div>
      </div>

      {/* Main Display */}
      <div className="w-full max-w-2xl">
        {phase === "show" && (
          <div className="bg-indigo-900 bg-opacity-30 border-2 border-indigo-500 border-opacity-40 rounded-lg p-8 min-h-40">
            <div className="flex flex-wrap gap-4 justify-center items-center">
              {currentRound.itemsToShow.map((item, idx) => (
                <div key={idx} className="text-5xl animate-bounce" style={{ animationDelay: `${idx * 100}ms` }}>
                  {item}
                </div>
              ))}
            </div>
            <div className="text-center mt-6 text-gray-400">Memorize these items...</div>
          </div>
        )}

        {phase === "hide" && (
          <div className="bg-gray-800 bg-opacity-50 border-2 border-gray-600 rounded-lg p-8 min-h-40 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-500 mb-2">🔄</div>
              <div className="text-gray-400">One item is gone...</div>
            </div>
          </div>
        )}

        {(phase === "question" || phase === "result") && (
          <div className="space-y-4">
            <div className="p-6 bg-indigo-900 bg-opacity-20 border border-indigo-500 border-opacity-30 rounded-lg text-center">
              <div className="text-xl font-bold text-white">Which item is missing?</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {currentRound.itemsForQuestion.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(item)}
                  disabled={phase === "result"}
                  className={`py-4 px-6 rounded-lg font-bold text-2xl transition-all transform hover:scale-110 ${
                    selectedAnswer === item
                      ? item === currentRound.missingItem
                        ? "bg-green-600 ring-2 ring-green-400"
                        : "bg-red-600 ring-2 ring-red-400"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } ${phase === "result" ? "cursor-not-allowed opacity-75" : "cursor-pointer"}`}
                >
                  {item}
                </button>
              ))}
            </div>

            {message && (
              <div className={`text-center text-xl font-bold ${message.includes("✅") ? "text-green-400" : "text-red-400"}`}>
                {message}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
