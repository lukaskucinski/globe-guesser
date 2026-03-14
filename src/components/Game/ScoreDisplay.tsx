import { useGameStore } from "../../stores/gameStore";

export function ScoreDisplay() {
  const score = useGameStore((s) => s.score);
  const streak = useGameStore((s) => s.streak);

  return (
    <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 pointer-events-none">
      <div className="bg-surface/80 backdrop-blur-lg border border-border rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 shadow-lg text-center">
        <p className="text-xl sm:text-2xl font-bold text-gold">{score}</p>
        <p className="text-xs text-text-dim">
          {streak > 1 && (
            <span className="text-accent">
              {streak}x streak
            </span>
          )}
          {streak <= 1 && "points"}
        </p>
      </div>
    </div>
  );
}
