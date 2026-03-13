import { useGameStore } from "../../stores/gameStore";

export function ScoreDisplay() {
  const score = useGameStore((s) => s.score);
  const streak = useGameStore((s) => s.streak);

  return (
    <div className="absolute top-6 right-6 z-20 pointer-events-none">
      <div className="bg-surface/80 backdrop-blur-lg border border-border rounded-xl px-4 py-2 shadow-lg text-right">
        <p className="text-2xl font-bold text-gold">{score}</p>
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
