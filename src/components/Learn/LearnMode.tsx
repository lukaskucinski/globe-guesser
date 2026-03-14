import { useRef, useState, useCallback, useEffect } from "react";
import { GlobeMap, type GlobeMapHandle } from "../Globe/GlobeMap";
import { Button } from "../UI/Button";
import { useGameStore } from "../../stores/gameStore";
import { COUNTRY_MAP } from "../../data/countries";
import { REGION_LABELS } from "../../data/regions";

export function LearnMode() {
  const globeRef = useRef<GlobeMapHandle>(null);
  const setScreen = useGameStore((s) => s.setScreen);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedCountry) setSelectedCountry(null);
        else setScreen("menu");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedCountry, setScreen]);

  const handleHover = useCallback((iso: string | null) => {
    setHoveredCountry(iso);
  }, []);

  const handleClick = useCallback((iso: string) => {
    setSelectedCountry(iso);
    const country = COUNTRY_MAP.get(iso);
    if (country) {
      globeRef.current?.flyTo(country.labelLngLat, 4);
    }
  }, []);

  const country = selectedCountry ? COUNTRY_MAP.get(selectedCountry) : null;
  const hovered = hoveredCountry ? COUNTRY_MAP.get(hoveredCountry) : null;

  return (
    <div className="relative w-full h-full">
      <GlobeMap
        ref={globeRef}
        spinning={true}
        interactive={true}
        onCountryClick={handleClick}
        onCountryHover={handleHover}
      />

      {/* Back button */}
      <div className="absolute top-6 left-6 z-20">
        <Button variant="secondary" size="md" onClick={() => setScreen("menu")}>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Menu
          </span>
        </Button>
      </div>

      {/* Hover tooltip */}
      {hovered && !selectedCountry && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-surface/80 backdrop-blur-lg border border-border rounded-lg px-4 py-2 shadow-lg">
            <p className="text-lg font-semibold text-text">{hovered.name}</p>
          </div>
        </div>
      )}

      {/* Selected country info card */}
      {country && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-80 max-w-[90vw]">
          <div className="bg-surface/90 backdrop-blur-xl border border-border rounded-xl p-5 shadow-2xl">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-text">{country.name}</h3>
              <button
                className="text-text-dim hover:text-text text-lg cursor-pointer"
                onClick={() => setSelectedCountry(null)}
              >
                &#x2715;
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-text-dim">Region</p>
                <p className="text-text">{REGION_LABELS[country.region]}</p>
              </div>
              <div>
                <p className="text-text-dim">Subregion</p>
                <p className="text-text">{country.subregion}</p>
              </div>
              <div>
                <p className="text-text-dim">Population</p>
                <p className="text-text">
                  {country.population.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-text-dim">Area</p>
                <p className="text-text">
                  {country.area_km2.toLocaleString()} km&sup2;
                </p>
              </div>
              <div>
                <p className="text-text-dim">Difficulty</p>
                <p className="text-text">
                  {country.difficulty === 1
                    ? "Easy"
                    : country.difficulty === 2
                      ? "Medium"
                      : "Hard"}
                </p>
              </div>
              <div>
                <p className="text-text-dim">Points</p>
                <p className="text-gold font-semibold">
                  {country.basePoints}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
