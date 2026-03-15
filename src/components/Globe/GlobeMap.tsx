import { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from "react";
import mapboxgl from "mapbox-gl";
import { useGlobeRotation } from "./useGlobeRotation";
import { useCountryInteraction } from "./useCountryInteraction";
import {
  COUNTRY_SOURCE_ID,
  MICRO_SOURCE_ID,
  LABEL_SOURCE_ID,
  getCountryFillLayer,
  getCountryLineLayer,
  getMicroCircleLayer,
  getCountryLabelLayer,
  MAP_STYLES,
  FOG_CONFIGS,
} from "./mapStyles";
import { COUNTRIES } from "../../data/countries";
import { useSettingsStore } from "../../stores/settingsStore";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export interface GlobeMapHandle {
  flyTo: (lngLat: [number, number], zoom?: number) => void;
  setCountryState: (iso: string, state: Record<string, boolean | number>) => void;
  clearAllStates: () => void;
  getMap: () => mapboxgl.Map | null;
}

interface GlobeMapProps {
  spinning?: boolean;
  interactive?: boolean;
  onCountryClick?: (isoCode: string) => void;
  onCountryHover?: (isoCode: string | null) => void;
}

function setupMapLayers(map: mapboxgl.Map, theme: "dark" | "light") {
  // Hide all text labels from the base style
  const layers = map.getStyle().layers;
  if (layers) {
    for (const layer of layers) {
      if (layer.type === "symbol") {
        map.setLayoutProperty(layer.id, "visibility", "none");
      }
    }
  }

  // Override base style colors for light theme
  if (theme === "light") {
    // "land" is a background-type layer (covers everything, land sits under water)
    map.setPaintProperty("land", "background-color", "#ebf2f4");
    // "water" is a fill layer on top
    map.setPaintProperty("water", "fill-color", "#bdd3e0");
  }

  // Set fog/atmosphere
  map.setFog(FOG_CONFIGS[theme] as mapboxgl.FogSpecification);

  // Add country boundaries source
  map.addSource(COUNTRY_SOURCE_ID, {
    type: "vector",
    url: "mapbox://mapbox.country-boundaries-v1",
    promoteId: { country_boundaries: "iso_3166_1" },
  });

  // Add fill layer
  map.addLayer(getCountryFillLayer(theme));

  // Add line layer
  map.addLayer(getCountryLineLayer(theme));

  // Add micro-state circle markers
  const microStates = COUNTRIES.filter((c) => c.isMicroState);
  map.addSource(MICRO_SOURCE_ID, {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: microStates.map((c) => ({
        type: "Feature" as const,
        id: c.iso_a2,
        properties: { iso: c.iso_a2, name: c.name },
        geometry: {
          type: "Point" as const,
          coordinates: c.labelLngLat,
        },
      })),
    },
    promoteId: "iso",
  });
  map.addLayer(getMicroCircleLayer(theme));

  // Add country name labels
  map.addSource(LABEL_SOURCE_ID, {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: COUNTRIES.map((c) => ({
        type: "Feature" as const,
        id: c.iso_a2,
        properties: { iso: c.iso_a2, name: c.name },
        geometry: {
          type: "Point" as const,
          coordinates: c.labelLngLat,
        },
      })),
    },
    promoteId: "iso",
  });
  map.addLayer(getCountryLabelLayer(theme));
}

export const GlobeMap = forwardRef<GlobeMapHandle, GlobeMapProps>(
  ({ spinning = true, interactive = true, onCountryClick, onCountryHover }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [mapReady, setMapReady] = useState(false);
    const theme = useSettingsStore((s) => s.theme);

    // Initialize map
    useEffect(() => {
      if (!containerRef.current || mapRef.current) return;

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: MAP_STYLES[theme],
        projection: "globe",
        center: [20, 20],
        zoom: 2.8,
        maxZoom: 8,
        minZoom: 1,
        antialias: true,
        attributionControl: false,
      });

      map.once("style.load", () => {
        setupMapLayers(map, theme);
        setMapReady(true);
      });

      mapRef.current = map;

      return () => {
        map.remove();
        mapRef.current = null;
        setMapReady(false);
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const map = mapReady ? mapRef.current : null;

    // Globe rotation
    useGlobeRotation(map, spinning);

    // Country interaction
    const { setCountryState, clearAllStates } = useCountryInteraction({
      map,
      onCountryClick,
      onCountryHover,
      enabled: interactive,
    });

    // Expose imperative methods
    const flyTo = useCallback(
      (lngLat: [number, number], zoom?: number) => {
        if (!mapRef.current) return;
        mapRef.current.flyTo({
          center: lngLat,
          zoom: zoom ?? 3,
          duration: 2000,
          essential: true,
        });
      },
      []
    );

    useImperativeHandle(ref, () => ({
      flyTo,
      setCountryState,
      clearAllStates,
      getMap: () => mapRef.current,
    }), [flyTo, setCountryState, clearAllStates]);

    return (
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full"
      />
    );
  }
);

GlobeMap.displayName = "GlobeMap";
