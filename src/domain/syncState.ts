import firebaseApi, { PersistedState } from "../api/firebase";
import { getDefaultStateForUser } from "./prefefinedSets/getDefaultState";
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
        firebaseApi.saveUserSettings(persistedState, userState.userId);
      }
    }, 60000);
  }
};

export const loadPersistedState = async (
  userId: string,
  userEmail: string
): Promise<LoadedState> => {
  const localState = localStorage.getItem("slapstuk-state:v1");
  const persistedState: PersistedState =
    localState && USE_LOCALSTORAGE
      ? JSON.parse(localState)
      : await firebaseApi.loadUserSettings(userId);

  if (persistedState) {
    const items = JSON.parse(persistedState.itemsSerialized);
    const nodeFocused = items[persistedState.nodeFocused]
      ? persistedState.nodeFocused
      : "HOME";
    return { items, nodeFocused };
  } else
    return {
      items: getDefaultStateForUser(userEmail),
      nodeFocused: "HOME",
    };
};

const derivePersistedState = (state: MyState): PersistedState => ({
  nodeFocused: state.nodeFocusedId,
  itemsSerialized: JSON.stringify(removeNonHomeItems(state.items)),
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

type LoadedState = {
  items: NodesContainer;
  nodeFocused: string;
};
