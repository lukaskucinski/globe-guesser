# Country & Territory Data

## CountryMeta Interface

| Field | Type | Purpose |
|-------|------|---------|
| `iso_a2` | string | ISO 3166-1 alpha-2 code (primary identifier, used everywhere) |
| `iso_a3` | string | ISO 3166-1 alpha-3 code |
| `name` | string | Display name |
| `region` | Region | One of: Africa, Asia, Europe, NorthAmerica, SouthAmerica, Oceania |
| `subregion` | string | e.g. "Northern Africa", "South-Eastern Asia" |
| `area_km2` | number | Land area in km² |
| `population` | number | Population count |
| `difficulty` | 1–4 | Difficulty tier |
| `basePoints` | number | Computed by `computeBasePoints()` |
| `isMicroState` | boolean | `true` if `area < 5000` km² |
| `labelLngLat` | [lng, lat] | Coordinates for label placement on globe |

## The c() Helper

All entries in `countries.ts` use a concise constructor:

```ts
c(iso_a2, iso_a3, name, region, subregion, area, pop, difficulty, lng, lat)
```

It computes `basePoints` and `isMicroState` automatically. Entries with `area < 5000` get blue circle markers on the globe (via the `micro-states` GeoJSON source).

## Difficulty Tier Guidelines

| Tier | Label | Criteria | Examples |
|------|-------|----------|---------|
| 1 | Easy | Major/famous, large, easily recognized | France, Brazil, Japan, Nigeria |
| 2 | Medium | Well-known but secondary importance | Croatia, Uruguay, Laos, Zambia |
| 3 | Hard | Smaller, less famous, includes well-known microstates and recognizable territories | Malta, Bhutan, Puerto Rico, Hong Kong |
| 4 | Insane | Obscure territories, remote dependencies | Montserrat, Niue, Pitcairn, Svalbard |

Assignment is manually curated based on recognizability, not purely area/population.

## Adding New Entries

1. Find the ISO alpha-2 and alpha-3 codes
2. Verify the territory exists as a feature in Mapbox's `country-boundaries-v1` tileset (hover test)
3. Add a `c()` call in the appropriate section (sovereign states by region, or territories section)
4. Choose difficulty tier based on recognizability guidelines above
5. Set `lng, lat` to the visual center of the country for label placement
6. If `area < 5000`, the entry automatically gets a micro-state circle marker

## Data Organization

- **Lines ~33–239**: Sovereign states, grouped by region with comment headers
- **Lines ~242–298**: Territories & dependencies, labeled `// -- TERRITORIES & DEPENDENCIES --`
- **Line ~301**: `COUNTRY_MAP` — `Map<string, CountryMeta>` for O(1) lookup by ISO A2

## Regions

Six regions defined in `data/regions.ts`:

| Region key | Display label | Globe center [lng, lat] |
|------------|--------------|------------------------|
| Africa | Africa | [20, 5] |
| Asia | Asia | [90, 35] |
| Europe | Europe | [15, 50] |
| NorthAmerica | North America | [-100, 40] |
| SouthAmerica | South America | [-60, -15] |
| Oceania | Oceania | [140, -25] |

Region centers are used for globe flyTo when filtering by region.

## Current Counts

~241 total entries: 63 tier 1, 86 tier 2, 64 tier 3, 28 tier 4. Territories account for ~44 entries (tiers 3–4).
