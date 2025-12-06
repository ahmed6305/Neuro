"use client";
import React from "react";
import { NeonButton } from "./NeonButton";

export function VictoryBanner({
  level,
  score,
  onNext,
  onReplay,
}: {
  level: number;
  score?: number;
  onNext?: () => void;
  onReplay: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative rounded-3xl bg-gradient-to-br from-gray-900/95 to-gray-950/95 border border-purple-500/60 px-6 py-8 md:px-8 md:py-10 shadow-[0_0_50px_rgba(168,85,247,0.8)]">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-purple-500 text-white px-4 py-1 text-xs font-semibold shadow-[0_0_20px_rgba(192,132,252,0.9)]">
            Level {level} cleared! 🎉
          </span>
        </div>

        <div className="mt-6 text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Nice move, Neuro brain 🧠
          </h2>
          {score !== undefined && (
            <p className="text-sm text-gray-300">
              Score:{" "}
              <span className="font-semibold text-purple-400">{score}</span>
            </p>
          )}
          <p className="text-xs text-gray-400">
            Take a breath, then push to the next level.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {onNext && (
            <NeonButton onClick={onNext} variant="primary">
              Next level →
            </NeonButton>
          )}
          <NeonButton onClick={onReplay} variant="secondary">
            Replay this level
          </NeonButton>
        </div>
      </div>
    </div>
  );
}
