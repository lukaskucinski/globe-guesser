import { Button } from "../UI/Button";
import { GameSettings } from "./GameSettings";
import { useGameStore } from "../../stores/gameStore";
import { useSettingsStore } from "../../stores/settingsStore";

export function MainMenu() {
  const startGame = useGameStore((s) => s.startGame);
  const setScreen = useGameStore((s) => s.setScreen);
  const getGameSettings = useSettingsStore((s) => s.getGameSettings);

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
      <div className="pointer-events-auto bg-surface/10 backdrop-blur-md border border-white/[0.06] rounded-3xl px-10 sm:px-16 py-12 sm:py-14 max-w-2xl w-full shadow-[0_8px_60px_rgba(6,182,212,0.08)] max-h-[calc(100dvh-2.5rem)] sm:max-h-[calc(100dvh-4rem)] overflow-y-auto animate-menu-enter">

        {/* Title */}
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="text-4xl sm:text-5xl font-bold text-text tracking-tight mb-3 animate-title-glow">
            Globe Guesser
          </h1>
          <p className="text-text-dim text-sm tracking-wide">
            Click the country on the globe
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.06] mb-10 sm:mb-12" />

        {/* Settings */}
        <GameSettings />

        {/* Divider */}
        <div className="border-t border-white/[0.06] my-10 sm:my-12" />

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
    </div>
  );
}
