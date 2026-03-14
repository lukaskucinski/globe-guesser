import { useEffect, useState } from "react";
import { useGameStore } from "../../stores/gameStore";
import { Button } from "../UI/Button";

function getPerformanceTier(pct: number, isComplete: boolean) {
  if (isComplete) return { title: "Perfect!", emoji: "\u{1F3C6}" };
  if (pct >= 70) return { title: "Great Job!", emoji: "\u{1F31F}" };
  if (pct >= 30) return { title: "Good Try!", emoji: "\u{1F44D}" };
  return { title: "Game Over", emoji: "" };
}

function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // ease-out quad
      const eased = 1 - (1 - t) * (1 - t);
      setValue(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export function GameOverModal() {
  const score = useGameStore((s) => s.score);
  const currentIndex = useGameStore((s) => s.currentIndex);
  const totalCountries = useGameStore((s) => s.totalCountries);
  const startedAt = useGameStore((s) => s.startedAt);
  const settings = useGameStore((s) => s.settings);
  const startGame = useGameStore((s) => s.startGame);
  const reset = useGameStore((s) => s.reset);

  const elapsed = Math.round((Date.now() - startedAt) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const pct =
    totalCountries > 0 ? Math.round((currentIndex / totalCountries) * 100) : 0;
  const isComplete = currentIndex >= totalCountries;

  const animatedScore = useCountUp(score);
  const tier = getPerformanceTier(pct, isComplete);

  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const dateStr = new Date().toISOString().split("T")[0];
    const blocks = Array.from({ length: 10 }, (_, i) => {
      const threshold = (i + 1) * 10;
      return pct >= threshold ? "\u{1F7E9}" : "\u{2B1C}";
    }).join("");

    const text = [
      `Globe Guesser ${settings?.isDaily ? "Daily " : ""}${dateStr}`,
      `${tier.emoji} ${tier.title}`,
      `Score: ${score} | ${currentIndex}/${totalCountries} (${pct}%)`,
      `Time: ${minutes}:${String(seconds).padStart(2, "0")}`,
      blocks,
    ].join("\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface/95 backdrop-blur-xl border border-border rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl animate-menu-enter">
        <div className="text-center mb-6">
          {tier.emoji && (
            <p className="text-4xl mb-2">{tier.emoji}</p>
          )}
          <h2 className="text-3xl font-bold text-text mb-1">
            {tier.title}
          </h2>
          <p className="text-text-dim text-sm">
            {isComplete
              ? "You found every country!"
              : settings && ["sudden_death", "3lives", "5lives"].includes(settings.wrongGuessMode)
                ? "Out of lives"
                : settings?.timeLimit
                  ? "Time's up!"
                  : "Better luck next time!"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-surface-light rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-gold">{animatedScore}</p>
            <p className="text-xs text-text-dim">Score</p>
          </div>
          <div className="bg-surface-light rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-accent">
              {currentIndex}/{totalCountries}
            </p>
            <p className="text-xs text-text-dim">Countries</p>
          </div>
          <div className="bg-surface-light rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-correct">{pct}%</p>
            <p className="text-xs text-text-dim">Progress</p>
          </div>
          <div className="bg-surface-light rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-text">
              {minutes}:{String(seconds).padStart(2, "0")}
            </p>
            <p className="text-xs text-text-dim">Time</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {settings && (
            <Button
              size="lg"
              className="w-full"
              onClick={() => startGame(settings)}
            >
              Play Again
            </Button>
          )}
          <Button variant="secondary" className="w-full" onClick={handleShare}>
            {copied ? "Copied!" : "Share Results"}
          </Button>
          <Button variant="ghost" className="w-full" onClick={reset}>
            Back to Menu
          </Button>
        </div>
      </div>
    </div>
  );
}
