import { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from "react";
import mapboxgl from "mapbox-gl";
import { useGlobeRotation } from "./useGlobeRotation";
import { useCountryInteraction } from "./useCountryInteraction";
import {
  COUNTRY_SOURCE_ID,
  MICRO_SOURCE_ID,
  LABEL_SOURCE_ID,
  countryFillLayer,
  countryLineLayer,
  microCircleLayer,
  countryLabelLayer,
} from "./mapStyles";
import { COUNTRIES } from "../../data/countries";

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

export const GlobeMap = forwardRef<GlobeMapHandle, GlobeMapProps>(
  ({ spinning = true, interactive = true, onCountryClick, onCountryHover }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const [mapReady, setMapReady] = useState(false);

    // Initialize map
    useEffect(() => {
      if (!containerRef.current || mapRef.current) return;

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/dark-v11",
        projection: "globe",
        center: [20, 20],
        zoom: 1.5,
        maxZoom: 8,
        minZoom: 1,
        antialias: true,
        attributionControl: false,
      });

      map.on("style.load", () => {
        // Atmosphere/fog for the globe
        map.setFog({
          color: "rgb(10, 10, 26)",
          "high-color": "rgb(20, 20, 50)",
          "horizon-blend": 0.04,
          "space-color": "rgb(5, 5, 15)",
          "star-intensity": 0.6,
        });

        // Hide all text labels from the base style
        const layers = map.getStyle().layers;
        if (layers) {
          for (const layer of layers) {
            if (layer.type === "symbol") {
              map.setLayoutProperty(layer.id, "visibility", "none");
            }
          }
        }

        // Add country boundaries source
        map.addSource(COUNTRY_SOURCE_ID, {
          type: "vector",
          url: "mapbox://mapbox.country-boundaries-v1",
          promoteId: { country_boundaries: "iso_3166_1" },
        });

        // Add fill layer (for click detection + coloring)
        map.addLayer(countryFillLayer);

        // Add line layer (outlines)
        map.addLayer(countryLineLayer);

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
        map.addLayer(microCircleLayer);

        // Add country name labels (hidden by default, shown via feature state)
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
        map.addLayer(countryLabelLayer);

        setMapReady(true);
      });

      mapRef.current = map;

      return () => {
        map.remove();
        mapRef.current = null;
        setMapReady(false);
      };
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
