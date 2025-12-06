"use client";
import React, { useState, useEffect } from "react";

type Difficulty = "Easy" | "Medium" | "Hard" | "Critical";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}

// Separate question pools by difficulty
const easyQuestions: Question[] = [
  { id: "e1", text: "🐱 + 🐶 = ?", options: ["enemies", "pets", "mammals", "animals"], correctIndex: 1 },
  { id: "e2", text: "🌙 shows at?", options: ["morning", "noon", "night", "sunset"], correctIndex: 2 },
  { id: "e3", text: "❤️ means?", options: ["anger", "joy", "love", "sadness"], correctIndex: 2 },
  { id: "e4", text: "🍎 is a?", options: ["vegetable", "fruit", "plant", "food"], correctIndex: 1 },
  { id: "e5", text: "⭐ is in the?", options: ["ocean", "sky", "ground", "space"], correctIndex: 1 },
];

const mediumQuestions: Question[] = [
  { id: "m1", text: "🌞 is to day as 🌙 is to?", options: ["sun", "morning", "night", "star"], correctIndex: 2 },
  { id: "m2", text: "🍕 is food, 🚗 is?", options: ["vehicle", "transport", "machine", "car"], correctIndex: 1 },
  { id: "m3", text: "📚 + 📚 = ?", options: ["reading", "knowledge", "study", "learning"], correctIndex: 1 },
  { id: "m4", text: "⚡ represents?", options: ["slow", "power", "energy", "fast"], correctIndex: 2 },
  { id: "m5", text: "🔥 is to hot as ❄️ is to?", options: ["snow", "winter", "cold", "freeze"], correctIndex: 2 },
  { id: "m6", text: "🎮 makes you feel?", options: ["sad", "bored", "entertained", "tired"], correctIndex: 2 },
];

const hardQuestions: Question[] = [
  { id: "h1", text: "If 🎨 = creativity, then 📝 = ?", options: ["writing", "expression", "communication", "art"], correctIndex: 2 },
  { id: "h2", text: "🏃 is to fast as 🐢 is to?", options: ["slow", "shell", "green", "turtle"], correctIndex: 0 },
  { id: "h3", text: "🌈 after 🌧️ means?", options: ["weather", "hope", "beauty", "spectrum"], correctIndex: 1 },
  { id: "h4", text: "💪 + 🧠 = success? Who agrees?", options: ["no one", "athletes", "thinkers", "both"], correctIndex: 3 },
  { id: "h5", text: "🔒 + 🔑 makes?", options: ["security", "access", "unlock", "complete"], correctIndex: 1 },
  { id: "h6", text: "🌍 needs 🌱 because?", options: ["pretty", "oxygen", "ecosystem", "survival"], correctIndex: 2 },
  { id: "h7", text: "😂 vs 😢 shows?", options: ["emotions", "faces", "feelings", "expressions"], correctIndex: 0 },
];

const criticalQuestions: Question[] = [
  { id: "c1", text: "🧬 is the code of?", options: ["life", "DNA", "science", "cells"], correctIndex: 1 },
  { id: "c2", text: "🌌 + ⏰ = ?", options: ["infinite", "time", "space", "universe"], correctIndex: 3 },
  { id: "c3", text: "🤖 vs 🧠 who wins?", options: ["depends", "robot", "human", "tie"], correctIndex: 0 },
  { id: "c4", text: "🔬 finds truth through?", options: ["opinions", "facts", "method", "evidence"], correctIndex: 3 },
  { id: "c5", text: "🎭 shows that reality is?", options: ["subjective", "objective", "fixed", "changing"], correctIndex: 0 },
  { id: "c6", text: "♾️ means there's no?", options: ["end", "start", "limit", "beginning"], correctIndex: 2 },
  { id: "c7", text: "🔗 of cause & effect = ?", options: ["reality", "chaos", "destiny", "law"], correctIndex: 0 },
  { id: "c8", text: "💭 + 🎨 creates?", options: ["imagination", "reality", "art", "dreams"], correctIndex: 2 },
  { id: "c9", text: "🌀 of existence is?", options: ["random", "ordered", "cyclic", "complex"], correctIndex: 3 },
  { id: "c10", text: "🧲 pulls opposites so?", options: ["repel", "attract", "balance", "conflict"], correctIndex: 2 },
];

const questionsByDifficulty: Record<Difficulty, Question[]> = {
  Easy: easyQuestions,
  Medium: mediumQuestions,
  Hard: hardQuestions,
  Critical: criticalQuestions,
};

const nextDifficulty: Record<Difficulty, Difficulty | null> = {
  Easy: "Medium",
  Medium: "Hard",
  Hard: "Critical",
  Critical: null,
};

export default function MemeLogicChallenge() {
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const questions = questionsByDifficulty[difficulty];
  const currentQuestion = questions[currentQuestionIndex] || questions[0];

  const handleAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    const isCorrect = optionIndex === currentQuestion.correctIndex;

    if (isCorrect) {
      setMessage("✅ Correct!");
      setScore((s) => s + 10);
    } else {
      setMessage("❌ Wrong!");
    }

    setTimeout(() => {
      if (currentQuestionIndex + 1 >= questions.length) {
        setGameOver(true);
      } else {
        setCurrentQuestionIndex((idx) => idx + 1);
        setSelectedAnswer(null);
        setMessage("");
      }
    }, 1000);
  };

  const startGame = (diff: Difficulty) => {
    setDifficulty(diff);
    setGameStarted(true);
    setGameOver(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setMessage("");
  };

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center gap-8 w-full min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
        <div className="text-center max-w-md">
          <h2 className="text-4xl font-bold text-white mb-3">🧠 Meme Logic Challenge</h2>
          <p className="text-gray-400 mb-6">Fun logic puzzles with meme vibes and emoji questions!</p>
          <div className="bg-indigo-900 bg-opacity-20 border border-indigo-500 border-opacity-30 rounded-lg p-4 text-left text-sm text-gray-300">
            <p className="font-semibold text-indigo-300 mb-2">How to play:</p>
            <ul className="space-y-1 text-xs">
              <li>• Read emoji-based logic questions</li>
              <li>• Choose the best answer</li>
              <li>• Each difficulty has unique questions</li>
              <li>• Easy: 5 • Medium: 6 • Hard: 7 • Critical: 10</li>
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
          <div className="text-gray-400 mb-6">Difficulty: {difficulty} • Questions: {questions.length}</div>
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
        <h2 className="text-3xl font-bold text-white mb-1">🧠 Meme Logic Challenge</h2>
        <p className="text-gray-400 text-sm">Question {currentQuestionIndex + 1}/{questions.length}</p>
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

      {/* Question */}
      <div className="w-full max-w-md">
        <div className="p-6 bg-indigo-900 bg-opacity-20 border border-indigo-500 border-opacity-30 rounded-lg text-center mb-6">
          <div className="text-2xl font-bold text-white">{currentQuestion.text}</div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={selectedAnswer !== null}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                selectedAnswer === idx
                  ? idx === currentQuestion.correctIndex
                    ? "bg-green-600 text-white ring-2 ring-green-400"
                    : "bg-red-600 text-white ring-2 ring-red-400"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              } ${selectedAnswer !== null ? "cursor-not-allowed opacity-75" : "cursor-pointer"}`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Message */}
        {message && (
          <div className={`mt-4 text-center text-xl font-bold ${message.includes("✅") ? "text-green-400" : "text-red-400"}`}>
            {message}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md">
        <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-indigo-500 h-2 transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
