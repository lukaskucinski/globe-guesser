import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../../stores/gameStore";

export function ScoreDisplay() {
  const score = useGameStore((s) => s.score);
  const streak = useGameStore((s) => s.streak);
  const [floatingPoints, setFloatingPoints] = useState<number | null>(null);
  const [animateScore, setAnimateScore] = useState(false);
  const prevScore = useRef(score);

  useEffect(() => {
    const diff = score - prevScore.current;
    prevScore.current = score;
    if (diff > 0) {
      setFloatingPoints(diff);
      setAnimateScore(true);
      const t1 = setTimeout(() => setFloatingPoints(null), 1200);
      const t2 = setTimeout(() => setAnimateScore(false), 400);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [score]);

  return (
    <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 pointer-events-none">
      <div className="bg-card backdrop-blur-lg border border-border rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 shadow-[--color-card-shadow] text-center relative">
        <p className={`text-xl sm:text-2xl font-bold text-gold transition-transform duration-200 ${
          animateScore ? "animate-score-pop" : ""
        }`}>
          {score}
        </p>
        <p className="text-xs text-text-dim">
          {streak > 1 ? (
            <span className={`text-accent font-semibold ${
              streak >= 3 ? "drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]" : ""
            }`}>
              {streak}x streak
            </span>
          ) : (
            "points"
          )}
        </p>

        {/* Floating points */}
        {floatingPoints !== null && (
          <div className="absolute -top-2 left-1/2 animate-float-up pointer-events-none">
            <span className="text-sm font-bold text-correct whitespace-nowrap">
              +{floatingPoints}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
