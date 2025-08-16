import "maplibre-gl/dist/maplibre-gl.css";
import { useMap } from "~/context/mapContext";

function MapComponent() {
  const { mapContainer } = useMap();

  return <div id="map" ref={mapContainer} className="h-dvh w-full" />;
}

export default MapComponent;
