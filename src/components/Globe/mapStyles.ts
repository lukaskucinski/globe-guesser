import type { FillLayerSpecification, LineLayerSpecification } from "mapbox-gl";

export const COUNTRY_SOURCE_ID = "country-boundaries";
export const COUNTRY_FILL_LAYER_ID = "country-fills";
export const COUNTRY_LINE_LAYER_ID = "country-lines";
export const COUNTRY_HOVER_LAYER_ID = "country-hover";

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
