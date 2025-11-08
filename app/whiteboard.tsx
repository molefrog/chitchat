"use client";

import { useWhiteboardStore } from "./whiteboard-store";
import { WhiteboardCard } from "./whiteboard-card";

export function Whiteboard() {
  const clusters = useWhiteboardStore((state) => state.clusters);

  return (
    <div className="flex h-full w-full flex-col rounded-lg">
      <div className="flex-1 overflow-y-auto">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${Math.min(clusters.length, 2)}, minmax(0, 1fr))`,
            justifyContent: "center",
          }}
        >
          {clusters.map((cluster) => (
            <div key={cluster.id} className="flex flex-col gap-2 rounded-2xl  bg-slate-400/10 p-4">
              {cluster.label && (
                <div className="text-base font-bold uppercase tracking-wide text-zinc-600 mb-2">
                  {cluster.label}
                </div>
              )}
              <div className="grid grid-cols-4 gap-1.5">
                {cluster.props.map((card) => (
                  <WhiteboardCard key={card.id} card={card} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
