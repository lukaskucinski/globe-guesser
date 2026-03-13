import { useEffect, useRef, useCallback } from "react";
import type mapboxgl from "mapbox-gl";

const ROTATION_SPEED = 0.006;
const RESUME_DELAY_MS = 3000;

export function useGlobeRotation(map: mapboxgl.Map | null, enabled: boolean) {
  const isSpinning = useRef(true);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const spin = useCallback(() => {
    if (!map || !isSpinning.current || !enabled) return;

    const center = map.getCenter();
    center.lng += ROTATION_SPEED;
    map.easeTo({
      center,
      duration: 16,
      easing: (t) => t,
    });
  }, [map, enabled]);

  const pauseRotation = useCallback(() => {
    isSpinning.current = false;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);

    resumeTimer.current = setTimeout(() => {
      isSpinning.current = true;
    }, RESUME_DELAY_MS);
  }, []);

  useEffect(() => {
    if (!map || !enabled) return;

    const interval = setInterval(spin, 16);

    const handleInteraction = () => pauseRotation();
    map.on("mousedown", handleInteraction);
    map.on("touchstart", handleInteraction);
    map.on("wheel", handleInteraction);

    return () => {
      clearInterval(interval);
      map.off("mousedown", handleInteraction);
      map.off("touchstart", handleInteraction);
      map.off("wheel", handleInteraction);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, [map, enabled, spin, pauseRotation]);
}
