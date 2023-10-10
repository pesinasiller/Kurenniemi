import {
  ref,
  onChildChanged,
  onChildAdded,
  onChildRemoved,
} from "firebase/database";
import firebaseDatabase from "./firebaseConnection";

const initListeners = (
  connectionKey,
  setUsersList,
  kurenniemi,
) => {
  const db = firebaseDatabase;

  onChildAdded(ref(db, "users/"), (data) => {
    const isMyself = data.key === connectionKey;
    const synthData = data.val();
    const notUpdatedLately = Date.now() - synthData.lastUpdate > 1800000;
    if (!synthData.username || notUpdatedLately || isMyself) {
      return;
    }

    kurenniemi.addUser(synthData);

    setUsersList((usersList) => [...usersList, { ...synthData }]);
  });

  onChildRemoved(ref(db, "users/"), (data) => {
    const synthData = data.val();

    kurenniemi.removeUser(synthData.connectionKey);

    setUsersList((usersList) =>
      usersList.filter(
        ({ connectionKey }) => connectionKey !== synthData.connectionKey,
      ),
    );
  });

  onChildChanged(ref(db, "users/"), (data) => {
    const isMyself = data.key === connectionKey;
    const synthData = data.val();

    if (isMyself) {
      return;
    }

    kurenniemi.updateUserFrequency(
      synthData.connectionKey,
      synthData.frequency,
    );

    kurenniemi.updateUserModulation(
      synthData.connectionKey,
      synthData.modulation,
    );

    setUsersList((usersList) => {
      const listWithoutCurrent = usersList.filter(
        ({ connectionKey }) => connectionKey !== synthData.connectionKey,
      );
      return [...listWithoutCurrent, { ...synthData }];
    });
  });
};

export default initListeners;
