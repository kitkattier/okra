import MapComponent from "~/components/map";
import NavBar from "~/components/navBar";
import PaintControls from "~/components/paintControls";
import { MapProvider } from "~/context/mapContext";

const Draw: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col py-3">
      <NavBar />
      <MapProvider>
        <div className="relative flex-1">
          <MapComponent />
          <PaintControls />
        </div>
      </MapProvider>
    </div>
  );
};

export default Draw;
