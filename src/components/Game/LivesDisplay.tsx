import { useGameStore } from "../../stores/gameStore";

const LIVES_MODES = new Set(["sudden_death", "3lives", "5lives"]);

export function LivesDisplay() {
  const lives = useGameStore((s) => s.lives);
  const settings = useGameStore((s) => s.settings);

  if (!settings || !LIVES_MODES.has(settings.wrongGuessMode)) return null;

  const totalLives = settings.wrongGuessMode === "sudden_death" ? 1
    : settings.wrongGuessMode === "3lives" ? 3
    : 5;

  return (
    <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20 pointer-events-none">
      <div className="bg-card backdrop-blur-lg border border-border rounded-xl px-4 py-2 shadow-[--color-card-shadow]">
        <div className="flex gap-1.5">
          {Array.from({ length: totalLives }, (_, i) => (
            <span
              key={i}
              className={`text-xl transition-all duration-300 ${
                i < lives ? "text-wrong opacity-100 scale-100" : "text-text-dim opacity-30 scale-75"
              }`}
            >
              &#x2764;
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
