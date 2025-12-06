"use client";
import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

type Props = HTMLMotionProps<"div">;

export function NeonCard({ className, children, ...props }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl bg-dark-card/80 border border-dark-border shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:border-neon-purple/30 backdrop-blur-xl transition-all duration-300 ${className || ""}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
