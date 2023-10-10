import {
  ref,
  set,
  onDisconnect,
  onValue,
  push,
} from "firebase/database";

import firebaseDatabase from "./multiplayer/firebaseConnection";

const connectToDatabase = (setIsLoading, setConnectionKey) => {
  const db = firebaseDatabase;
  const myConnectionsRef = ref(db, "users/");
  const connectedRef = ref(db, ".info/connected");

  onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
      const connection = push(myConnectionsRef);
      // When I disconnect, remove this device
      onDisconnect(connection).remove();

      // Add this device to my connections list
      // this value could contain info about the device or a timestamp too
      set(connection, {});
      setIsLoading(false);
      setConnectionKey(connection.key);
    }
  });
};

export default connectToDatabase;
