import { useRef, useCallback, useEffect, useState } from "react";
import { GlobeMap, type GlobeMapHandle } from "../Globe/GlobeMap";
import { CountryPrompt } from "./CountryPrompt";
import { ScoreDisplay } from "./ScoreDisplay";
import { LivesDisplay } from "./LivesDisplay";
import { Timer } from "./Timer";
import { ProgressBar } from "./ProgressBar";
import { GameOverModal } from "./GameOverModal";
import { useGameStore } from "../../stores/gameStore";
import { useSettingsStore } from "../../stores/settingsStore";
import { useTimer } from "../../hooks/useTimer";
import { COUNTRY_MAP } from "../../data/countries";
import { REGION_CENTERS } from "../../data/regions";
import { setMuted } from "../../lib/sound";
import { Button } from "../UI/Button";

export function GameScreen() {
  const globeRef = useRef<GlobeMapHandle>(null);
  const screen = useGameStore((s) => s.screen);
  const settings = useGameStore((s) => s.settings);
  const queue = useGameStore((s) => s.queue);
  const currentIndex = useGameStore((s) => s.currentIndex);
  const guessedCountries = useGameStore((s) => s.guessedCountries);
  const handleGuess = useGameStore((s) => s.handleGuess);
  const endGame = useGameStore((s) => s.endGame);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const setSoundEnabled = useSettingsStore((s) => s.setSoundEnabled);
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);

  useTimer();

  // Fly to region on game start
  useEffect(() => {
    if (!settings || !globeRef.current) return;
    if (settings.region !== "all") {
      const center = REGION_CENTERS[settings.region];
      globeRef.current.flyTo(center, 3);
    }
  }, [settings]);

  // Clear all states when game restarts
  useEffect(() => {
    globeRef.current?.clearAllStates();
  }, [queue]);

  // Flash wrong guess then clear
  useEffect(() => {
    if (!wrongFlash) return;
    const timer = setTimeout(() => {
      globeRef.current?.setCountryState(wrongFlash, { wrong: false });
      setWrongFlash(null);
    }, 600);
    return () => clearTimeout(timer);
  }, [wrongFlash]);

  const handleCountryClick = useCallback(
    (iso: string) => {
      if (screen !== "playing") return;

      const result = handleGuess(iso);

      if (result === "correct") {
        globeRef.current?.setCountryState(iso, { guessed: true, wrong: false });

        // Fly to next country's region if it's far
        const nextIso = queue[currentIndex + 1];
        if (nextIso) {
          const nextCountry = COUNTRY_MAP.get(nextIso);
          if (nextCountry) {
            globeRef.current?.flyTo(nextCountry.labelLngLat, 3);
          }
        }
      } else if (result === "wrong") {
        globeRef.current?.setCountryState(iso, { wrong: true });
        setWrongFlash(iso);
      }
    },
    [screen, handleGuess, queue, currentIndex]
  );

  return (
    <div className="relative w-full h-full">
      <GlobeMap
        ref={globeRef}
        spinning={false}
        interactive={screen === "playing"}
        onCountryClick={handleCountryClick}
      />

      {screen === "playing" && (
        <>
          <CountryPrompt />
          <ScoreDisplay />
          <LivesDisplay />
          <Timer />
          <ProgressBar />

          {/* Controls: mute + quit */}
          <div className="absolute bottom-6 right-6 z-20 flex gap-2">
            <button
              className="bg-surface/80 backdrop-blur-lg border border-border rounded-lg px-3 py-2 text-sm text-text-dim hover:text-text transition-colors cursor-pointer"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                setMuted(!next);
              }}
              title={soundEnabled ? "Mute" : "Unmute"}
            >
              {soundEnabled ? "\u{1F50A}" : "\u{1F507}"}
            </button>
            <Button variant="ghost" size="sm" onClick={endGame}>
              Quit
            </Button>
          </div>
        </>
      )}

      {screen === "results" && <GameOverModal />}
    </div>
  );
}
