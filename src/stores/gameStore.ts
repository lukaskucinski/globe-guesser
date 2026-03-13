import { create } from "zustand";
import type { Screen, GameSettings, GuessResult } from "../types/game";
import type { CountryMeta } from "../types/country";
import { COUNTRIES, COUNTRY_MAP } from "../data/countries";
import { computeGuessPoints, computePenalty } from "../data/scoring";
import { shuffle } from "../lib/shuffle";
import { getDailyChallengeCountries } from "../lib/dailyChallenge";
import { playSound } from "../lib/sound";

interface GameStore {
  screen: Screen;
  settings: GameSettings | null;
  queue: string[];
  currentIndex: number;
  guessedCountries: Map<string, GuessResult>;
  score: number;
  streak: number;
  lives: number;
  currentAttempts: number;
  startedAt: number;
  timeRemaining: number;
  totalCountries: number;

  // Derived
  currentCountry: CountryMeta | null;
  correctCount: number;
  isGameOver: boolean;

  // Actions
  setScreen: (screen: Screen) => void;
  startGame: (settings: GameSettings) => void;
  handleGuess: (isoCode: string) => "correct" | "wrong" | "already_guessed";
  tick: () => void;
  endGame: () => void;
  reset: () => void;
}

function buildQueue(settings: GameSettings): string[] {
  if (settings.isDaily) {
    return getDailyChallengeCountries();
  }

  let pool = COUNTRIES;

  // Region filter
  if (settings.region !== "all") {
    pool = pool.filter((c) => c.region === settings.region);
  }

  // Difficulty filter
  if (settings.difficulty === "easy") {
    pool = pool.filter((c) => c.difficulty === 1);
  } else if (settings.difficulty === "medium") {
    pool = pool.filter((c) => c.difficulty <= 2);
  }
  // "hard" includes everything

  return shuffle(pool).map((c) => c.iso_a2);
}

export const useGameStore = create<GameStore>()((set, get) => ({
  screen: "menu",
  settings: null,
  queue: [],
  currentIndex: 0,
  guessedCountries: new Map(),
  score: 0,
  streak: 0,
  lives: 3,
  currentAttempts: 0,
  startedAt: 0,
  timeRemaining: 0,
  totalCountries: 0,

  get currentCountry() {
    const { queue, currentIndex } = get();
    if (currentIndex >= queue.length) return null;
    return COUNTRY_MAP.get(queue[currentIndex]) ?? null;
  },

  get correctCount() {
    const guessed = get().guessedCountries;
    let count = 0;
    guessed.forEach((g) => {
      if (g.correct) count++;
    });
    return count;
  },

  get isGameOver() {
    const { currentIndex, queue, lives, settings } = get();
    if (currentIndex >= queue.length) return true;
    if (settings?.wrongGuessMode === "lives" && lives <= 0) return true;
    return false;
  },

  setScreen: (screen) => set({ screen }),

  startGame: (settings) => {
    const queue = buildQueue(settings);
    set({
      screen: "playing",
      settings,
      queue,
      currentIndex: 0,
      guessedCountries: new Map(),
      score: 0,
      streak: 0,
      lives: 3,
      currentAttempts: 0,
      startedAt: Date.now(),
      timeRemaining: settings.timeLimit,
      totalCountries: queue.length,
    });
  },

  handleGuess: (isoCode) => {
    const state = get();
    const { queue, currentIndex, settings, guessedCountries } = state;

    if (currentIndex >= queue.length || !settings) return "already_guessed";

    const targetIso = queue[currentIndex];
    const country = COUNTRY_MAP.get(targetIso);
    if (!country) return "wrong";

    // Already guessed this one
    if (guessedCountries.has(targetIso) && guessedCountries.get(targetIso)!.correct) {
      return "already_guessed";
    }

    const isCorrect = isoCode === targetIso;

    if (isCorrect) {
      const elapsed = (Date.now() - state.startedAt) / 1000;
      const isFirstTry = state.currentAttempts === 0;
      const points = computeGuessPoints(
        country,
        isFirstTry,
        state.streak,
        state.timeRemaining,
        settings.timeLimit
      );

      const result: GuessResult = {
        iso: targetIso,
        correct: true,
        attempts: state.currentAttempts + 1,
        pointsEarned: points,
        timeElapsed: elapsed,
      };

      const newGuessed = new Map(guessedCountries);
      newGuessed.set(targetIso, result);

      const newIndex = currentIndex + 1;
      const isComplete = newIndex >= queue.length;

      playSound(isComplete ? "victory" : "correct");

      set({
        guessedCountries: newGuessed,
        score: state.score + points,
        streak: state.streak + 1,
        currentAttempts: 0,
        currentIndex: newIndex,
        screen: isComplete ? "results" : "playing",
      });

      return "correct";
    } else {
      // Wrong guess
      playSound("wrong");

      const newLives =
        settings.wrongGuessMode === "lives" ? state.lives - 1 : state.lives;
      const penalty =
        settings.wrongGuessMode === "penalty" ? computePenalty(country) : 0;
      const isOut =
        settings.wrongGuessMode === "lives" && newLives <= 0;

      if (isOut) {
        playSound("gameover");
      }

      set({
        lives: newLives,
        score: Math.max(0, state.score - penalty),
        streak: 0,
        currentAttempts: state.currentAttempts + 1,
        screen: isOut ? "results" : "playing",
      });

      return "wrong";
    }
  },

  tick: () => {
    const state = get();
    if (state.screen !== "playing" || !state.settings?.timeLimit) return;

    const newTime = state.timeRemaining - 1;
    if (newTime <= 0) {
      playSound("gameover");
      set({ timeRemaining: 0, screen: "results" });
    } else {
      if (newTime <= 10) {
        playSound("tick");
      }
      set({ timeRemaining: newTime });
    }
  },

  endGame: () => {
    playSound("gameover");
    set({ screen: "results" });
  },

  reset: () => {
    set({
      screen: "menu",
      settings: null,
      queue: [],
      currentIndex: 0,
      guessedCountries: new Map(),
      score: 0,
      streak: 0,
      lives: 3,
      currentAttempts: 0,
      startedAt: 0,
      timeRemaining: 0,
      totalCountries: 0,
    });
  },
}));
