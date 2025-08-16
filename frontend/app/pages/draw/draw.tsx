import MapComponent from "~/components/map";
import NavBar from "~/components/navBar";
import PaintControls from "~/components/paintControls";
import { MapProvider } from "~/context/mapContext";

const Draw: React.FC = () => {
  return (
    <div className="min-h-screen py-3">
      <MapProvider>
        <NavBar />
        <MapComponent />
        <PaintControls />
      </MapProvider>
    </div>
  );
};

export default Draw;
