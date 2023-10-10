import { ref, set } from "firebase/database";
import firebaseDatabase from "./firebaseConnection";

const initUser = (
  audioContext,
  username,
  connectionKey,
  setMySynth,
  kurenniemi,
) => {
  const synthData = {
    connectionKey,
    username,
    timestamp: Date.now(),
    frequency: 220,
    modulation: 1000,
  };

  const db = firebaseDatabase;

  set(ref(db, `users/${connectionKey}`), synthData).then(
    (success) => {
      kurenniemi.setMyNodes(audioContext, synthData);
      setMySynth({ synthData });
    },
    (error) => {
      console.log("error", error);
    },
  );
};

export default initUser;
