import React, { useEffect, useState } from "react";
import { throttle, debounce } from "lodash";
import { ref, update } from "firebase/database";
import firebaseDatabase from "./multiplayer/firebaseConnection";
import "./Synth.css";

function MySynth({ synthData, kurenniemi }) {
  const [frequency, setFrequency] = useState(synthData.frequency);
  const [modulation, setModulation] = useState(synthData.modulation);

  const freq = `${100 / frequency}s`;
  kurenniemi.updateMyFrequency(frequency);
  kurenniemi.updateMyModulation(modulation);

  useEffect(() => {
    update(ref(firebaseDatabase, `/users/${synthData.connectionKey}`), {
      ...synthData,
      frequency,
      modulation,
    });
  }, [frequency, modulation, synthData.connectionKey]);

  const updateDatabase = () => {
    update(
      ref(firebaseDatabase, `/users/${synthData.connectionKey}`),
      (data) => {
        return {
          frequency,
          modulation,
        };
      },
    );
  };
  // const onChangeFrequency = useCallback(debounce((value) => updateDatabase(value), 100), []);

  return (
    <div
      className="synth"
      style={{
        /* backgroundColor: `rgba(${frequency},128,128)`,*/ animationDuration:
          freq,
        padding: "50px",
      }}
    >
      frequency
      <input
        type="range"
        min="-1"
        max={500}
        step="1"
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        // onMouseDown={(e) => onChangeFrequency(e.target.value)}
      />
      <br />
      modulation
      <input
        type="range"
        min="2"
        max={3000}
        step="1"
        value={modulation}
        onChange={(e) => setModulation(e.target.value)}
      />
    </div>
  );
}

export default MySynth;
