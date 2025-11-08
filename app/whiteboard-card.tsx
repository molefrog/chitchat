"use client";

import { motion } from "motion/react";
import type { Card, CardColor } from "./whiteboard-store";

const colorClasses: Record<CardColor, string> = {
  red: "bg-red-200 border-white",
  blue: "bg-blue-200 border-white",
  green: "bg-green-200 border-white",
  yellow: "bg-yellow-200 border-white",
};

export function WhiteboardCard({ card }: { card: Card }) {
  return (
    <motion.div
      layoutId={card.id}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className={`relative rounded-lg border-5 px-3 py-2 text-sm font-medium aspect-2/3 shadow-ds-border flex items-center justify-center ${
        colorClasses[card.color]
      }`}
    >
      <div className="text-zinc-900 text-base font-bold [text-shadow:0.5px_0.5px_0px_rgba(255,255,255,1)] text-center rotate-3">
        {card.text}
      </div>
      {card.tag && (
        <div className="absolute -right-5 -top-4 text-xl rounded-full bg-white h-10 w-10 flex items-center justify-center border border-zinc-300">
          {card.tag}
        </div>
      )}
    </motion.div>
  );
}
