import type { Region } from "../types/country";

export const REGION_LABELS: Record<Region, string> = {
  Africa: "Africa",
  Asia: "Asia",
  Europe: "Europe",
  NorthAmerica: "North America",
  SouthAmerica: "South America",
  Oceania: "Oceania",
};

export const REGION_CENTERS: Record<Region, [number, number]> = {
  Africa: [20, 5],
  Asia: [90, 35],
  Europe: [15, 50],
  NorthAmerica: [-100, 40],
  SouthAmerica: [-60, -15],
  Oceania: [140, -25],
};

export const ALL_REGIONS: Region[] = [
  "Africa",
  "Asia",
  "Europe",
  "NorthAmerica",
  "SouthAmerica",
  "Oceania",
];
