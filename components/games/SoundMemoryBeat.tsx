"use client";
import React, { useState, useRef, useEffect } from "react";
import { NeonButton } from "../ui/NeonButton";
import { NeonCard } from "../ui/NeonCard";
import { VictoryBanner } from "../ui/VictoryBanner";
import { useSound } from "../../lib/useSound";

type Difficulty = "Easy" | "Medium" | "Hard" | "Critical";

interface AudioHelper {
  playNote: (index: number, duration: number) => void;
  playSuccess: () => void;
  playError: () => void;
}

const nextDifficulty: Record<Difficulty, Difficulty | null> = {
  Easy: "Medium",
  Medium: "Hard",
  Hard: "Critical",
  Critical: null,
};

const playTimes: Record<Difficulty, number> = {
  Easy: 600,
  Medium: 400,
  Hard: 250,
  Critical: 150,
};

const padColors = ["from-red-500 to-red-600", "from-blue-500 to-blue-600", "from-yellow-500 to-yellow-600", "from-green-500 to-green-600"];
const padLabels = ["RED", "BLUE", "YELLOW", "GREEN"];
const frequencies = [261.63, 293.66, 349.23, 439.99]; // C, D, F, A notes

const createAudioHelper = (): AudioHelper => {
  let audioContext: AudioContext | null = null;

  const getContext = () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext;
  };

  return {
    playNote: (index: number, duration: number) => {
      try {
        const ctx = getContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = frequencies[index];
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration / 1000);
      } catch (e) {
        console.error("Audio error:", e);
      }
    },
    playSuccess: () => {
      try {
        const ctx = getContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.setValueAtTime(0, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
      } catch (e) {
        console.error("Audio error:", e);
      }
    },
    playError: () => {
      try {
        const ctx = getContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 100;
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.setValueAtTime(0, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } catch (e) {
        console.error("Audio error:", e);
      }
    },
  };
};

export default function SoundMemoryBeat() {
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [canInteract, setCanInteract] = useState(false);

  const audioHelperRef = useRef(createAudioHelper());

  // Play sequence when updated
  useEffect(() => {
    if (!gameStarted || gameOver || sequence.length === 0 || isPlayingSequence) return;

    const playSequence = async () => {
      setIsPlayingSequence(true);
      setCanInteract(false);
      setPlayerSequence([]);
      setMessage("Watch...");

      for (let i = 0; i < sequence.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        const noteIndex = sequence[i];
        setActiveButton(noteIndex);
        audioHelperRef.current.playNote(noteIndex, 300);
        await new Promise((resolve) => setTimeout(resolve, 300));
        setActiveButton(null);
      }

      setIsPlayingSequence(false);
      setCanInteract(true);
      setMessage("Your turn!");
    };

    playSequence();
  }, [sequence, gameStarted, gameOver, isPlayingSequence]);

  // Check player sequence
  useEffect(() => {
    if (!canInteract || playerSequence.length === 0) return;

    const lastIndex = playerSequence.length - 1;
    if (playerSequence[lastIndex] !== sequence[lastIndex]) {
      // Wrong!
      audioHelperRef.current.playError();
      setGameOver(true);
      setMessage("❌ Game Over!");
      return;
    }

    if (playerSequence.length === sequence.length) {
      // Correct sequence!
      audioHelperRef.current.playSuccess();
      setLevel((l) => l + 1);
      setScore((s) => s + 10);
      setMessage("✅ Correct!");

      setTimeout(() => {
        setSequence((seq) => [...seq, Math.floor(Math.random() * 4)]);
      }, 1000);
    }
  }, [playerSequence, sequence, canInteract]);

  const handlePadClick = (index: number) => {
    if (!canInteract || isPlayingSequence || gameOver) return;

    setActiveButton(index);
    audioHelperRef.current.playNote(index, 150);
    setPlayerSequence((seq) => [...seq, index]);

    setTimeout(() => {
      setActiveButton(null);
    }, 150);
  };

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setGameStarted(true);
    setGameOver(false);
    setSequence([Math.floor(Math.random() * 4)]);
    setPlayerSequence([]);
    setLevel(1);
    setScore(0);
    setMessage("Watch...");
    setCanInteract(false);
  };

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center gap-8 w-full min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
        <div className="text-center max-w-md">
          <h2 className="text-4xl font-bold text-white mb-3">🎵 Sound Memory Beat</h2>
          <p className="text-gray-400 mb-6">A Simon Says game with unique tones for each button</p>
          <div className="bg-indigo-900 bg-opacity-20 border border-indigo-500 border-opacity-30 rounded-lg p-4 text-left text-sm text-gray-300">
            <p className="font-semibold text-indigo-300 mb-2">How to play:</p>
            <ul className="space-y-1 text-xs">
              <li>• Watch the pattern light up</li>
              <li>• Listen to the unique tone</li>
              <li>• Repeat the sequence by clicking pads</li>
              <li>• Each round adds another step</li>
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
          <div className="text-5xl font-bold text-red-500 mb-4">Game Over!</div>
          <div className="text-2xl font-bold text-white mb-2">Final Score: {score}</div>
          <div className="text-gray-400 mb-6">Level Reached: {level} • Difficulty: {difficulty}</div>
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
              Next Difficulty
            </NeonButton>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-1">🎵 Sound Memory Beat</h2>
        <p className="text-gray-400 text-sm">Level {level} • Difficulty: {difficulty}</p>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <div className="bg-indigo-900 bg-opacity-30 border border-indigo-500 border-opacity-30 rounded-lg px-4 py-2 text-center">
          <div className="text-xs text-gray-400">Score</div>
          <div className="text-2xl font-bold text-indigo-300">{score}</div>
        </div>
        <div className="bg-indigo-900 bg-opacity-30 border border-indigo-500 border-opacity-30 rounded-lg px-4 py-2 text-center">
          <div className="text-xs text-gray-400">Sequence</div>
          <div className="text-2xl font-bold text-purple-300">{sequence.length}</div>
        </div>
      </div>

      {/* Message */}
      <div className="text-lg font-bold text-center h-6" style={{ color: message.includes("✅") ? "#34d399" : message.includes("❌") ? "#f87171" : "#9ca3af" }}>
        {message}
      </div>

      {/* Game Pads */}
      <div className="grid grid-cols-2 gap-6 max-w-sm">
        {padLabels.map((label, idx) => (
          <button
            key={idx}
            onClick={() => handlePadClick(idx)}
            disabled={!canInteract || isPlayingSequence || gameOver}
            className={`
              w-24 h-24 rounded-lg font-bold text-white text-lg shadow-lg
              transition-all transform
              bg-gradient-to-br ${padColors[idx]}
              ${activeButton === idx ? "ring-4 ring-white scale-95" : "hover:scale-105"}
              ${!canInteract || isPlayingSequence || gameOver ? "opacity-75 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Sequence Display */}
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 max-w-sm">
        <div className="text-xs text-gray-400 mb-2 text-center">Your Sequence ({playerSequence.length}/{sequence.length})</div>
        <div className="flex flex-wrap gap-2 justify-center">
          {playerSequence.map((pad, idx) => (
            <div key={idx} className={`w-3 h-3 rounded-full bg-gradient-to-br ${padColors[pad]}`} />
          ))}
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center">
        {isPlayingSequence ? "Listening to the sequence..." : canInteract ? "Your turn - click the pads!" : "Get ready..."}
      </div>
    </div>
  );
}
