import { useGameStore } from "../../stores/gameStore";

export function LivesDisplay() {
  const lives = useGameStore((s) => s.lives);
  const wrongGuessMode = useGameStore((s) => s.settings?.wrongGuessMode);

  if (wrongGuessMode !== "lives") return null;

  return (
    <div className="absolute top-6 left-6 z-20 pointer-events-none">
      <div className="bg-surface/80 backdrop-blur-lg border border-border rounded-xl px-4 py-2 shadow-lg">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
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
