import React from "react";
import { map } from "./utils";
import "./Synth.css";

function MySynth({ synthData }) {
  const { frequency, modulation } = synthData;

  const freq = `${100 / frequency}s`;

  return (
    <div
      className="synth"
      style={{
        /* backgroundColor: `rgba(${frequency},128,128)`,*/ animationDuration:
          freq,
        height: "50px",
        padding: "50px",
        opacity: map(modulation, 2, 3000, 0, 1),
      }}
    >
      {synthData.username}
    </div>
  );
}

export default MySynth;
