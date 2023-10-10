import React, { useEffect, useState } from "react";
import Synth from "./Synth";
import MySynth from "./MySynth";
import initListeners from "./multiplayer/initListeners";
import initUser from "./multiplayer/initUser";
import connectToDatabase from "./connectToDatabase";
import Kurenniemi from "./Kurenniemi";

const WAContext = window.AudioContext || window.webkitAudioContext;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [username, setUserName] = useState("");
  const [connectionKey, setConnectionKey] = useState("");
  const [mySynth, setMySynth] = useState();
  const [usersList, setUsersList] = useState([]);
  const [kurenniemi, setKurenniemi] = useState();

  useEffect(() => {
    connectToDatabase(setIsLoading, setConnectionKey);
    setKurenniemi(new Kurenniemi());
  }, [setConnectionKey]);

  const start = () => {
    const audioContext = new WAContext();
    audioContext.resume();
    setIsPlaying(true);
    initUser(audioContext, username, connectionKey, setMySynth, kurenniemi);
    initListeners(connectionKey, setUsersList, kurenniemi);
  };

  const synthComponents = usersList.map((synthData) => (
    <Synth
      key={synthData.connectionKey}
      synthData={synthData}
    />
  ));

  return (
    <div className="App">
      {isLoading && <h1>loading</h1>}

      {!isLoading && isPlaying && mySynth && (
        <MySynth synthData={mySynth.synthData} kurenniemi={kurenniemi} />
      )}
      {!isLoading && isPlaying && synthComponents}
      {!isLoading && !isPlaying && (
        <>
          <input
            value={username}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            pattern="[a-zA-Z0-9]+"
            type="text"
            placeholder="write your name"
          />
          <button disabled={username.length < 3} onClick={start}>
            join
          </button>
        </>
      )}
    </div>
  );
}

export default App;
