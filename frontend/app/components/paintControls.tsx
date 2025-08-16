import { API_URL, apiRequest } from "~/api";
import { useMap } from "~/context/mapContext";
import { latLonToTilePixel } from "~/utils";

const PaintControls = () => {
  const { mapRef } = useMap();

  async function paintCurrentLocation() {
    const map = mapRef.current;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const pt = latLonToTilePixel(latitude, longitude);
        await apiRequest("pixel-change", "POST", { ...pt, color: [250, 0, 0] });
        map?.removeLayer("pixels");
        map?.removeSource("pixels");
        map?.addLayer({
          id: "pixels",
          type: "raster",
          source: {
            type: "raster",
            tiles: [API_URL + "static/tiles/{x}/{y}.png"],
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
    <div className="absolute top-1/2 right-0 z-2 p-2">
      <button className="btn btn-primary" onClick={paintCurrentLocation}>
        Paint
      </button>
    </div>
  );
};
export default PaintControls;
