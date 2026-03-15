import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameSettings, Difficulty, TimeLimit, WrongGuessMode } from "../types/game";
import type { Region } from "../types/country";

export type Theme = "dark" | "light";

interface SettingsStore {
  region: Region | "all";
  difficulty: Difficulty;
  timeLimit: TimeLimit;
  wrongGuessMode: WrongGuessMode;
  soundEnabled: boolean;
  hintZoom: boolean;
  maxSkips: number;
  theme: Theme;

  setRegion: (region: Region | "all") => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setTimeLimit: (timeLimit: TimeLimit) => void;
  setWrongGuessMode: (mode: WrongGuessMode) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setHintZoom: (enabled: boolean) => void;
  setMaxSkips: (maxSkips: number) => void;
  setTheme: (theme: Theme) => void;
  getGameSettings: (isDaily?: boolean) => GameSettings;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      region: "all",
      difficulty: "medium",
      timeLimit: 0,
      wrongGuessMode: "3lives",
      soundEnabled: true,
      hintZoom: false,
      maxSkips: 0,
      theme: "dark",

      setRegion: (region) => set({ region }),
      setDifficulty: (difficulty) => set({ difficulty }),
      setTimeLimit: (timeLimit) => set({ timeLimit }),
      setWrongGuessMode: (mode) => set({ wrongGuessMode: mode }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setHintZoom: (enabled) => set({ hintZoom: enabled }),
      setMaxSkips: (maxSkips) => set({ maxSkips }),
      setTheme: (theme) => set({ theme }),

      getGameSettings: (isDaily = false) => {
        const state = get();
        if (isDaily) {
          return {
            region: "all",
            difficulty: "medium",
            timeLimit: 300,
            wrongGuessMode: "3lives",
            isDaily: true,
            maxSkips: 0,
          };
        }
        return {
          region: state.region,
          difficulty: state.difficulty,
          timeLimit: state.timeLimit,
          wrongGuessMode: state.wrongGuessMode,
          isDaily: false,
          maxSkips: state.maxSkips,
        };
      },
    }),
    { name: "globe-guesser-settings" }
  )
);
