import { apiRequest, TILE_PATH } from "~/api";
import { useMap } from "~/context/mapContext";
import { latLonToTilePixel } from "~/utils";
import ColourPicker from "./colourPicker";
import { useState } from "react";

const PaintControls = () => {
  const { mapRef } = useMap();
  const [rgb, setRgb] = useState<[number, number, number]>([255, 255, 255]);

  async function paintCurrentLocation() {
    const map = mapRef.current;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const pt = latLonToTilePixel(latitude, longitude);
        await apiRequest("pixel-change", "POST", { ...pt, color: rgb });
        map?.removeLayer("pixels");
        map?.removeSource("pixels");
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

  return (
    <div className="absolute top-4 right-4 z-10 rounded-md bg-white/80 p-3 shadow-md backdrop-blur-md">
      <ColourPicker setRGB={setRgb} />
      <button className="btn btn-primary btn-square mt-5" onClick={paintCurrentLocation}>
        Paint
      </button>
    </div>
  );
};
export default PaintControls;
