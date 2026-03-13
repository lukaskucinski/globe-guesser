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
    <div className="absolute inset-0 z-10 flex items-end sm:items-center justify-center pointer-events-none">
      <div className="pointer-events-auto bg-surface/90 backdrop-blur-xl border border-border rounded-t-2xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full sm:mx-4 shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-text tracking-tight mb-2">
            Globe Guesser
          </h1>
          <p className="text-text-dim text-sm">
            Click the country on the globe
          </p>
        </div>

        <GameSettings />

        <div className="flex flex-col gap-3 mt-6 sm:mt-8">
          <Button size="lg" className="w-full" onClick={handleStart}>
            Start Game
          </Button>
          <Button
            variant="secondary"
            size="md"
            className="w-full"
            onClick={handleDaily}
          >
            Daily Challenge
          </Button>
          <Button
            variant="ghost"
            size="md"
            className="w-full"
            onClick={handleLearn}
          >
            Explore & Learn
          </Button>
        </div>
      </div>
    </div>
  );
}
