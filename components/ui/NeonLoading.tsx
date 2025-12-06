"use client";
import React from "react";

export function NeonSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div className="h-12 w-12 rounded-full border-3 border-purple-500/30 border-t-purple-500 animate-spin shadow-[0_0_20px_rgba(168,85,247,0.7)]" />
    </div>
  );
}

export function NeonSkeleton({
  className = "",
  count = 3,
}: {
  className?: string;
  count?: number;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 h-4"
        >
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
        </div>
      ))}
    </div>
  );
}
