import firebaseApi, { UserSettings } from "../api/firebase";
import { traverseAllNodes } from "./selectors";
import { store } from "./store";

const host = document.location.hostname;
//ignore local state and backend sync during development
//helps avoid data corruption
const USE_LOCALSTORAGE = host !== "localhost";
const SAVE_ITEMS_TO_BACKEND = host !== "localhost";

export const registerSyncEvents = () => {
  if (USE_LOCALSTORAGE)
    window.addEventListener("beforeunload", () => {
      console.log("saving");
      localStorage.setItem(
        "slapstuk-state:v1",
        JSON.stringify(derivePersistedState(store.getState()))
      );
    });

  if (SAVE_ITEMS_TO_BACKEND) {
    setInterval(() => {
      const userState = store.getState().loginState;
      if (userState.state === "userLoggedIn") {
        const persistedState = derivePersistedState(store.getState());
        console.log("Saving state to the Firebase API");
        firebaseApi.saveUserSettings(
          persistedState.userSettings,
          userState.userId
        );
      }
    }, 60000);
  }
};

export const loadPersistedState = (userId: string): Promise<PersistedState> => {
  const localState = localStorage.getItem("slapstuk-state:v1");
  if (localState && USE_LOCALSTORAGE) {
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
