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
    setRegion,
    setDifficulty,
    setTimeLimit,
    setWrongGuessMode,
  } = useSettingsStore();

  return (
    <div className="grid grid-cols-2 gap-4">
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
  );
}
