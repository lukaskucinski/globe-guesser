import { useEffect, useRef } from "react";
import { useGameStore } from "../stores/gameStore";

export function useTimer() {
  const screen = useGameStore((s) => s.screen);
  const timeLimit = useGameStore((s) => s.settings?.timeLimit ?? 0);
  const tick = useGameStore((s) => s.tick);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (screen === "playing" && timeLimit > 0) {
      intervalRef.current = setInterval(tick, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [screen, timeLimit, tick]);
}
