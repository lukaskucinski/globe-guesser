import type { CountryMeta } from "../types/country";

const MAX_AREA = 17098242; // Russia
const MAX_POP = 1425893465; // China

function normalize(value: number, max: number): number {
  return Math.min(value / max, 1);
}

export function computeBasePoints(area: number, population: number, difficulty: 1 | 2 | 3 | 4): number {
  const areaScore = 40 * (1 - normalize(area, MAX_AREA));
  const popScore = 30 * (1 - normalize(population, MAX_POP));
  const tierBonus = 20 * ((difficulty - 1) / 3);
  return Math.round(10 + areaScore + popScore + tierBonus);
}

export function computeGuessPoints(
  country: CountryMeta,
  isFirstTry: boolean,
  streak: number,
  timeRemaining: number,
  totalTime: number
): number {
  let points = country.basePoints;

  if (isFirstTry) {
    points = Math.round(points * 1.5);
  }

  // Streak bonus: +5 per consecutive correct, cap at +25
  const streakBonus = Math.min(streak * 5, 25);
  points += streakBonus;

  // Time bonus (only in timed mode)
  if (totalTime > 0 && timeRemaining > 0) {
    const timeMultiplier = 1 + (timeRemaining / totalTime) * 0.5;
    points = Math.round(points * timeMultiplier);
  }

  return points;
}

export function computePenalty(country: CountryMeta): number {
  return Math.round(country.basePoints * 0.25);
}
