import React from "react";
import { Brush, Home, Map } from "lucide-react";
import { Link, useLocation } from "react-router";

const NavBar: React.FC = () => {
  const currentStyle = "rounded-3xl border border-orange-500 bg-zinc-700";
  const path = useLocation().pathname;
  return (
    <>
      <div className="dock dock-lg pb-2">
        <Link to="/draw" className={path === "/draw" ? currentStyle : ""}>
          <Brush className="size-[1.2em]" />
          <span className="dock-label">Draw</span>
        </Link>

        <Link to="/" className={path === "/" ? currentStyle : ""}>
          <Home className="size-[1.2em]" />
          <span className="dock-label">Home</span>
        </Link>

        <Link to="/map" className={path === "/map" ? currentStyle : ""}>
          <Map className="size-[1.2em]" />
          <span className="dock-label">Map</span>
        </Link>
      </div>
    </>
  );
};

export default NavBar;
