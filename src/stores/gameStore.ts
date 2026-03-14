import { create } from "zustand";
import type { Screen, GameSettings, GuessResult } from "../types/game";
import type { CountryMeta } from "../types/country";
import { COUNTRIES, COUNTRY_MAP } from "../data/countries";
import { computeGuessPoints, computePenalty } from "../data/scoring";
import { shuffle } from "../lib/shuffle";
import { getDailyChallengeCountries } from "../lib/dailyChallenge";
import { playSound } from "../lib/sound";
import type { WrongGuessMode } from "../types/game";

function livesForMode(mode: WrongGuessMode): number {
  switch (mode) {
    case "sudden_death": return 1;
    case "3lives": return 3;
    case "5lives": return 5;
    default: return 0; // unlimited, penalty
  }
}

function isLivesMode(mode: WrongGuessMode): boolean {
  return mode === "sudden_death" || mode === "3lives" || mode === "5lives";
}

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
  skipsRemaining: number;

  // Derived
  currentCountry: CountryMeta | null;
  correctCount: number;
  isGameOver: boolean;

  // Actions
  setScreen: (screen: Screen) => void;
  startGame: (settings: GameSettings) => void;
  handleGuess: (isoCode: string) => "correct" | "wrong" | "already_guessed";
  skipCountry: () => string | null;
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
  } else if (settings.difficulty === "hard") {
    pool = pool.filter((c) => c.difficulty <= 3);
  }
  // "insane" includes everything

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
  skipsRemaining: 0,

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
    if (settings && isLivesMode(settings.wrongGuessMode) && lives <= 0) return true;
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
      lives: livesForMode(settings.wrongGuessMode),
      currentAttempts: 0,
      startedAt: Date.now(),
      timeRemaining: settings.timeLimit,
      totalCountries: queue.length,
      skipsRemaining: settings.maxSkips,
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
        isLivesMode(settings.wrongGuessMode) ? state.lives - 1 : state.lives;
      const penalty =
        settings.wrongGuessMode === "penalty" ? computePenalty(country) : 0;
      const isOut =
        isLivesMode(settings.wrongGuessMode) && newLives <= 0;

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

  skipCountry: () => {
    const state = get();
    const { queue, currentIndex, settings, skipsRemaining } = state;
    if (!settings?.maxSkips || skipsRemaining <= 0) return null;
    if (currentIndex >= queue.length) return null;

    const targetIso = queue[currentIndex];
    const country = COUNTRY_MAP.get(targetIso);
    if (!country) return null;

    // Deduct a small penalty (half the base points)
    const penalty = Math.round(country.basePoints * 0.5);

    const newGuessed = new Map(state.guessedCountries);
    newGuessed.set(targetIso, {
      iso: targetIso,
      correct: false,
      attempts: 0,
      pointsEarned: -penalty,
      timeElapsed: (Date.now() - state.startedAt) / 1000,
    });

    const newIndex = currentIndex + 1;
    const isComplete = newIndex >= queue.length;

    set({
      guessedCountries: newGuessed,
      score: Math.max(0, state.score - penalty),
      streak: 0,
      currentAttempts: 0,
      currentIndex: newIndex,
      skipsRemaining: skipsRemaining - 1,
      screen: isComplete ? "results" : "playing",
    });

    return targetIso;
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
      skipsRemaining: 0,
    });
  },
}));
