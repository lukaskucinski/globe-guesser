import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "../UI/Button";
import { GameSettings } from "./GameSettings";
import { useGameStore } from "../../stores/gameStore";
import { useSettingsStore } from "../../stores/settingsStore";

export function MainMenu() {
  const startGame = useGameStore((s) => s.startGame);
  const setScreen = useGameStore((s) => s.setScreen);
  const getGameSettings = useSettingsStore((s) => s.getGameSettings);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Show fade if not scrolled near the bottom
    setCanScroll(el.scrollHeight - el.scrollTop - el.clientHeight > 8);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll]);

  const handleStart = () => {
    startGame(getGameSettings(false));
  };

  const handleDaily = () => {
    startGame(getGameSettings(true));
  };

  const handleLearn = () => {
    setScreen("learn");
  };

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center p-5 sm:p-8 pointer-events-none">
      <div className="pointer-events-auto relative bg-surface/10 backdrop-blur-md border border-white/[0.06] rounded-3xl max-w-2xl w-full shadow-[0_8px_60px_rgba(6,182,212,0.08)] max-h-[calc(100dvh-2.5rem)] sm:max-h-[calc(100dvh-4rem)] animate-menu-enter overflow-hidden">

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="overflow-y-auto scrollbar-hide px-10 sm:px-16 py-8 sm:py-12 max-h-[calc(100dvh-2.5rem)] sm:max-h-[calc(100dvh-4rem)]"
        >
          {/* Title */}
          <div className="text-center mb-6 sm:mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-text tracking-tight mb-3 animate-title-glow">
              Globe Guesser
            </h1>
            <p className="text-text-dim text-sm tracking-wide">
              Click the country on the globe
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.06] mb-6 sm:mb-8" />

          {/* Settings */}
          <GameSettings />

          {/* Divider */}
          <div className="border-t border-white/[0.06] my-6 sm:my-8" />

          {/* Actions */}
          <div className="flex flex-col gap-4">
            <Button size="lg" className="w-full text-xl" onClick={handleStart}>
              Start Game
            </Button>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={handleDaily}
              >
                Daily Challenge
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="w-full"
                onClick={handleLearn}
              >
                Explore & Learn
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom fade hint */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0a0a1a]/80 to-transparent rounded-b-3xl pointer-events-none transition-opacity duration-300 ${
            canScroll ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </div>
  );
}
