export type Region =
  | "Africa"
  | "Asia"
  | "Europe"
  | "NorthAmerica"
  | "SouthAmerica"
  | "Oceania";

export interface CountryMeta {
  iso_a2: string;
  iso_a3: string;
  name: string;
  region: Region;
  subregion: string;
  area_km2: number;
  population: number;
  difficulty: 1 | 2 | 3 | 4;
  basePoints: number;
  isMicroState: boolean;
  labelLngLat: [number, number];
}
