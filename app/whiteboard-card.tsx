'use client';

import type { Card, CardColor } from './whiteboard-store';

const colorClasses: Record<CardColor, string> = {
  red: 'bg-red-100 border-red-300',
  blue: 'bg-blue-100 border-blue-300',
  green: 'bg-green-100 border-green-300',
  yellow: 'bg-yellow-100 border-yellow-300',
};

export function WhiteboardCard({ card }: { card: Card }) {
  return (
    <div
      className={`relative rounded-lg border-2 px-3 py-2 text-sm font-medium shadow-sm ${colorClasses[card.color]}`}
    >
      <div className="text-zinc-900">{card.text}</div>
      {card.tag && (
        <div className="absolute -right-1 -top-1 text-lg">{card.tag}</div>
      )}
    </div>
  );
}
