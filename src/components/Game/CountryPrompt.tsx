import { useGameStore } from "../../stores/gameStore";
import { COUNTRY_MAP } from "../../data/countries";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function CountryPrompt() {
  const queue = useGameStore((s) => s.queue);
  const currentIndex = useGameStore((s) => s.currentIndex);
  const timeRemaining = useGameStore((s) => s.timeRemaining);
  const timeLimit = useGameStore((s) => s.settings?.timeLimit ?? 0);

  const iso = queue[currentIndex];
  const country = iso ? COUNTRY_MAP.get(iso) : null;

  if (!country) return null;

  const showTimer = timeLimit > 0;
  const isLow = timeRemaining <= 10;

  return (
    <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
      <div className="bg-surface/80 backdrop-blur-lg border border-border rounded-xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg">
        <p className="text-text-dim text-[10px] sm:text-xs uppercase tracking-wider mb-0.5 sm:mb-1 text-center">
          Find this country
        </p>
        <p className="text-lg sm:text-2xl font-bold text-text text-center">
          {country.name}
        </p>
        {showTimer && (
          <p
            className={`text-sm font-mono font-bold text-center mt-1 ${
              isLow ? "text-wrong animate-pulse" : "text-text-dim"
            }`}
          >
            {formatTime(timeRemaining)}
          </p>
        )}
      </div>
    </div>
  );
}
