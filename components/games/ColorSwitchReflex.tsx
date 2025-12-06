"use client";
import React, { useState, useEffect } from "react";
import { NeonButton } from "../ui/NeonButton";
import { NeonCard } from "../ui/NeonCard";
import { VictoryBanner } from "../ui/VictoryBanner";
import { useSound } from "../../lib/useSound";
import { playTone } from "../../lib/sounds";

type Difficulty = "Easy" | "Medium" | "Hard" | "Critical";
type ColorName = "RED" | "BLUE" | "GREEN" | "YELLOW" | "PURPLE" | "CYAN" | "PINK" | "ORANGE";
type Action = "click" | "avoid";

interface Rule {
  action: Action;
  color: ColorName;
}

const COLORS: Record<ColorName, string> = {
  RED: "from-red-500 to-red-600",
  BLUE: "from-blue-500 to-blue-600",
  GREEN: "from-green-500 to-green-600",
  YELLOW: "from-yellow-500 to-yellow-600",
  PURPLE: "from-purple-500 to-purple-600",
  CYAN: "from-cyan-500 to-cyan-600",
  PINK: "from-pink-500 to-pink-600",
  ORANGE: "from-orange-500 to-orange-600",
};

const COLOR_LIST: ColorName[] = ["RED", "BLUE", "GREEN", "YELLOW", "PURPLE", "CYAN", "PINK", "ORANGE"];

const generateRules = (difficulty: Difficulty): Rule[] => {
  const ruleCount: Record<Difficulty, number> = { Easy: 4, Medium: 6, Hard: 8, Critical: 10 };
  const count = ruleCount[difficulty];
  const rules: Rule[] = [];

  for (let i = 0; i < count; i++) {
    rules.push({
      action: Math.random() > 0.5 ? "click" : "avoid",
      color: COLOR_LIST[Math.floor(Math.random() * COLOR_LIST.length)],
    });
  }

  return rules;
};

const timeLimits: Record<Difficulty, number> = {
  Easy: 1500,
  Medium: 1000,
  Hard: 600,
  Critical: 400,
};

const nextDifficulty: Record<Difficulty, Difficulty | null> = {
  Easy: "Medium",
  Medium: "Hard",
  Hard: "Critical",
  Critical: null,
};

