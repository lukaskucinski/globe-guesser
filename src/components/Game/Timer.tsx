import { useGameStore } from "../../stores/gameStore";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function Timer() {
  const timeRemaining = useGameStore((s) => s.timeRemaining);
  const timeLimit = useGameStore((s) => s.settings?.timeLimit ?? 0);

  if (timeLimit === 0) return null;

  const isLow = timeRemaining <= 10;

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
      <div
        className={`bg-surface/80 backdrop-blur-lg border rounded-lg px-3 py-1 shadow-lg text-center transition-colors ${
          isLow ? "border-wrong text-wrong" : "border-border text-text-dim"
        }`}
      >
        <p className={`text-lg font-mono font-bold ${isLow ? "animate-pulse" : ""}`}>
          {formatTime(timeRemaining)}
        </p>
      </div>
    </div>
  );
}
