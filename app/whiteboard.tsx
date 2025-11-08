'use client';

import { useWhiteboardStore, type Card, type CardColor } from './whiteboard-store';

const colorClasses: Record<CardColor, string> = {
  red: 'bg-red-100 border-red-300 dark:bg-red-900 dark:border-red-700',
  blue: 'bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-700',
  green: 'bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700',
  yellow: 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900 dark:border-yellow-700',
};

function CardComponent({ card }: { card: Card }) {
  return (
    <div
      className={`relative rounded-lg border-2 px-3 py-2 text-sm font-medium shadow-sm ${colorClasses[card.color]}`}
    >
      <div className="text-zinc-900 dark:text-zinc-100">{card.text}</div>
      {card.tag && (
        <div className="absolute -right-1 -top-1 text-lg">{card.tag}</div>
      )}
    </div>
  );
}

export function Whiteboard() {
  const clusters = useWhiteboardStore((state) => state.clusters);

  return (
    <div className="flex h-full w-96 flex-col rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex-1 overflow-y-auto p-4">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${Math.min(clusters.length, 3)}, minmax(0, 1fr))`,
            justifyContent: 'center',
          }}
        >
          {clusters.map((cluster) => (
            <div
              key={cluster.id}
              className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800"
            >
              {cluster.label && (
                <div className="text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                  {cluster.label}
                </div>
              )}
              <div className="flex flex-col gap-2">
                {cluster.props.map((card) => (
                  <CardComponent key={card.id} card={card} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
