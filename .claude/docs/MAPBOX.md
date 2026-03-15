# Mapbox Integration

## Sources & Tilesets

| Source ID | Type | Data | promoteId |
|-----------|------|------|-----------|
| `country_boundaries` | Vector (`mapbox://mapbox.country-boundaries-v1`) | Country polygons | `{ country_boundaries: "iso_3166_1" }` |
| `micro-states` | GeoJSON | Point features from `COUNTRIES` where `isMicroState` | `"iso"` |
| `country-labels` | GeoJSON | Point features for all countries | `"iso"` |

The vector tileset uses `iso_3166_1` as the feature ID; the two GeoJSON sources use `iso`. This matters when extracting properties from `queryRenderedFeatures()`.

## Layers

| Layer ID | Type | Source | Purpose |
|----------|------|--------|---------|
| `country-fills` | Fill | country_boundaries | Click/hover detection + color state |
| `country-lines` | Line | country_boundaries | Border outlines (color changes on guess) |
| `micro-circles` | Circle | micro-states | Clickable markers for small countries |
| `country-label-names` | Symbol | country-labels | Country name text (hidden until guessed) |

All base style text labels (`dark-v11`) are hidden; custom labels from GeoJSON replace them.

## Feature State Pattern

State is applied to **three sources simultaneously** to keep them in sync:

```ts
map.setFeatureState(
  { source: COUNTRY_SOURCE_ID, sourceLayer: "country_boundaries", id: iso },
  { hover: true, guessed: true, wrong: false }
);
// Also applied to micro-states and country-labels (errors caught for missing entries)
```

Paint expressions use `case` with feature-state booleans. Priority order:
1. `guessed` = green (`#22c55e`)
2. `wrong` = red (`#ef4444`)
3. `hover` = cyan highlight (`rgba(6,182,212,0.15)`)
4. Default = near-transparent white

Labels are hidden (opacity 0) until `guessed` or `wrong` is set.

## Click & Hover Detection

Queries happen in priority order:
1. **Micro-circles first** — small countries sit "on top", extracts `iso` property
2. **Country fills second** — fallback for regular polygons, extracts `iso_3166_1` property

Hover tracking uses a `hoveredId` ref; `clearHover()` must be called before setting a new hover to avoid stale state. Cursor changes to `pointer` on hover.

## Globe Projection

- Projection: `globe` (3D sphere)
- Zoom range: 1–8
- Style per theme: `dark-v11` (dark) / `light-v11` (light)
- Theme switching uses `key={theme}` on GlobeMap to cleanly remount (avoids `map.setStyle()` race conditions)
- Light theme overrides base style layers: ocean (`water` fill → `#bdd3e0`), land (`land` background → `#ebf2f4`)

### Fog / Atmosphere
| Setting | Dark | Light |
|---------|------|-------|
| `color` | `rgb(10,10,26)` | `rgb(189,211,224)` (matches ocean) |
| `high-color` | `rgb(20,20,50)` | `rgb(40,40,70)` |
| `space-color` | `rgb(5,5,15)` | `rgb(10,10,26)` (dark space in both) |
| `star-intensity` | `0.6` | `0.4` |

### Layer Definitions
Layer objects in `mapStyles.ts` are theme-parameterized functions (`getCountryFillLayer(theme)`, etc.) to support different default fills and label halos per theme.

## Auto-Rotation

- Speed: `0.006` degrees/frame at 60fps
- Uses `easeTo()` with 16ms duration for smooth updates
- Pauses on user interaction (mouse, touch, wheel)
- Auto-resumes after 3 seconds idle

## Micro-Circle Zoom Scaling

Circles scale inversely with zoom for visibility:
- Zoom 1: 6px, Zoom 4: 10px, Zoom 6: 14px, Zoom 8: 0px (hidden)

At high zoom, polygons become large enough to click directly.

## Disputed Territory Filter

Both fill and line layers exclude disputed areas:
```ts
["==", ["get", "disputed"], "false"],
["any", ["==", "all", ["get", "worldview"]], ["in", "US", ["get", "worldview"]]]
```

## Gotchas

- **Double promoteId pattern**: Vector source uses `iso_3166_1`, GeoJSON sources use `iso` — extract the right property per source
- **setFeatureState requires sourceLayer** for vector tiles but not for GeoJSON
- **Layer visibility affects clickability** — `queryRenderedFeatures` only finds visible/rendered features
- **FlyTo animation**: 2000ms with `essential: true` to ensure completion
- Errors when setting state on micro-states/labels for non-existent entries are caught and ignored
- **Never use `map.setStyle()` for theme switching** — causes internal Mapbox errors (`Cannot read properties of undefined (reading 'get')`) due to race conditions with rotation interval and interaction handlers. Use React `key` prop to remount instead.
- **Mapbox light-v11 layer IDs**: `land` is a `background` type layer (not fill), `water` is a `fill` type layer — counterintuitive when overriding colors
