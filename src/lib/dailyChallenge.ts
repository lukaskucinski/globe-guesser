import { COUNTRIES } from "../data/countries";
import { mulberry32, seededShuffle } from "./shuffle";

const DAILY_COUNT = 30;

function dateToSeed(dateStr: string): number {
  let h = 0;
  for (const ch of dateStr) {
    h = ((h << 5) - h + ch.charCodeAt(0)) | 0;
  }
  return h >>> 0;
}

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getDailyChallengeCountries(dateStr?: string): string[] {
  const date = dateStr ?? getTodayString();
  const seed = dateToSeed(date);
  const rng = mulberry32(seed);

  // Medium pool: exclude micro-states (difficulty 3 with area < 1000)
  const pool = COUNTRIES.filter((c) => c.difficulty <= 2);
  const shuffled = seededShuffle(pool, rng);
  return shuffled.slice(0, DAILY_COUNT).map((c) => c.iso_a2);
}

export function getDailyDateString(): string {
  return getTodayString();
}
