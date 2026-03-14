import { useRef, useCallback, useEffect, useState } from "react";
import { GlobeMap, type GlobeMapHandle } from "../Globe/GlobeMap";
import { CountryPrompt } from "./CountryPrompt";
import { ScoreDisplay } from "./ScoreDisplay";
import { LivesDisplay } from "./LivesDisplay";
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
  const hintZoom = useSettingsStore((s) => s.hintZoom);
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);
  const [wrongName, setWrongName] = useState<string | null>(null);
  const [revealCountry, setRevealCountry] = useState<string | null>(null);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

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
      setWrongName(null);
    }, 1500);
    return () => clearTimeout(timer);
  }, [wrongFlash]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (screen !== "playing") return;
      if (e.key === "Escape") {
        if (showQuitConfirm) {
          setShowQuitConfirm(false);
        } else {
          setShowQuitConfirm(true);
        }
      }
      if (e.key === "m" || e.key === "M") {
        const next = !useSettingsStore.getState().soundEnabled;
        setSoundEnabled(next);
        setMuted(!next);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [screen, showQuitConfirm, setSoundEnabled]);

  const handleCountryClick = useCallback(
    (iso: string) => {
      if (screen !== "playing") return;

      const result = handleGuess(iso);

      if (result === "correct") {
        globeRef.current?.setCountryState(iso, { guessed: true, wrong: false });

        // Optionally fly to next country's region (hint zoom)
        if (hintZoom) {
          const nextIso = queue[currentIndex + 1];
          if (nextIso) {
            const nextCountry = COUNTRY_MAP.get(nextIso);
            if (nextCountry) {
              globeRef.current?.flyTo(nextCountry.labelLngLat, 3);
            }
          }
        }
      } else if (result === "wrong") {
        // Clear hover so red isn't masked by cyan hover state
        globeRef.current?.setCountryState(iso, { hover: false, wrong: true });
        setWrongFlash(iso);
        const wrongCountry = COUNTRY_MAP.get(iso);
        setWrongName(wrongCountry?.name ?? null);

        // If that guess ended the game, reveal the correct country before showing modal
        const currentScreen = useGameStore.getState().screen;
        if (currentScreen === "results") {
          // Revert to playing so the globe stays visible
          useGameStore.getState().setScreen("playing");
          const targetIso = queue[currentIndex];
          const targetCountry = COUNTRY_MAP.get(targetIso);
          if (targetCountry) {
            setRevealCountry(targetCountry.name);
            globeRef.current?.setCountryState(targetIso, { guessed: true });
            globeRef.current?.flyTo(targetCountry.labelLngLat, 4);
          }
          setTimeout(() => {
            setRevealCountry(null);
            useGameStore.getState().setScreen("results");
          }, 2500);
        }
      }
    },
    [screen, handleGuess, queue, currentIndex, hintZoom]
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
          <CountryPrompt onSkip={(iso) => {
            // Show skipped country in gold on the globe
            globeRef.current?.setCountryState(iso, { guessed: true });
          }} />
          <ScoreDisplay />
          <LivesDisplay />
          <ProgressBar />

          {/* Reveal correct country on death */}
          {revealCountry && (
            <div className="absolute top-20 sm:top-24 inset-x-0 z-20 pointer-events-none flex justify-center">
              <div className="bg-correct/20 backdrop-blur-lg border border-correct/30 rounded-lg px-5 py-3 shadow-lg">
                <p className="text-correct text-sm font-medium text-center">
                  It was {revealCountry}
                </p>
              </div>
            </div>
          )}

          {/* Wrong guess toast */}
          {wrongName && (
            <div className="absolute top-20 sm:top-24 inset-x-0 z-20 pointer-events-none flex justify-center">
              <div className="animate-fade-in-out bg-wrong/20 backdrop-blur-lg border border-wrong/30 rounded-lg px-4 py-2 shadow-lg">
                <p className="text-wrong text-sm font-medium text-center">
                  That was {wrongName}
                </p>
              </div>
            </div>
          )}

          {/* Controls: mute + quit */}
          <div className="absolute bottom-6 right-6 z-20 flex gap-2">
            <button
              className="bg-surface/80 backdrop-blur-lg border border-border rounded-lg p-2.5 text-text-dim hover:text-text transition-colors cursor-pointer"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                setMuted(!next);
              }}
              title={soundEnabled ? "Mute (M)" : "Unmute (M)"}
            >
              {soundEnabled ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M11 5L6 9H2v6h4l5 4V5z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707A1 1 0 0112 5v14a1 1 0 01-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              )}
            </button>
            {showQuitConfirm ? (
              <div className="flex gap-1.5">
                <Button variant="ghost" size="sm" onClick={() => { setShowQuitConfirm(false); endGame(); }}>
                  Yes, quit
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setShowQuitConfirm(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="md" onClick={() => setShowQuitConfirm(true)}>
                Quit
              </Button>
            )}
          </div>
        </>
      )}

      {screen === "results" && <GameOverModal />}
    </div>
  );
}
