import React, { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import maplibregl from "maplibre-gl";
import { API_URL } from "~/api";

interface MapContextType {
  mapRef: React.RefObject<maplibregl.Map | null>;
  mapContainer: React.RefObject<HTMLDivElement | null>;
}
const MapContext = createContext<MapContextType>(null!);

interface MapProviderProps {
  children: ReactNode;
}

export const MapProvider: React.FC<MapProviderProps> = ({ children }) => {
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map>(null);

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [153.013435, -27.497446],
      zoom: 10,
    });
    mapRef.current = map;

    map.on("style.load", () => {
      map.addLayer({
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
    });
    const geolocate = new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
    });
    map.addControl(geolocate, "top-left");

    map.on("load", () => {
      geolocate.trigger();
    });
    return () => {
      map.remove();
    };
  }, [mapContainer]);

  return <MapContext.Provider value={{ mapRef, mapContainer }}>{children}</MapContext.Provider>;
};

export const useMap = () => useContext(MapContext);