export default function ColorSwitchReflex() {
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentRuleIndex, setCurrentRuleIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(0);
  const [message, setMessage] = useState("");
  const [rules, setRules] = useState<Rule[]>([]);
  const [answered, setAnswered] = useState(false);

  // Generate rules on game start
  useEffect(() => {
    if (!gameStarted) return;
    setRules(generateRules(difficulty));
  }, [gameStarted, difficulty]);

  // Timer for current rule
  useEffect(() => {
    if (!gameStarted || gameOver || answered || rules.length === 0) return;

    const timeLimit = timeLimits[difficulty];
    let timeRemaining = timeLimit;
    setTimeLeft(timeRemaining);

    const timer = setInterval(() => {
      timeRemaining -= 50;
      setTimeLeft(Math.max(0, timeRemaining));

      if (timeRemaining <= 0) {
        // Time's up - auto fail
        handleTimeout();
      }
    }, 50);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, answered, difficulty, rules]);

  const currentRule = rules[currentRuleIndex];

  const handleTimeout = () => {
    setMessage("⏱️ Time's up!");
    setAnswered(true);
    const newLives = lives - 1;
    setLives(newLives);

    if (newLives <= 0) {
      setTimeout(() => setGameOver(true), 1000);
    } else {
      setTimeout(() => nextRound(), 1000);
    }
  };

  const handleColorClick = (clickedColor: ColorName) => {
    if (!currentRule || answered) return;

    setAnswered(true);
    playTone(600, 100);

    if (currentRule.action === "click" && clickedColor === currentRule.color) {
      // Correct click
      playTone(800, 200);
      setMessage("✅ Correct!");
      setScore((s) => s + 10);
      setTimeout(() => nextRound(), 800);
    } else if (currentRule.action === "avoid" && clickedColor !== currentRule.color) {
      // Correct avoid (click different color)
      playTone(800, 200);
      setMessage("✅ Correct!");
      setScore((s) => s + 10);
      setTimeout(() => nextRound(), 800);
    } else {
      // Wrong
      playTone(300, 150);
      setMessage("❌ Wrong!");
      const newLives = lives - 1;
      setLives(newLives);

      if (newLives <= 0) {
        setTimeout(() => setGameOver(true), 1000);
      } else {
        setTimeout(() => nextRound(), 1000);
      }
    }
  };

  const nextRound = () => {
    if (currentRuleIndex + 1 >= rules.length) {
      setGameOver(true);
    } else {
      setCurrentRuleIndex((idx) => idx + 1);
      setAnswered(false);
      setMessage("");
    }
  };

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setGameStarted(true);
    setGameOver(false);
    setCurrentRuleIndex(0);
    setScore(0);
    setLives(3);
    setMessage("");
    setAnswered(false);
    setRules(generateRules(diff));
  };

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center gap-8 w-full min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
        <div className="text-center max-w-md">
          <h2 className="text-4xl font-bold text-white mb-3">🎨 Color Switch Reflex</h2>
          <p className="text-gray-400 mb-6">Fast-paced reflex game with color rules!</p>
          <div className="bg-indigo-900 bg-opacity-20 border border-indigo-500 border-opacity-30 rounded-lg p-4 text-left text-sm text-gray-300">
            <p className="font-semibold text-indigo-300 mb-2">How to play:</p>
            <ul className="space-y-1 text-xs">
              <li>• A rule appears (e.g. "Click RED")</li>
              <li>• Follow the rule quickly</li>
              <li>• Or click a different color to "avoid"</li>
              <li>• One wrong move loses a life!</li>
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

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 w-full min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
        <div className="text-center">
          <div className={`text-5xl font-bold mb-4 ${lives <= 0 ? "text-red-500" : "text-green-400"}`}>
            {lives <= 0 ? "Game Over!" : "🎉 Complete!"}
          </div>
          <div className="text-2xl font-bold text-white mb-2">Final Score: {score}</div>
          <div className="text-gray-400 mb-6">Difficulty: {difficulty} • Rules: {rules.length}</div>
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

  if (!currentRule) {
    return <div className="text-white text-center p-6">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-1">🎨 Color Switch Reflex</h2>
        <p className="text-gray-400 text-sm">Round {currentRuleIndex + 1}/{rules.length}</p>
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
        <div className="bg-indigo-900 bg-opacity-30 border border-indigo-500 border-opacity-30 rounded-lg px-4 py-2 text-center">
          <div className="text-xs text-gray-400">Time Left</div>
          <div className="text-2xl font-bold text-cyan-300">{(timeLeft / 1000).toFixed(1)}s</div>
        </div>
      </div>

      {/* Rule Display */}
      <div className="p-8 bg-indigo-900 bg-opacity-20 border-2 border-indigo-500 border-opacity-30 rounded-lg text-center max-w-md">
        <div className="text-sm text-gray-400 mb-4">Current Rule</div>
        <div className="text-2xl font-bold text-white">
          {currentRule.action === "click" ? "🎯 CLICK" : "❌ AVOID"} <span className="text-yellow-300">{currentRule.color}</span>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`text-xl font-bold ${message.includes("✅") ? "text-green-400" : "text-red-400"}`}>
          {message}
        </div>
      )}

      {/* Color Buttons */}
      <div className="grid grid-cols-4 gap-3 max-w-2xl">
        {COLOR_LIST.slice(0, 8).map((colorName) => (
          <button
            key={colorName}
            onClick={() => handleColorClick(colorName)}
            disabled={answered}
            className={`
              w-16 h-16 rounded-lg font-bold text-white text-xs shadow-lg
              transition-all transform hover:scale-110
              bg-gradient-to-br ${COLORS[colorName]}
              ${answered ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-xl"}
              ${currentRule && colorName === currentRule.color && currentRule.action === "click" ? "ring-4 ring-white" : ""}
            `}
          >
            {colorName.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md">
        <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-cyan-500 h-2 transition-all"
            style={{ width: `${(timeLeft / timeLimits[difficulty]) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

