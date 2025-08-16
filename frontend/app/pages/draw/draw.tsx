import MapComponent from "~/components/map";
import NavBar from "~/components/navBar";
import ColourPicker from "~/components/colourPicker";

const Draw: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col py-3">
      <NavBar />
      <div className="relative flex-1">
        <MapComponent />

        <div className="absolute top-4 right-4 z-10 rounded-md bg-white/80 p-3 shadow-md backdrop-blur-md">
          <ColourPicker />
        </div>
      </div>
    </div>
  );
};

export default Draw;
