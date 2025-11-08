"use client";

import { AnimatePresence, motion } from "motion/react";
import { useWhiteboardStore } from "./whiteboard-store";
import { WhiteboardCard } from "./whiteboard-card";

export function Whiteboard() {
  const clusters = useWhiteboardStore((state) => state.clusters);
  const caption = useWhiteboardStore((state) => state.caption);

  return (
    <div className="relative flex h-full w-full flex-col rounded-lg">
      <AnimatePresence mode="wait">
        {caption && (
          <motion.div
            key={caption}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 z-10 max-w-3xl"
          >
            <div className="text-center text-2xl font-medium text-zinc-900 bg-zinc-100/95 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg">
              {caption}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex-1 overflow-y-auto flex items-center justify-center">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${Math.min(clusters.length, 2)}, minmax(0, 1fr))`,
          }}
        >
          {clusters.map((cluster) => (
            <div key={cluster.name} className="flex flex-col gap-2 rounded-2xl bg-slate-400/10 p-4">
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
