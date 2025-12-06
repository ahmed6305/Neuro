"use client";
import React, { useState, useEffect } from "react";

type Difficulty = "Easy" | "Medium" | "Hard" | "Critical";
type GamePhase = "show" | "hide" | "question" | "result" | "idle";

interface Pattern {
  items: string[];
  question: string;
  options: string[];
  correctIndex: number;
}

const patternSets: Record<Difficulty, Pattern[]> = {
  Easy: [
    { items: ["🔴", "🟡", "🟢"], question: "How many colors?", options: ["2", "3", "4", "5"], correctIndex: 1 },
    { items: ["⭐", "⭐", "🌙"], question: "What was different?", options: ["Moon", "Star", "Cloud", "Sun"], correctIndex: 0 },
    { items: ["🎨", "🎮", "📚"], question: "How many items?", options: ["2", "3", "4"], correctIndex: 1 },
  ],
  Medium: [
    { items: ["🍕", "🍔", "🍟", "🌭"], question: "How many food items?", options: ["3", "4", "5", "6"], correctIndex: 1 },
    { items: ["🚗", "🚕", "🚙", "🚌", "🚎"], question: "Vehicle types?", options: ["4", "5", "6"], correctIndex: 1 },
    { items: ["❤️", "💛", "💚", "💙"], question: "What color was third?", options: ["Blue", "Green", "Yellow", "Red"], correctIndex: 1 },
    { items: ["🎵", "🎶", "🎤", "🎸", "🎹"], question: "Music items count?", options: ["4", "5", "6"], correctIndex: 1 },
  ],
  Hard: [
    { items: ["A", "B", "C", "D", "E", "F"], question: "Which letter was missing?", options: ["D", "E", "A", "F"], correctIndex: 0 },
    { items: ["🌹", "🌺", "🌸", "🌼", "🌻", "🌷"], question: "How many flowers?", options: ["5", "6", "7"], correctIndex: 1 },
    { items: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"], question: "Sum of all numbers?", options: ["18", "21", "24"], correctIndex: 1 },
    { items: ["🔴", "🟠", "🟡", "🟢", "🔵", "🟣"], question: "Color count?", options: ["5", "6", "7"], correctIndex: 1 },
  ],
  Critical: [
    { items: ["A", "B", "C", "D", "E", "F", "G", "H"], question: "8th letter?", options: ["G", "H", "F", "E"], correctIndex: 1 },
    { items: ["🍎", "🍊", "🍋", "🍌", "🍉", "🍓", "🍒", "🍑"], question: "Total fruits?", options: ["7", "8", "9"], correctIndex: 1 },
    { items: ["⭐", "🌟", "✨", "💫", "⚡", "🔥", "💥", "❄️"], question: "Star-type items?", options: ["3", "4", "5"], correctIndex: 2 },
    { items: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], question: "Last number?", options: ["9", "10", "11"], correctIndex: 1 },
  ],
};

const phaseDurations = {
  Easy: { show: 1000, hide: 500, question: 5000 },
  Medium: { show: 800, hide: 300, question: 4000 },
  Hard: { show: 600, hide: 200, question: 3000 },
  Critical: { show: 400, hide: 100, question: 2000 },
};

const nextDifficulty: Record<Difficulty, Difficulty | null> = {
  Easy: "Medium",
  Medium: "Hard",
  Hard: "Critical",
  Critical: null,
};

