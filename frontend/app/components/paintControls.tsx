import { apiRequest, TILE_PATH } from "~/api";
import { useMap } from "~/context/mapContext";
import { getDistanceFromLatLonInM, latLonToTilePixel } from "~/utils";
import ColourPicker from "./colourPicker";
import { useEffect, useRef } from "react";

const PaintControls = () => {
  const { mapRef } = useMap();
  const rgb = useRef<[number, number, number]>([255, 255, 255]);

  async function onClick(e: maplibregl.MapMouseEvent) {
    const map = mapRef.current;
    const { lat, lng } = e.lngLat;
    console.log(lat, lng);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        if (getDistanceFromLatLonInM(latitude, longitude, lat, lng) > 30) {
          return;
        }

        console.log(rgb.current);
        const pt = latLonToTilePixel(lat, lng);
        await apiRequest("pixel-change", "POST", { ...pt, color: rgb.current });
        map?.removeLayer("pixels");
        map?.removeSource("pixels");
        await new Promise((resolve) => setTimeout(resolve, 10));
        map?.addLayer({
          id: "pixels",
          type: "raster",
          source: {
            type: "raster",
            tiles: [TILE_PATH],
            minzoom: 11,
            maxzoom: 11,
            tileSize: 550,
          },
          paint: {
            "raster-resampling": "nearest",
          },
        });
      },
      undefined,
      { maximumAge: 5000 },
    );
  }

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.on("click", onClick);
  }, [mapRef.current]);

  return (
    <div className="absolute top-4 right-4 z-10 rounded-md bg-white/80 p-3 shadow-md backdrop-blur-md">
      <ColourPicker setRGB={(r) => (rgb.current = r)} />
    </div>
  );
};

export default PaintControls;
