import React from "react";
import { Brush, Home, Map } from "lucide-react";

const NavBar: React.FC = () => (
  <>
    <div className="dock dock-md mb-2">
      <button>
        <Brush className="size-[1.2em]" />
        <span className="dock-label">Draw</span>
      </button>

      <button className="rounded-3xl border border-orange-500 bg-zinc-700">
        <Home className="size-[1.2em]" />
        <span className="dock-label">Home</span>
      </button>

      <button>
        <Map className="size-[1.2em]" />
        <span className="dock-label">Map</span>
      </button>
    </div>
  </>
);

export default NavBar;
