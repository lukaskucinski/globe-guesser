# Architecture

## Entry Point

`main.tsx` mounts `<App>` into `#root` with StrictMode. `App.tsx` acts as the root router, switching screens based on `gameStore.screen`.

## Screen Routing

No router library — screens are conditionally rendered based on a Zustand state field:

```
screen === "menu"            → <GlobeMap spinning> + <MainMenu>
screen === "playing/results" → <GameScreen> (contains GlobeMap + HUD + modals)
screen === "learn"           → <LearnMode> (contains GlobeMap + exploration UI)
```

All navigation happens through store actions (`startGame`, `reset`, `setScreen`).

## Component Hierarchy

```
App
├── GlobeMap (menu background — spinning, non-interactive)
├── MainMenu
│   ├── GameSettings (region, difficulty, time, mode, skips)
│   └── Buttons: Start Game, Daily Challenge, Learn
├── GameScreen (playing + results)
│   ├── GlobeMap (ref-controlled, interactive)
│   ├── CountryPrompt (current target + skip button)
│   ├── ScoreDisplay (score + streak)
│   ├── LivesDisplay (hearts)
│   ├── ProgressBar
│   ├── Timer
│   ├── GameOverModal (shown when screen === "results")
│   └── Toast overlays (wrong guess flash, country reveal)
└── LearnMode
    ├── GlobeMap (ref-controlled, spinning + interactive)
    ├── Hover tooltip
    └── Country info card
```

## Data Flow

```
User action (click country, press key, timer tick)
  → Component handler
    → Store action (handleGuess, tick, skipCountry, etc.)
      → Zustand set() mutates state
        → Subscribed components re-render via selectors
          → Side effects fire (sounds, globe state updates)
```

### Two Zustand Stores

| Store | Purpose | Persistence |
|-------|---------|-------------|
| `gameStore` | Game state: screen, queue, score, lives, timer | None (ephemeral) |
| `settingsStore` | User preferences: region, difficulty, mode, sound | `localStorage` via Zustand `persist` |

Settings are bundled into an immutable `GameSettings` object via `getGameSettings()` and passed to `startGame()`. This prevents mutation of user preferences during gameplay.

### Selectors

All store access uses inline selectors:
```ts
const score = useGameStore((s) => s.score);
```

## Globe as Ref-Controlled Component

`GlobeMap` exposes an imperative `GlobeMapHandle` via `forwardRef`:

| Method | Purpose |
|--------|---------|
| `flyTo(center, zoom)` | Animate globe to coordinates |
| `setCountryState(iso, state)` | Set hover/guessed/wrong feature state |
| `clearAllStates()` | Reset all country visual states |

**Why imperative?** Globe visual state (hover highlights, country colors) is ephemeral and high-frequency. Routing it through React state would cause re-render storms on every mouse move. Instead, `GameScreen` and `LearnMode` call ref methods directly, and Mapbox style expressions read feature state to render colors.

## Side Effects

| Effect | Location | Trigger |
|--------|----------|---------|
| Timer | `useTimer` hook in GameScreen | `setInterval` → `store.tick()` every 1s |
| Sounds | `lib/sound.ts` (Howler.js) | Called from store actions: `handleGuess`, `tick`, `endGame` |
| Sound mute sync | `App.tsx` | Watches `settingsStore.soundEnabled` → `setMuted()` |
| Clipboard | `GameOverModal` | Share button copies results text |
| Keyboard | `GameScreen` | Escape = quit modal, M = toggle sound |

## File Organization

```
src/
├── components/
│   ├── Game/          # In-game HUD and modals
│   ├── Globe/         # Mapbox wrapper, styles, interaction hooks
│   ├── Learn/         # Learn/explore mode
│   ├── Menu/          # Main menu and settings
│   └── UI/            # Reusable primitives (Button, Select)
├── stores/            # Zustand stores (game state, settings)
├── hooks/             # React hooks (useTimer)
├── lib/               # Pure utilities (sound, shuffle, daily challenge)
├── data/              # Static data (countries, regions, scoring formulas)
└── types/             # TypeScript interfaces and type unions
```

Conventions:
- One component per file, named export matching filename
- Stores export a single `use*Store` hook
- `data/` contains static arrays and lookup maps, no runtime state
- `lib/` contains pure functions and singleton modules (no React)

## Key Architectural Decisions

- **No router**: Screen state in Zustand is simpler for a single-page game with only 4 screens
- **ISO A2 as universal key**: All systems (queue, guesses, feature state, data lookup) use `iso_a2`
- **Queue built once at game start**: Filtering by region/difficulty happens in `buildQueue()`, not per-guess
- **Feature state over React state**: Mapbox `setFeatureState()` + style expressions handle all country coloring without React re-renders
- **Settings → GameSettings snapshot**: Decouples persisted preferences from in-flight game state
- **`endedAt` timestamp**: Freezes elapsed time on results screen so re-renders don't update the clock
