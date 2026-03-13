import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameSettings, Difficulty, TimeLimit, WrongGuessMode } from "../types/game";
import type { Region } from "../types/country";

interface SettingsStore {
  region: Region | "all";
  difficulty: Difficulty;
  timeLimit: TimeLimit;
  wrongGuessMode: WrongGuessMode;
  soundEnabled: boolean;

  setRegion: (region: Region | "all") => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setTimeLimit: (timeLimit: TimeLimit) => void;
  setWrongGuessMode: (mode: WrongGuessMode) => void;
  setSoundEnabled: (enabled: boolean) => void;
  getGameSettings: (isDaily?: boolean) => GameSettings;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      region: "all",
      difficulty: "medium",
      timeLimit: 0,
      wrongGuessMode: "lives",
      soundEnabled: true,

      setRegion: (region) => set({ region }),
      setDifficulty: (difficulty) => set({ difficulty }),
      setTimeLimit: (timeLimit) => set({ timeLimit }),
      setWrongGuessMode: (mode) => set({ wrongGuessMode: mode }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

      getGameSettings: (isDaily = false) => {
        const state = get();
        if (isDaily) {
          return {
            region: "all",
            difficulty: "medium",
            timeLimit: 300,
            wrongGuessMode: "lives",
            isDaily: true,
          };
        }
        return {
          region: state.region,
          difficulty: state.difficulty,
          timeLimit: state.timeLimit,
          wrongGuessMode: state.wrongGuessMode,
          isDaily: false,
        };
      },
    }),
    { name: "globe-guesser-settings" }
  )
);
