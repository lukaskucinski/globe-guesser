# Globe Guesser

A geography guessing game with a spinning 3D Mapbox globe.

## Tech Stack
- React 19 + Vite 8 + TypeScript
- Mapbox GL JS (globe projection, `mapbox.country-boundaries-v1` tileset)
- Zustand (state management)
- Tailwind CSS v4 (via PostCSS)
- Howler.js (sound effects)

## Design Context

### Users
Casual players, geography enthusiasts, students. Quick fun sessions (2-10 min). Test and improve geography knowledge.

### Brand Personality
Playful, immersive, satisfying. Google Earth aesthetic meets casual game energy.

### Aesthetic Direction
- **Theme**: Dark mode, globe-centric. Dark background (#0a0a1a) with glowing cyan outlines.
- **Reference**: Google Earth — the globe IS the UI, minimal chrome.
- **Anti-reference**: Cluttered quiz sites. No walls of text, no busy UI.
- **Colors**: Green (#22c55e) correct, Red (#ef4444) wrong, Cyan (#06b6d4) accent/outlines.
- **Typography**: Clean sans-serif (Inter/system-ui). Minimal text.

### Design Principles
1. **Globe-first**: The 3D globe dominates the viewport. UI overlays are minimal and translucent.
2. **Instant feedback**: Every click produces immediate visual + audio response.
3. **Progressive disclosure**: Simple start → reveal complexity through settings.
4. **Satisfying progression**: Watching the map fill with color is the core dopamine loop.
5. **Accessible challenge**: Easy enough to start, hard enough to master.

## Key Patterns
- Country interaction via `queryRenderedFeatures()` + `setFeatureState()` with `promoteId`
- ISO 3166-1 alpha-2 codes as the universal country identifier
- Zustand stores for game state, settings (persisted), and daily challenge
- Feature state expressions for country fill colors (no tile reloads)

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npx tsc --noEmit` — Type check
