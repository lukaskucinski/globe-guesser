import { useRef, useCallback } from "react";
import { GlobeMap, type GlobeMapHandle } from "./components/Globe/GlobeMap";

function App() {
  const globeRef = useRef<GlobeMapHandle>(null);

  const handleCountryClick = useCallback((iso: string) => {
    console.log("Clicked country:", iso);
    globeRef.current?.setCountryState(iso, { guessed: true });
  }, []);

  return (
    <div className="relative w-full h-full bg-bg">
      <GlobeMap
        ref={globeRef}
        spinning={true}
        interactive={true}
        onCountryClick={handleCountryClick}
      />
    </div>
  );
}

export default App;
