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
- Zustand stores for game state, settings (persisted), and daily challenge
- Feature state expressions for country fill colors (no tile reloads)

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npx tsc --noEmit` — Type check
