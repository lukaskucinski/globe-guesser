import { useGameStore } from "../../stores/gameStore";

export function ProgressBar() {
  const currentIndex = useGameStore((s) => s.currentIndex);
  const totalCountries = useGameStore((s) => s.totalCountries);

  if (totalCountries === 0) return null;

  const pct = (currentIndex / totalCountries) * 100;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-72 max-w-[80vw]">
      <div className="bg-card backdrop-blur-lg border border-glass-border rounded-xl px-4 py-2.5 shadow-[--color-card-shadow]">
        <div className="flex justify-between text-xs text-text-dim mb-2">
          <span className="font-medium">{currentIndex} / {totalCountries}</span>
          <span className="font-medium">{Math.round(pct)}%</span>
        </div>
        <div className="h-2 bg-surface-light/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-accent-dim rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max(pct, 1)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
