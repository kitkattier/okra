import * as React from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

function MapComponent() {
  const mapContainer = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (mapContainer.current) {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: "https://demotiles.maplibre.org/style.json",
        center: [0, 0],
        zoom: 1,
      });

      return () => {
        map.remove();
      };
    }
  }, []);

  return (
    <>
      <div id="map" ref={mapContainer} style={{ width: "100%", height: "100%" }} />
    </>
  );
}

export default MapComponent;
