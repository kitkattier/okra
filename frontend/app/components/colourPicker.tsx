import React, { useState, useEffect, useRef } from "react";
import FakeCircle from "./fakeCircle";

interface ColorPickerProps {
  setRGB: (rgb: [number, number, number]) => void;
}

function ColourPicker({ setRGB }: ColorPickerProps) {
  // TODO: Make initial state an input prop
  const [hex, setHex] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function convertToRGB(hex: string) {
    // convert into rgb
    const newOne = hex.split("");
    const rhex = newOne[1] + newOne[2];
    const ghex = newOne[3] + newOne[4];
    const bhex = newOne[5] + newOne[6];

    const r = parseInt(rhex, 16);
    const g = parseInt(ghex, 16);
    const b = parseInt(bhex, 16);

    setRGB([r, g, b]);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setHex(null);
        //setRGB([0, 0, 0]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef}>
      <FakeCircle
        colors={[
          "#f44336",
          "#fc9d53",
          "#faef75",
          "#6dd186",
          "#2196f3",
          "#9c27b0",
          "#f788cd",
          "#fff",
          "#000",
          // transparent?? i.e. "#ffffff0",
        ]}
        color={hex ?? ""}
        style={{
          gap: 23,
          display: "flex",
          flexDirection: "column",
        }}
        rectProps={{
          style: {
            borderRadius: 2,
            width: 18,
            height: 18,
          },
        }}
        pointProps={{
          style: {
            width: 26,
            height: 26,
            borderRadius: 5,
            borderWidth: 1,
          },
        }}
        onChange={(color) => {
          setHex(color.hex);
          convertToRGB(color.hex); // here for now but could use when u send to backend
        }}
        className="items-center"
      />
    </div>
  );
}

export default ColourPicker;
