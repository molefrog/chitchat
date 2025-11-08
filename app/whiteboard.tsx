"use client";

import { AnimatePresence } from "motion/react";
import { useWhiteboardStore } from "./whiteboard-store";
import { WhiteboardCard } from "./whiteboard-card";

export function Whiteboard() {
  const clusters = useWhiteboardStore((state) => state.clusters);

  return (
    <div className="flex h-full w-full flex-col rounded-lg">
      <div className="flex-1 overflow-y-auto flex items-center justify-center">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${Math.min(clusters.length, 2)}, minmax(0, 1fr))`,
          }}
        >
          {clusters.map((cluster) => (
            <div
              key={cluster.name}
              className="flex flex-col gap-2 rounded-2xl bg-slate-400/10 p-4"
            >
              <div className="text-base font-bold uppercase tracking-wide text-zinc-600 mb-2">
                {cluster.name}
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                <AnimatePresence mode="popLayout">
                  {cluster.props.map((card) => (
                    <WhiteboardCard key={card.id} card={card} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
