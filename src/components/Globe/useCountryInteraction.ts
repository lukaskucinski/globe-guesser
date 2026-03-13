import { useEffect, useRef, useCallback } from "react";
import type mapboxgl from "mapbox-gl";
import {
  COUNTRY_SOURCE_ID,
  MICRO_SOURCE_ID,
  LABEL_SOURCE_ID,
  COUNTRY_FILL_LAYER_ID,
  MICRO_CIRCLE_LAYER_ID,
} from "./mapStyles";

interface UseCountryInteractionOptions {
  map: mapboxgl.Map | null;
  onCountryClick?: (isoCode: string) => void;
  onCountryHover?: (isoCode: string | null) => void;
  enabled: boolean;
}

export function useCountryInteraction({
  map,
  onCountryClick,
  onCountryHover,
  enabled,
}: UseCountryInteractionOptions) {
  const hoveredId = useRef<string | null>(null);

  const clearHover = useCallback(() => {
    if (!map || !hoveredId.current) return;
    map.setFeatureState(
      { source: COUNTRY_SOURCE_ID, sourceLayer: "country_boundaries", id: hoveredId.current },
      { hover: false }
    );
    hoveredId.current = null;
    onCountryHover?.(null);
  }, [map, onCountryHover]);

  useEffect(() => {
    if (!map || !enabled) return;

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      // Check micro-state circles first (they're on top)
      const microFeatures = map.queryRenderedFeatures(e.point, {
        layers: [MICRO_CIRCLE_LAYER_ID],
      });
      if (microFeatures.length > 0) {
        const iso = microFeatures[0].properties?.iso as string | undefined;
        if (iso) {
          onCountryClick?.(iso);
          return;
        }
      }

      // Then check country polygons
      const features = map.queryRenderedFeatures(e.point, {
        layers: [COUNTRY_FILL_LAYER_ID],
      });
      if (features.length > 0) {
        const iso = features[0].properties?.iso_3166_1 as string | undefined;
        if (iso) {
          onCountryClick?.(iso);
        }
      }
    };

    const handleMouseMove = (e: mapboxgl.MapMouseEvent) => {
      // Check micro circles
      const microFeatures = map.queryRenderedFeatures(e.point, {
        layers: [MICRO_CIRCLE_LAYER_ID],
      });
      if (microFeatures.length > 0) {
        const iso = microFeatures[0].properties?.iso as string | undefined;
        if (iso && iso !== hoveredId.current) {
          clearHover();
          hoveredId.current = iso;
          map.setFeatureState(
            { source: COUNTRY_SOURCE_ID, sourceLayer: "country_boundaries", id: iso },
            { hover: true }
          );
          onCountryHover?.(iso);
          map.getCanvas().style.cursor = "pointer";
        }
        return;
      }

      // Check country polygons
      const features = map.queryRenderedFeatures(e.point, {
        layers: [COUNTRY_FILL_LAYER_ID],
      });
      if (features.length > 0) {
        const iso = features[0].properties?.iso_3166_1 as string | undefined;
        if (iso && iso !== hoveredId.current) {
          clearHover();
          hoveredId.current = iso;
          map.setFeatureState(
            { source: COUNTRY_SOURCE_ID, sourceLayer: "country_boundaries", id: iso },
            { hover: true }
          );
          onCountryHover?.(iso);
          map.getCanvas().style.cursor = "pointer";
        }
      } else {
        clearHover();
        map.getCanvas().style.cursor = "";
      }
    };

    const handleMouseLeave = () => {
      clearHover();
      if (map.getCanvas()) {
        map.getCanvas().style.cursor = "";
      }
    };

    map.on("click", handleClick);
    map.on("mousemove", handleMouseMove);
    map.on("mouseleave", COUNTRY_FILL_LAYER_ID, handleMouseLeave);

    return () => {
      map.off("click", handleClick);
      map.off("mousemove", handleMouseMove);
      map.off("mouseleave", COUNTRY_FILL_LAYER_ID, handleMouseLeave);
      clearHover();
    };
  }, [map, enabled, onCountryClick, onCountryHover, clearHover]);

  const setCountryState = useCallback(
    (iso: string, state: Record<string, boolean | number>) => {
      if (!map) return;
      // Set state on both the vector tile and the micro-state GeoJSON
      map.setFeatureState(
        { source: COUNTRY_SOURCE_ID, sourceLayer: "country_boundaries", id: iso },
        state
      );
      // Also set on micro-state source if it exists there
      try {
        map.setFeatureState(
          { source: MICRO_SOURCE_ID, id: iso },
          state
        );
      } catch {
        // Not a micro-state, ignore
      }
      // Also set on label source for name display
      try {
        map.setFeatureState(
          { source: LABEL_SOURCE_ID, id: iso },
          state
        );
      } catch {
        // Ignore
      }
    },
    [map]
  );

  const clearAllStates = useCallback(() => {
    if (!map) return;
    map.removeFeatureState({ source: COUNTRY_SOURCE_ID, sourceLayer: "country_boundaries" });
    try {
      map.removeFeatureState({ source: MICRO_SOURCE_ID });
    } catch {
      // Ignore if source doesn't exist
    }
    try {
      map.removeFeatureState({ source: LABEL_SOURCE_ID });
    } catch {
      // Ignore
    }
  }, [map]);

  return { setCountryState, clearAllStates };
}
