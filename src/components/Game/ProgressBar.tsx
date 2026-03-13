import { useGameStore } from "../../stores/gameStore";

export function ProgressBar() {
  const currentIndex = useGameStore((s) => s.currentIndex);
  const totalCountries = useGameStore((s) => s.totalCountries);

  if (totalCountries === 0) return null;

  const pct = (currentIndex / totalCountries) * 100;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-64 max-w-[80vw]">
      <div className="bg-surface/80 backdrop-blur-lg border border-border rounded-xl px-4 py-2 shadow-lg">
        <div className="flex justify-between text-xs text-text-dim mb-1.5">
          <span>{currentIndex} / {totalCountries}</span>
          <span>{Math.round(pct)}%</span>
        </div>
        <div className="h-1.5 bg-surface-light rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