export default function FlashVisualBomb() {
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [resultMessage, setResultMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const patterns = patternSets[difficulty];
  const currentPattern = patterns[currentRound] || patterns[0];
  const durations = phaseDurations[difficulty];

  useEffect(() => {
    if (!gameStarted || gameOver || phase === "idle" || phase === "result") return;

    let timer: NodeJS.Timeout;
    if (phase === "show") {
      timer = setTimeout(() => setPhase("hide"), durations.show);
    } else if (phase === "hide") {
      timer = setTimeout(() => setPhase("question"), durations.hide);
    }

    return () => clearTimeout(timer);
  }, [phase, gameStarted, gameOver, durations]);

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setGameStarted(true);
    setCurrentRound(0);
    setScore(0);
    setGameOver(false);
    setPhase("show");
    setSelectedAnswer(null);
    setResultMessage("");
  };

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    const isCorrect = index === currentPattern.correctIndex;
    setResultMessage(isCorrect ? "✅ Correct!" : "❌ Wrong!");
    if (isCorrect) {
      setScore((s) => s + (5 - Math.floor(difficulty === "Easy" ? 1 : difficulty === "Medium" ? 1.5 : difficulty === "Hard" ? 2 : 2.5)));
    }
    setPhase("result");

    setTimeout(() => {
      if (currentRound + 1 >= patterns.length) {
        setGameOver(true);
      } else {
        setCurrentRound((r) => r + 1);
        setSelectedAnswer(null);
        setResultMessage("");
        setPhase("show");
      }
    }, 1500);
  };

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center gap-8 w-full min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
        <div className="text-center max-w-md">
          <h2 className="text-4xl font-bold text-white mb-3">⚡ Flash Visual Bomb</h2>
          <p className="text-gray-400 mb-6">Watch items flash briefly, then answer questions about them!</p>
          <div className="bg-indigo-900 bg-opacity-20 border border-indigo-500 border-opacity-30 rounded-lg p-4 text-left text-sm text-gray-300 mb-6">
            <p className="font-semibold text-indigo-300 mb-2">How to play:</p>
            <ul className="space-y-1 text-xs">
              <li>• See items displayed briefly</li>
              <li>• Items disappear</li>
              <li>• Answer the question</li>
              <li>• Easy: 3 rounds • Medium: 4 • Hard: 6 • Critical: 4</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap justify-center">
          {(["Easy", "Medium", "Hard", "Critical"] as Difficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() => startGame(diff)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold rounded-lg hover:from-indigo-700 hover:to-purple-800 transition-all transform hover:scale-105"
            >
              {diff}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 w-full min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-green-400 mb-4">🎉 Complete!</div>
          <div className="text-2xl font-bold text-white mb-2">Final Score: {score}</div>
          <div className="text-gray-400">Difficulty: {difficulty} • Rounds: {patterns.length}</div>
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => startGame(difficulty)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold rounded-lg hover:from-indigo-700 hover:to-purple-800 transition-all"
          >
            Play Again
          </button>
          {nextDifficulty[difficulty] && (
            <button
              onClick={() => startGame(nextDifficulty[difficulty]!)}
              className="px-6 py-3 bg-gradient-to-r from-purple-700 to-pink-700 text-white font-bold rounded-lg hover:from-purple-800 hover:to-pink-800 transition-all"
            >
              Next Level
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-1">⚡ Flash Visual Bomb</h2>
        <p className="text-gray-400 text-sm">Round {currentRound + 1}/{patterns.length}</p>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <div className="bg-indigo-900 bg-opacity-30 border border-indigo-500 border-opacity-30 rounded-lg px-4 py-2 text-center">
          <div className="text-xs text-gray-400">Score</div>
          <div className="text-2xl font-bold text-indigo-300">{score}</div>
        </div>
        <div className="bg-indigo-900 bg-opacity-30 border border-indigo-500 border-opacity-30 rounded-lg px-4 py-2 text-center">
          <div className="text-xs text-gray-400">Difficulty</div>
          <div className="text-2xl font-bold text-purple-300">{difficulty}</div>
        </div>
      </div>

      {/* Game Display */}
      <div className="w-full max-w-md">
        {/* Show Phase */}
        {phase === "show" && (
          <div className="flex flex-wrap gap-3 justify-center p-8 bg-gradient-to-b from-indigo-900 to-purple-900 bg-opacity-30 border-2 border-indigo-500 border-opacity-40 rounded-lg min-h-40 items-center">
            {currentPattern.items.map((item, idx) => (
              <div key={idx} className="text-4xl animate-pulse">
                {item}
              </div>
            ))}
          </div>
        )}

        {/* Hide Phase */}
        {phase === "hide" && (
          <div className="flex justify-center p-8 bg-gray-800 bg-opacity-50 border-2 border-gray-600 border-opacity-50 rounded-lg min-h-40 items-center">
            <div className="text-gray-500 text-lg font-semibold">Remember...</div>
          </div>
        )}

        {/* Question Phase */}
        {phase === "question" && (
          <div className="space-y-4">
            <div className="p-6 bg-indigo-900 bg-opacity-20 border border-indigo-500 border-opacity-30 rounded-lg text-center">
              <div className="text-xl font-bold text-white">{currentPattern.question}</div>
            </div>
            <div className="space-y-3">
              {currentPattern.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={selectedAnswer !== null}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                    selectedAnswer === idx
                      ? idx === currentPattern.correctIndex
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  } ${selectedAnswer !== null ? "cursor-not-allowed opacity-75" : "cursor-pointer"}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result Phase */}
        {phase === "result" && (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-800 bg-opacity-50 border-2 border-gray-600 rounded-lg min-h-40 gap-4">
            <div className="text-3xl font-bold text-white">{resultMessage}</div>
            <div className="text-sm text-gray-400">Next round...</div>
          </div>
        )}
      </div>
    </div>
  );
}
