import { useEffect } from "react";
import { GlobeMap } from "./components/Globe/GlobeMap";
import { MainMenu } from "./components/Menu/MainMenu";
import { GameScreen } from "./components/Game/GameScreen";
import { LearnMode } from "./components/Learn/LearnMode";
import { useGameStore } from "./stores/gameStore";
import { useSettingsStore } from "./stores/settingsStore";
import { setMuted } from "./lib/sound";

function App() {
  const screen = useGameStore((s) => s.screen);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);

  useEffect(() => {
    setMuted(!soundEnabled);
  }, [soundEnabled]);

  return (
    <div className="relative w-full h-full bg-bg">
      {screen === "menu" && (
        <>
          <GlobeMap spinning={true} interactive={false} />
          <MainMenu />
        </>
      )}

      {(screen === "playing" || screen === "results") && <GameScreen />}

      {screen === "learn" && <LearnMode />}
    </div>
  );
}

export default App;
