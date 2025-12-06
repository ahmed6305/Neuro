"use client";
import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

type Props = HTMLMotionProps<"button"> & {
  variant?: "primary" | "secondary" | "success" | "danger" | "ghost" | "cyan" | "pink";
  size?: "sm" | "md" | "lg";
};

export function NeonButton({
  variant = "primary",
  size = "md",
  className,
  children,
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
      "bg-neon-purple text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-neon-purple/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] hover:bg-neon-purple/90",
    secondary:
      "bg-neon-blue text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-neon-blue/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] hover:bg-neon-blue/90",
    success:
      "bg-neon-green text-black shadow-[0_0_20px_rgba(34,197,94,0.5)] border border-neon-green/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.7)] hover:bg-neon-green/90",
    danger:
      "bg-neon-red text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-neon-red/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.7)] hover:bg-neon-red/90",
    cyan: "bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] hover:bg-cyan-500/90",
    pink: "bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)] border border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.7)] hover:bg-pink-500/90",
    ghost:
      "bg-transparent border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white hover:bg-slate-800",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${base} ${sizeClasses[size]} ${variants[variant]} ${className || ""}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
