# Styling Guide

## Theme System

Dark/light theme via `data-theme` attribute on `<html>`, toggled in GameSettings and persisted in settingsStore.

### Token Architecture
- `@theme` block in `src/index.css` defines token names + dark defaults
- `html[data-theme="light"]` rule overrides values for light mode
- Accent colors (`accent`, `correct`, `wrong`, `gold`) are shared across both themes

### Dark Theme Colors (default)
| Token | Value | Usage |
|-------|-------|-------|
| `bg` | `#0a0a1a` | Deepest background (body, space behind globe) |
| `surface` | `#12122a` | Card/modal backgrounds |
| `surface-light` | `#1a1a3a` | Lighter cards, input backgrounds, stat boxes |
| `border` | `#2a2a4a` | Subtle borders between sections |
| `text` | `#e2e8f0` | Primary text (light slate) |
| `text-dim` | `#94a3b8` | Secondary text, labels, descriptions |

### Light Theme Overrides
| Token | Value | Notes |
|-------|-------|-------|
| `bg` | `#f5f7fa` | Cool light gray |
| `surface` | `#ffffff` | White cards |
| `surface-light` | `#d8dfe8` | Needs contrast against translucent white cards |
| `border` | `#e2e8f0` | Soft visible borders |
| `text` | `#1a202c` | Dark slate |
| `text-dim` | `#718096` | Muted gray |

### Theme-Adaptive Tokens
| Token | Dark | Light | Purpose |
|-------|------|-------|---------|
| `glass-border` | `rgba(255,255,255,0.06)` | `rgba(0,0,0,0.1)` | Panel/card borders |
| `glass-bg` | `rgba(255,255,255,0.04)` | `rgba(0,0,0,0.03)` | Ghost hover backgrounds |
| `card` | `rgba(18,18,42,0.1)` | `rgba(255,255,255,0.1)` | Translucent card background |
| `card-shadow` | `0 8px 60px rgba(6,182,212,0.08)` | `0 4px 24px rgba(0,0,0,0.08)` | Card shadow (cyan glow vs gray) |

### Shared Colors (both themes)
| Token | Value | Usage |
|-------|-------|-------|
| `accent` | `#06b6d4` | Primary interactive color (cyan) |
| `accent-dim` | `#0891b2` | Hover/gradient endpoint |
| `correct` | `#22c55e` | Correct guess (green) |
| `wrong` | `#ef4444` | Wrong guess (red) |
| `gold` | `#f59e0b` | Score display |
| `glow` | `#06b6d4` | Shadow glow effects |

### Font
- `--font-sans: "Inter"` — loaded as the primary typeface

## Glass / Frosted Aesthetic

The signature pattern for panels and modals (theme-adaptive):

```
bg-card backdrop-blur-md border border-glass-border
shadow-[--color-card-shadow]
```

- `bg-card` — 10% opacity in both themes (dark surface or white)
- `backdrop-blur-md` creates frosted glass effect
- `border-glass-border` — white at 6% (dark) or black at 10% (light)
- `shadow-[--color-card-shadow]` — cyan glow (dark) or gray shadow (light)

## Button Variants

Three variants in `UI/Button.tsx`:

| Variant | Style | Use case |
|---------|-------|----------|
| `primary` | Gradient `from-accent to-accent-dim`, glow shadow | CTAs (Play, Start Game) |
| `secondary` | `bg-surface-light/80`, subtle border | Secondary actions (Share) |
| `ghost` | Transparent, text only | Tertiary actions (Back to Menu) |

Sizes: `sm` (compact), `md` (default), `lg` (prominent). All have `active:scale-[0.98]` press feedback.

## Custom Select Dropdown

`UI/Select.tsx` replaces native `<select>` with a fully styled dropdown:
- Trigger: `bg-surface-light/80` with cyan focus ring
- Dropdown: `bg-surface-light` with `rounded-xl shadow-xl`
- Selected option: `bg-accent/15 text-accent`
- Closes on outside click and Escape key

## Animations

| Class | Duration | Effect |
|-------|----------|--------|
| `animate-menu-enter` | 0.6s | Fade in + slide up + scale 96%→100% |
| `animate-title-glow` | 4s infinite | Pulsing cyan text shadow |
| `animate-fade-in-out` | 1.5s | Fade in from top, hold, fade out |
| `animate-float-up` | 1.2s | Floating particles with upward drift |
| `animate-score-pop` | 0.4s | Scale pop: 1→1.3→1 |

## Utility Classes

- `.scrollbar-hide` — hides scrollbar while preserving scroll (`scrollbar-width: none` + `::-webkit-scrollbar`)
- Bottom fade gradient: `bg-gradient-to-t from-bg/80 to-transparent` for scroll hints

## Border Conventions

- Panel borders: `border border-glass-border`
- Hover borders: `hover:border-border`
- Dividers: `border-t border-glass-border`
- Focus rings: `focus:border-accent/60 focus:shadow-[0_0_0_3px_rgba(6,182,212,0.1)]`

## Critical Gotcha

Never use unlayered CSS resets with Tailwind v4. All base styles must be inside `@layer base { }` or they will override Tailwind utilities. This caused a complete style breakdown in a previous session.
