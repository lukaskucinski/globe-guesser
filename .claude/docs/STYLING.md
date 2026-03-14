# Styling Guide

## Theme Tokens

Defined in `src/index.css` via Tailwind v4's `@theme` block:

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `bg` | `#0a0a1a` | Deepest background (body, space behind globe) |
| `surface` | `#12122a` | Card/modal backgrounds |
| `surface-light` | `#1a1a3a` | Lighter cards, input backgrounds, stat boxes |
| `border` | `#2a2a4a` | Subtle borders between sections |
| `accent` | `#06b6d4` | Primary interactive color (cyan). Buttons, links, glows |
| `accent-dim` | `#0891b2` | Hover/gradient endpoint for accent |
| `correct` | `#22c55e` | Correct guess feedback (green) |
| `correct-dim` | `#16a34a` | Hover state for correct |
| `wrong` | `#ef4444` | Wrong guess feedback (red) |
| `wrong-dim` | `#dc2626` | Hover state for wrong |
| `gold` | `#f59e0b` | Score display, premium states |
| `text` | `#e2e8f0` | Primary text (light slate) |
| `text-dim` | `#94a3b8` | Secondary text, labels, descriptions |
| `glow` | `#06b6d4` | Shadow glow effects (same as accent) |

### Font
- `--font-sans: "Inter"` — loaded as the primary typeface

## Glass / Frosted Aesthetic

The signature pattern for panels and modals:

```
bg-surface/10 backdrop-blur-md border border-white/[0.06]
shadow-[0_8px_60px_rgba(6,182,212,0.08)]
```

- Very low-opacity background (10%) for transparency
- `backdrop-blur-md` creates frosted glass effect
- White border at 6% opacity for subtle separation
- Cyan-tinted shadow for soft glow depth

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
- Bottom fade gradient: `bg-gradient-to-t from-[#0a0a1a]/80 to-transparent` for scroll hints

## Border Conventions

- Panel borders: `border border-white/[0.06]`
- Hover borders: `hover:border-white/[0.1]`
- Dividers: `border-t border-white/[0.06]`
- Focus rings: `focus:border-accent/60 focus:shadow-[0_0_0_3px_rgba(6,182,212,0.1)]`

## Critical Gotcha

Never use unlayered CSS resets with Tailwind v4. All base styles must be inside `@layer base { }` or they will override Tailwind utilities. This caused a complete style breakdown in a previous session.
