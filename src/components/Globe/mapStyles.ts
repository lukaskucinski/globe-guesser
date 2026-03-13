import type { CircleLayerSpecification, FillLayerSpecification, LineLayerSpecification, SymbolLayerSpecification } from "mapbox-gl";

export const COUNTRY_SOURCE_ID = "country-boundaries";
export const MICRO_SOURCE_ID = "micro-states";
export const LABEL_SOURCE_ID = "country-labels";
export const COUNTRY_FILL_LAYER_ID = "country-fills";
export const COUNTRY_LINE_LAYER_ID = "country-lines";
export const COUNTRY_HOVER_LAYER_ID = "country-hover";
export const MICRO_CIRCLE_LAYER_ID = "micro-circles";
export const COUNTRY_LABEL_LAYER_ID = "country-label-names";

export const countryFillLayer: FillLayerSpecification = {
  id: COUNTRY_FILL_LAYER_ID,
  type: "fill",
  source: COUNTRY_SOURCE_ID,
  "source-layer": "country_boundaries",
  paint: {
    "fill-color": [
      "case",
      ["boolean", ["feature-state", "guessed"], false],
      "#22c55e",
      ["boolean", ["feature-state", "wrong"], false],
      "#ef4444",
      ["boolean", ["feature-state", "hover"], false],
      "rgba(6, 182, 212, 0.15)",
      "rgba(255, 255, 255, 0.03)",
    ],
    "fill-opacity": [
      "case",
      ["boolean", ["feature-state", "guessed"], false],
      0.6,
      ["boolean", ["feature-state", "wrong"], false],
      0.5,
      ["boolean", ["feature-state", "hover"], false],
      1,
      1,
    ],
  },
  filter: [
    "all",
    ["==", ["get", "disputed"], "false"],
    ["any", ["==", "all", ["get", "worldview"]], ["in", "US", ["get", "worldview"]]],
  ],
};

// Circle markers for micro-states (clickable at low zoom)
export const microCircleLayer: CircleLayerSpecification = {
  id: MICRO_CIRCLE_LAYER_ID,
  type: "circle",
  source: MICRO_SOURCE_ID,
  paint: {
    "circle-radius": [
      "interpolate",
      ["linear"],
      ["zoom"],
      1, 6,
      4, 10,
      6, 14,
      8, 0,
    ],
    "circle-color": [
      "case",
      ["boolean", ["feature-state", "guessed"], false],
      "#22c55e",
      ["boolean", ["feature-state", "wrong"], false],
      "#ef4444",
      "rgba(6, 182, 212, 0.6)",
    ],
    "circle-stroke-width": 1.5,
    "circle-stroke-color": "rgba(6, 182, 212, 0.8)",
    "circle-opacity": [
      "interpolate",
      ["linear"],
      ["zoom"],
      1, 0.8,
      6, 0.6,
      7, 0,
    ],
    "circle-stroke-opacity": [
      "interpolate",
      ["linear"],
      ["zoom"],
      1, 1,
      6, 0.6,
      7, 0,
    ],
  },
};

export const countryLineLayer: LineLayerSpecification = {
  id: COUNTRY_LINE_LAYER_ID,
  type: "line",
  source: COUNTRY_SOURCE_ID,
  "source-layer": "country_boundaries",
  paint: {
    "line-color": [
      "case",
      ["boolean", ["feature-state", "guessed"], false],
      "#22c55e",
      "rgba(6, 182, 212, 0.3)",
    ],
    "line-width": [
      "case",
      ["boolean", ["feature-state", "guessed"], false],
      1.5,
      0.5,
    ],
  },
  filter: [
    "all",
    ["==", ["get", "disputed"], "false"],
    ["any", ["==", "all", ["get", "worldview"]], ["in", "US", ["get", "worldview"]]],
  ],
};

// Country name labels — hidden by default, shown via feature state
export const countryLabelLayer: SymbolLayerSpecification = {
  id: COUNTRY_LABEL_LAYER_ID,
  type: "symbol",
  source: LABEL_SOURCE_ID,
  layout: {
    "text-field": ["get", "name"],
    "text-size": [
      "interpolate",
      ["linear"],
      ["zoom"],
      1, 10,
      4, 14,
      8, 18,
    ],
    "text-font": ["DIN Pro Medium", "Arial Unicode MS Regular"],
    "text-anchor": "center",
    "text-allow-overlap": false,
    "text-ignore-placement": false,
    "text-padding": 2,
  },
  paint: {
    "text-opacity": [
      "case",
      ["boolean", ["feature-state", "guessed"], false], 1,
      ["boolean", ["feature-state", "wrong"], false], 1,
      0,
    ],
    "text-color": [
      "case",
      ["boolean", ["feature-state", "guessed"], false], "#22c55e",
      ["boolean", ["feature-state", "wrong"], false], "#ef4444",
      "#ffffff",
    ],
    "text-halo-color": "rgba(0, 0, 0, 0.8)",
    "text-halo-width": 1.5,
  },
};
