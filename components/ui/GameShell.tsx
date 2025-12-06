"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { NeonButton } from "./NeonButton";

export function GameShell({
  title,
  subtitle,
  children,
  showBackButton = true,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showBackButton?: boolean;
}) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {showBackButton && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/" className="inline-block">
            <NeonButton variant="ghost" size="sm">
              ← Back to Dashboard
            </NeonButton>
          </Link>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-10 text-center md:text-left"
      >
        <h1 className="text-4xl md:text-6xl font-display font-bold bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl">
            {subtitle}
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-3xl bg-dark-card/50 border border-dark-border shadow-[0_0_50px_rgba(0,0,0,0.3)] p-6 md:p-10 backdrop-blur-xl"
      >
        {children}
      </motion.div>
    </div>
  );
}
