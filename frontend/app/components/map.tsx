import * as React from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

function MapComponent() {
  const mapContainer = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [0, 0],
      zoom: 1,
    });

    map.on("style.load", () => {
      map.addLayer({
        id: "pixels",
        type: "raster",
        // minzoom: 11,
        // maxzoom: 11,
        source: {
          type: "raster",
          tiles: ["http://localhost:8000/static/tiles/{x}/{y}.png"],
          minzoom: 11,
          maxzoom: 11,
          tileSize: 550,
        },
        paint: {
          "raster-resampling": "nearest",
        },
      });
    });

    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "top-left",
    );
    return () => {
      map.remove();
    };
  }, []);

  return (
    <>
      <div id="map" ref={mapContainer} className="h-dvh w-full" />
    </>
  );
}

export default MapComponent;
