"use client";

import type { Card, CardColor } from "./whiteboard-store";

const colorClasses: Record<CardColor, string> = {
  red: "bg-red-200 border-white",
  blue: "bg-blue-200 border-white",
  green: "bg-green-200 border-white",
  yellow: "bg-yellow-200 border-white",
};

export function WhiteboardCard({ card }: { card: Card }) {
  return (
    <div
      className={`relative rounded-lg border-5 px-3 py-2 text-sm font-medium aspect-2/3 shadow-ds-border flex items-center justify-center ${
        colorClasses[card.color]
      }`}
    >
      <div className="text-zinc-900 text-lg font-bold [text-shadow:0.5px_0.5px_0px_rgba(255,255,255,1)] text-center">
        {card.text}
      </div>
      {card.tag && <div className="absolute -right-1 -top-1 text-lg">{card.tag}</div>}
    </div>
  );
}
