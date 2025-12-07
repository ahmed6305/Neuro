"use client";
import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

type Props = HTMLMotionProps<"button"> & {
  variant?: "primary" | "secondary" | "success" | "danger" | "ghost" | "cyan" | "pink";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
};

export function NeonButton({
  variant = "primary",
  size = "md",
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-bold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const variants = {
    primary:
      "bg-neon-purple text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-neon-purple/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] hover:bg-neon-purple/90 ring-neon-purple",
    secondary:
      "bg-neon-blue text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-neon-blue/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] hover:bg-neon-blue/90 ring-neon-blue",
    success:
      "bg-neon-green text-black shadow-[0_0_20px_rgba(34,197,94,0.5)] border border-neon-green/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.7)] hover:bg-neon-green/90 ring-neon-green",
    danger:
      "bg-neon-red text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-neon-red/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.7)] hover:bg-neon-red/90 ring-neon-red",
    cyan: "bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] hover:bg-cyan-500/90 ring-cyan-400",
    pink: "bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)] border border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.7)] hover:bg-pink-500/90 ring-pink-500",
    ghost:
      "bg-transparent border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white hover:bg-slate-800 ring-slate-500",
  };

  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: 1.05 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.95 } : {}}
      className={`${base} ${sizeClasses[size]} ${variants[variant]} ${className || ""}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
