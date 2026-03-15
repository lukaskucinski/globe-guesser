import { useMemo } from "react";
import { Select } from "../UI/Select";
import { useSettingsStore } from "../../stores/settingsStore";
import { COUNTRIES } from "../../data/countries";
import { REGION_LABELS, ALL_REGIONS } from "../../data/regions";
import type { Region } from "../../types/country";
import type { Difficulty, TimeLimit, WrongGuessMode } from "../../types/game";

const regionOptions = [
  { value: "all", label: "All Regions" },
  ...ALL_REGIONS.map((r) => ({ value: r, label: REGION_LABELS[r] })),
];

const difficultyOptions = [
  { value: "easy", label: "Easy (Major countries)" },
  { value: "medium", label: "Medium (No micro-states)" },
  { value: "hard", label: "Hard (Everything)" },
  { value: "insane", label: "Insane (+ Territories)" },
];

const timeOptions = [
  { value: "0", label: "Unlimited" },
  { value: "30", label: "30 seconds" },
  { value: "60", label: "1 minute" },
  { value: "120", label: "2 minutes" },
  { value: "300", label: "5 minutes" },
];

const modeOptions = [
  { value: "sudden_death", label: "Sudden death" },
  { value: "3lives", label: "3 lives" },
  { value: "5lives", label: "5 lives" },
  { value: "unlimited", label: "Unlimited" },
  { value: "penalty", label: "Score penalty" },
];

export function GameSettings() {
  const {
    region,
    difficulty,
    timeLimit,
    wrongGuessMode,
    hintZoom,
    maxSkips,
    theme,
    setRegion,
    setDifficulty,
    setTimeLimit,
    setWrongGuessMode,
    setHintZoom,
    setMaxSkips,
    setTheme,
  } = useSettingsStore();

  const countryCount = useMemo(() => {
    let pool = COUNTRIES;
    if (region !== "all") pool = pool.filter((c) => c.region === region);
    if (difficulty === "easy") pool = pool.filter((c) => c.difficulty === 1);
    else if (difficulty === "medium") pool = pool.filter((c) => c.difficulty <= 2);
    else if (difficulty === "hard") pool = pool.filter((c) => c.difficulty <= 3);
    return pool.length;
  }, [region, difficulty]);

  return (
    <div className="flex flex-col gap-5 sm:gap-7">
      {/* Dropdowns */}
      <div className="grid grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-5 sm:gap-y-7">
        <Select
          label="Region"
          value={region}
          options={regionOptions}
          onChange={(v) => setRegion(v as Region | "all")}
        />
        <Select
          label="Difficulty"
          value={difficulty}
          options={difficultyOptions}
          onChange={(v) => setDifficulty(v as Difficulty)}
        />
        <Select
          label="Time Limit"
          value={String(timeLimit)}
          options={timeOptions}
          onChange={(v) => setTimeLimit(Number(v) as TimeLimit)}
        />
        <Select
          label="Wrong Guess"
          value={wrongGuessMode}
          options={modeOptions}
          onChange={(v) => setWrongGuessMode(v as WrongGuessMode)}
        />
      </div>

      {/* Country count */}
      <p className="text-center text-sm text-text-dim">
        <span className="text-accent font-semibold">{countryCount}</span>{" "}
        {difficulty === "hard" || difficulty === "insane" ? "countries & territories" : "countries"} to find
      </p>

      {/* Toggles */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text">Theme</p>
            <p className="text-xs text-text-dim mt-1">Switch between dark and light</p>
          </div>
          <button
            className={`w-11 h-6 rounded-full transition-all duration-300 cursor-pointer ${
              theme === "light" ? "bg-accent shadow-[0_0_10px_rgba(6,182,212,0.3)]" : "bg-surface-light border border-glass-border"
            }`}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 mx-1 flex items-center justify-center ${
                theme === "light" ? "translate-x-5" : "translate-x-0"
              }`}
            >
              {theme === "light" ? (
                <svg className="w-2.5 h-2.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-2.5 h-2.5 text-text-dim" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </div>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text">Zoom hint</p>
            <p className="text-xs text-text-dim mt-1">Fly to next country after correct guess</p>
          </div>
          <button
            className={`w-11 h-6 rounded-full transition-all duration-300 cursor-pointer ${
              hintZoom ? "bg-accent shadow-[0_0_10px_rgba(6,182,212,0.3)]" : "bg-surface-light border border-glass-border"
            }`}
            onClick={() => setHintZoom(!hintZoom)}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 mx-1 ${
                hintZoom ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-text">Skips</p>
              {maxSkips > 0 && <p className="text-xs text-text-dim mt-0.5">Score penalty per skip</p>}
            </div>
            <p className="text-sm font-semibold text-accent">{maxSkips === 0 ? "Off" : maxSkips}</p>
          </div>
          <input
            type="range"
            min={0}
            max={5}
            step={1}
            value={maxSkips}
            onChange={(e) => setMaxSkips(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-surface-light
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md
              [&::-webkit-slider-thumb]:transition-shadow [&::-webkit-slider-thumb]:hover:shadow-[0_0_10px_rgba(6,182,212,0.4)]
              [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md"
          />
          <div className="flex justify-between mt-1">
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <span key={n} className={`text-[10px] ${maxSkips === n ? "text-accent" : "text-text-dim/50"}`}>{n}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
