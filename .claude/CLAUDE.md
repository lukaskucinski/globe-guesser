# Globe Guesser

A geography guessing game with a spinning 3D Mapbox globe.

## Tech Stack
- React 19 + Vite 8 + TypeScript
- Mapbox GL JS (globe projection, `mapbox.country-boundaries-v1` tileset)
- Zustand (state management)
- Tailwind CSS v4 (via PostCSS)
- Howler.js (sound effects)

## Key Patterns
- Country interaction via `queryRenderedFeatures()` + `setFeatureState()` with `promoteId`
- ISO 3166-1 alpha-2 codes as the universal country identifier
- Zustand stores for game state, settings (persisted via `zustand/middleware`), and daily challenge
- Feature state expressions for country fill colors (no tile reloads)
- Territories (44 entries) use the same `c()` helper in `countries.ts` — Mapbox tileset already renders them as separate features with their own `iso_3166_1` codes
- Difficulty tiers 1–4 map to easy/medium/hard/insane; queue filtering uses `pool.filter(c => c.difficulty <= N)` with insane having no filter
- Lives modes (`sudden_death`, `3lives`, `5lives`) abstracted via `livesForMode()` and `isLivesMode()` helpers in `gameStore.ts`
- `endedAt` timestamp freezes elapsed time on the results screen (prevents re-renders from updating the clock)

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npx tsc --noEmit` — Type check

## Documentation
- [Architecture](docs/ARCHITECTURE.md) — Screen routing, component hierarchy, data flow, file organization
- [Mapbox Integration](docs/MAPBOX.md) — Tileset, layers, feature state, click detection, globe config
- [Game Modes & Scoring](docs/GAME_MODES.md) — State machine, wrong guess modes, scoring formula, timer, daily challenge
- [Country & Territory Data](docs/COUNTRIES.md) — Data model, difficulty tiers, adding entries, regions
- [Styling Guide](docs/STYLING.md) — Theme tokens, glass aesthetic, button variants, animations, CSS gotchas
