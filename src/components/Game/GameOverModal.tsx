import { useGameStore } from "../../stores/gameStore";
import { Button } from "../UI/Button";

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
  const accuracy =
    totalCountries > 0 ? Math.round((currentIndex / totalCountries) * 100) : 0;
  const isComplete = currentIndex >= totalCountries;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface/95 backdrop-blur-xl border border-border rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-text mb-1">
            {isComplete ? "Amazing!" : "Game Over"}
          </h2>
          <p className="text-text-dim text-sm">
            {isComplete
              ? "You found every country!"
              : settings?.wrongGuessMode === "lives"
                ? "Out of lives"
                : "Time's up!"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-surface-light rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-gold">{score}</p>
            <p className="text-xs text-text-dim">Score</p>
          </div>
          <div className="bg-surface-light rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-accent">
              {currentIndex}/{totalCountries}
            </p>
            <p className="text-xs text-text-dim">Countries</p>
          </div>
          <div className="bg-surface-light rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-correct">{accuracy}%</p>
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
          <Button variant="secondary" className="w-full" onClick={reset}>
            Back to Menu
          </Button>
        </div>
      </div>
    </div>
  );
}
