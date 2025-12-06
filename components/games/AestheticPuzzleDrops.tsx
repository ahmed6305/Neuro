"use client";
import React, { useState, useEffect } from "react";

type Difficulty = "Easy" | "Medium" | "Hard" | "Critical";

const GRID_WIDTH = 10;
const GRID_HEIGHT = 16;
const NEON_COLORS = ["from-red-500 to-pink-500", "from-blue-500 to-cyan-500", "from-green-500 to-emerald-500", "from-yellow-500 to-orange-500", "from-purple-500 to-pink-500", "from-indigo-500 to-purple-500"];

interface Block {
  x: number;
  y: number;
  colorClass: string;
}

const dropSpeeds: Record<Difficulty, number> = {
  Easy: 1000,
  Medium: 700,
  Hard: 400,
  Critical: 200,
};

const nextDifficulty: Record<Difficulty, Difficulty | null> = {
  Easy: "Medium",
  Medium: "Hard",
  Hard: "Critical",
  Critical: null,
};

export default function AestheticPuzzleDrops() {
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const [grid, setGrid] = useState<(string | null)[][]>(Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(null)));
  const [currentBlock, setCurrentBlock] = useState<Block | null>(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const getRandomColor = () => NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];

  // Drop falling block
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const dropTimer = setInterval(() => {
      setCurrentBlock((prev) => {
        if (!prev) {
          // Spawn new block
          const newBlock: Block = {
            x: Math.floor(Math.random() * (GRID_WIDTH - 1)),
            y: 0,
            colorClass: getRandomColor(),
          };
          return newBlock;
        }

        // Try to move down
        const nextY = prev.y + 1;
        if (nextY >= GRID_HEIGHT) {
          // Block landed - add to grid
          setGrid((g) => {
            const newGrid = g.map((r) => [...r]);
            if (newGrid[prev.y] && newGrid[prev.y][prev.x] === null) {
              newGrid[prev.y][prev.x] = prev.colorClass;
            }

            // Check for complete rows
            let completedCount = 0;
            for (let i = GRID_HEIGHT - 1; i >= 0; i--) {
              if (newGrid[i].every((cell) => cell !== null)) {
                completedCount++;
                newGrid.splice(i, 1);
                newGrid.unshift(Array(GRID_WIDTH).fill(null));
              }
            }

            if (completedCount > 0) {
              setScore((s) => s + completedCount * 10);
              setLines((l) => l + completedCount);
            }

            // Check for game over
            if (newGrid[0].some((cell) => cell !== null)) {
              setGameOver(true);
            }

            return newGrid;
          });
          return null;
        }

        return { ...prev, y: nextY };
      });
    }, dropSpeeds[difficulty]);

    return () => clearInterval(dropTimer);
  }, [gameStarted, gameOver, difficulty]);

  // Keyboard controls
  useEffect(() => {
    if (!gameStarted || gameOver || !currentBlock) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        e.preventDefault();
        setCurrentBlock((prev) => {
          if (!prev || prev.x <= 0 || !grid[prev.y] || grid[prev.y][prev.x - 1] !== null) return prev;
          return { ...prev, x: prev.x - 1 };
        });
      } else if (e.key === "ArrowRight" || e.key === "d") {
        e.preventDefault();
        setCurrentBlock((prev) => {
          if (!prev || prev.x >= GRID_WIDTH - 1 || !grid[prev.y] || grid[prev.y][prev.x + 1] !== null) return prev;
          return { ...prev, x: prev.x + 1 };
        });
      } else if (e.key === "ArrowDown" || e.key === "s") {
        e.preventDefault();
        setCurrentBlock((prev) => {
          if (!prev || prev.y >= GRID_HEIGHT - 1 || !grid[prev.y + 1] || grid[prev.y + 1][prev.x] !== null) return prev;
          return { ...prev, y: prev.y + 1 };
        });
      } else if (e.key === " ") {
        e.preventDefault();
        setCurrentBlock((prev) => {
          if (!prev) return prev;
          let newY = prev.y;
          while (newY < GRID_HEIGHT - 1 && (!grid[newY + 1] || grid[newY + 1][prev.x] === null)) {
            newY++;
          }
          return { ...prev, y: newY };
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStarted, gameOver, currentBlock, grid]);

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLines(0);
    setGrid(Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(null)));
    setCurrentBlock(null);
  };

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center gap-8 w-full min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
        <div className="text-center max-w-md">
          <h2 className="text-4xl font-bold text-white mb-3">🧊 Aesthetic Puzzle Drops</h2>
          <p className="text-gray-400 mb-6">A clean Tetris-like puzzle. Clear rows and climb the leaderboard!</p>
          <div className="bg-indigo-900 bg-opacity-20 border border-indigo-500 border-opacity-30 rounded-lg p-4 text-left text-sm text-gray-300">
            <p className="font-semibold text-indigo-300 mb-2">How to play:</p>
            <ul className="space-y-1 text-xs">
              <li>← / → Move left/right</li>
              <li>↓ Drop faster</li>
              <li>Space for hard drop</li>
              <li>Clear full rows to score!</li>
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
          <div className="text-5xl font-bold text-red-500 mb-4">Game Over!</div>
          <div className="text-2xl font-bold text-white mb-2">Score: {score}</div>
          <div className="text-gray-400 mb-6">Lines: {lines} • Difficulty: {difficulty}</div>
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
    <div className="flex flex-col items-center gap-6 w-full p-6 bg-gradient-to-b from-gray-900 to-black min-h-screen">
      {/* Title & Stats */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-1">🧊 Aesthetic Puzzle Drops</h2>
        <p className="text-gray-400 text-sm">← → Move • ↓ Drop • Space Hard Drop</p>
      </div>

      <div className="grid grid-cols-4 gap-3 w-full max-w-sm">
        <div className="bg-indigo-900 bg-opacity-30 border border-indigo-500 border-opacity-30 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400">Score</div>
          <div className="text-xl font-bold text-indigo-300">{score}</div>
        </div>
        <div className="bg-indigo-900 bg-opacity-30 border border-indigo-500 border-opacity-30 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400">Lines</div>
          <div className="text-xl font-bold text-cyan-300">{lines}</div>
        </div>
        <div className="bg-indigo-900 bg-opacity-30 border border-indigo-500 border-opacity-30 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400">Difficulty</div>
          <div className="text-xl font-bold text-purple-300">{difficulty}</div>
        </div>
        <div className="bg-indigo-900 bg-opacity-30 border border-indigo-500 border-opacity-30 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400">Speed</div>
          <div className="text-xl font-bold text-pink-300">{dropSpeeds[difficulty]}ms</div>
        </div>
      </div>

      {/* Game Grid */}
      <div className="bg-gray-900 border-2 border-indigo-500 border-opacity-40 rounded-lg p-2" style={{ width: "fit-content" }}>
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID_WIDTH}, 1fr)` }}>
          {grid.map((row, y) =>
            row.map((cell, x) => {
              const isCurrentBlock = currentBlock && currentBlock.x === x && currentBlock.y === y;
              return (
                <div
                  key={`${y}-${x}`}
                  className={`w-7 h-7 rounded border border-gray-700 transition-all ${
                    isCurrentBlock
                      ? `bg-gradient-to-br ${currentBlock.colorClass}`
                      : cell
                        ? `bg-gradient-to-br ${cell}`
                        : "bg-gray-800"
                  }`}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
