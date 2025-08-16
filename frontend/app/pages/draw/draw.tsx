import MapComponent from "~/components/map";
import NavBar from "~/components/navBar";

const Draw: React.FC = () => {
  return (
    <div className="min-h-screen py-3">
      <NavBar />
      <MapComponent />
    </div>
  );
};

export default Draw;
