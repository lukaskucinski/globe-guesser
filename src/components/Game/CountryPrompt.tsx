import { useGameStore } from "../../stores/gameStore";
import { COUNTRY_MAP } from "../../data/countries";

export function CountryPrompt() {
  const queue = useGameStore((s) => s.queue);
  const currentIndex = useGameStore((s) => s.currentIndex);

  const iso = queue[currentIndex];
  const country = iso ? COUNTRY_MAP.get(iso) : null;

  if (!country) return null;

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
      <div className="bg-surface/80 backdrop-blur-lg border border-border rounded-xl px-6 py-3 shadow-lg">
        <p className="text-text-dim text-xs uppercase tracking-wider mb-1 text-center">
          Find this country
        </p>
        <p className="text-2xl font-bold text-text text-center">
          {country.name}
        </p>
      </div>
    </div>
  );
}
