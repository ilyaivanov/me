import firebaseApi, { UserSettings } from "../api/firebase";
import { traverseAllNodes } from "./selectors";
import { store } from "./store";

export const registerSyncEvents = () => {
  const host = document.location.hostname;
  //avoid syncing state during development
  if (host !== "localhost") {
    window.addEventListener("beforeunload", () => {
      console.log("saving");
      localStorage.setItem(
        "slapstuk-state:v1",
        JSON.stringify(derivePersistedState(store.getState()))
      );
    });

    setInterval(() => {
      const userState = store.getState().loginState;
      if (userState.state === "userLoggedIn") {
        const persistedState = derivePersistedState(store.getState());
        console.log("Saving state to the firebase API");
        firebaseApi.saveUserSettings(
          persistedState.userSettings,
          userState.userId
        );
        localStorage.setItem(
          "slapstuk-state:v1",
          JSON.stringify(derivePersistedState(store.getState()))
        );
      }
    }, 60000);
  }
};

export const loadPersistedState = (userId: string): Promise<PersistedState> => {
  const host = document.location.hostname;
  const localState = localStorage.getItem("slapstuk-state:v1");
  //ignore local state during development
  if (localState && host !== "localhost") {
    console.log("Loading state from local state");
    return Promise.resolve(JSON.parse(localState));
  } else
    return firebaseApi.loadUserSettings(userId).then((userSettings) => ({
      items: JSON.parse(userSettings.itemsSerialized),
      userSettings,
    }));
};

const derivePersistedState = (state: MyState): PersistedState => ({
  userSettings: {
    nodeFocused: state.nodeFocusedId,
    itemsSerialized: JSON.stringify(removeNonHomeItems(state.items)),
  },
  items: removeNonHomeItems(state.items),
});

const removeNonHomeItems = (items: NodesContainer): NodesContainer => {
  const copy: NodesContainer = {
    HOME: items.HOME,
  };
  const ids = traverseAllNodes(items, "HOME", (x) => x.id);
  ids.forEach((id) => {
    const itemCopy = {
      ...items[id],
    };
    if (!itemCopy.youtubePlaylistNextPageId)
      delete itemCopy.youtubePlaylistNextPageId;
    copy[id] = itemCopy;
  });
  return copy;
};

type PersistedState = {
  userSettings: UserSettings;
  items: NodesContainer;
};
