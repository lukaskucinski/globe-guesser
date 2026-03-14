import type { Region } from "./country";

export type Screen = "menu" | "loading" | "playing" | "results" | "learn";
export type WrongGuessMode = "unlimited" | "sudden_death" | "3lives" | "5lives" | "penalty";
export type Difficulty = "easy" | "medium" | "hard" | "insane";
export type TimeLimit = 0 | 30 | 60 | 120 | 300;

export interface GameSettings {
  region: Region | "all";
  difficulty: Difficulty;
  timeLimit: TimeLimit;
  wrongGuessMode: WrongGuessMode;
  isDaily: boolean;
  maxSkips: number;
}

export interface GuessResult {
  iso: string;
  correct: boolean;
  attempts: number;
  pointsEarned: number;
  timeElapsed: number;
}

export interface GameResult {
  score: number;
  totalCountries: number;
  correctCount: number;
  accuracy: number;
  timeElapsed: number;
  guesses: GuessResult[];
  settings: GameSettings;
}

export const DEFAULT_SETTINGS: GameSettings = {
  region: "all",
  difficulty: "medium",
  timeLimit: 0,
  wrongGuessMode: "3lives",
  isDaily: false,
  maxSkips: 0,
};
