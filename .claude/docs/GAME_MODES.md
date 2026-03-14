# Game Modes & Scoring

## State Machine

```
menu → playing → results → menu (reset)
```

The `screen` field in `gameStore` drives which UI renders. Transitions to `results` happen when:
1. All countries guessed (`currentIndex >= queue.length`)
2. Timer expires (`timeRemaining <= 0`)
3. Lives depleted (`lives <= 0` in a lives mode)
4. Player quits (`endGame()`)

An `endedAt` timestamp is captured on every transition to `results` to freeze the elapsed time display.

## Wrong Guess Modes

| Mode | Lives | On Wrong Guess |
|------|-------|----------------|
| `sudden_death` | 1 | Game over immediately |
| `3lives` | 3 | Lose a life |
| `5lives` | 5 | Lose a life |
| `unlimited` | -- | Nothing (keep playing) |
| `penalty` | -- | Deduct `basePoints * 0.25` from score |

Helper functions in `gameStore.ts`:
- `livesForMode(mode)` — returns initial life count (1, 3, 5, or 0)
- `isLivesMode(mode)` — returns true for sudden_death/3lives/5lives

## Difficulty Tiers & Queue Building

| Difficulty | Tiers Included | Typical Count |
|------------|---------------|---------------|
| Easy | 1 only | ~63 |
| Medium | 1–2 | ~149 |
| Hard | 1–3 | ~213 |
| Insane | 1–4 (all) | ~241 |

Queue is built by filtering `COUNTRIES` by region (if set) and difficulty, then shuffling. Daily challenges use a seeded shuffle of 30 medium-difficulty countries.

## Scoring Formula

### Base Points (per country, computed once)

```
basePoints = 10 + areaScore + popScore + tierBonus
```

| Component | Formula | Range |
|-----------|---------|-------|
| Area score | `40 * (1 - area/17,098,242)` | 0–40 (smaller = more) |
| Pop score | `30 * (1 - pop/1,425,893,465)` | 0–30 (smaller = more) |
| Tier bonus | `20 * ((difficulty - 1) / 3)` | 0–20 |

### Guess Points (per correct answer)

Starting from `basePoints`, multiplied by:
- **First-try bonus**: x1.5 if `currentAttempts === 0`
- **Streak bonus**: `+min(streak * 5, 25)` (caps at 5 consecutive correct)
- **Time bonus** (timed modes): `x(1 + timeRemaining/totalTime * 0.5)` (0–50% boost)

### Penalties

- **Wrong guess (penalty mode)**: `-basePoints * 0.25`
- **Skip**: `-basePoints * 0.5`, resets streak, uses one skip from budget

Score is clamped to minimum 0.

## Timer

- Configured as `TimeLimit`: 0 (off), 30s, 60s, 120s, or 300s
- `useTimer` hook calls `store.tick()` every 1 second when `screen === "playing"`
- Tick sound plays at <= 10 seconds remaining
- Game over sound + transition to results at 0

## Skip System

- Budget: 0–5 (configured via slider in settings)
- Each skip advances to next country, records as incorrect guess
- Penalty: half of base points for the skipped country
- Resets streak to 0

## Daily Challenge

- Deterministic: date string → numeric seed → Mulberry32 RNG → seeded shuffle
- Pool: 30 countries with `difficulty <= 2` and `area >= 1000`
- Same date = same countries for all players
- Fixed settings: all regions, medium difficulty, 5 min timer, 3 lives

## Guess Lifecycle

`handleGuess(isoCode)` returns:
- `"already_guessed"` — country already correct or game ended
- `"correct"` — points awarded, streak incremented, advances to next country
- `"wrong"` — life lost (if lives mode), penalty applied (if penalty mode), streak reset

Each guess is recorded as a `GuessResult` with attempts, points, and elapsed time.
