import { Select } from "../UI/Select";
import { useSettingsStore } from "../../stores/settingsStore";
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
];

const timeOptions = [
  { value: "0", label: "Unlimited" },
  { value: "30", label: "30 seconds" },
  { value: "60", label: "1 minute" },
  { value: "120", label: "2 minutes" },
  { value: "300", label: "5 minutes" },
];

const modeOptions = [
  { value: "lives", label: "3 Lives" },
  { value: "unlimited", label: "Unlimited tries" },
  { value: "penalty", label: "Score penalty" },
];

export function GameSettings() {
  const {
    region,
    difficulty,
    timeLimit,
    wrongGuessMode,
    hintZoom,
    setRegion,
    setDifficulty,
    setTimeLimit,
    setWrongGuessMode,
    setHintZoom,
  } = useSettingsStore();

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      {/* Dropdowns */}
      <div className="grid grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-8 sm:gap-y-10">
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

      {/* Zoom hint toggle */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text">Zoom hint</p>
          <p className="text-xs text-text-dim mt-1">Fly to next country after correct guess</p>
        </div>
        <button
          className={`w-11 h-6 rounded-full transition-all duration-300 cursor-pointer ${
            hintZoom ? "bg-accent shadow-[0_0_10px_rgba(6,182,212,0.3)]" : "bg-surface-light border border-white/[0.06]"
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
    </div>
  );
}
