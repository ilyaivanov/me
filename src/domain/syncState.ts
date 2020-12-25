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
        firebaseApi.save(persistedState.items, userState.userId);
        firebaseApi.saveUserSettings(
          persistedState.userSettings,
          userState.userId
        );
        localStorage.setItem(
          "slapstuk-state:v1",
          JSON.stringify(derivePersistedState(store.getState()))
        );
      }
    }, 10000);
  }
};

export const loadPersistedState = (userId: string): Promise<PersistedState> => {
  const localState = localStorage.getItem("slapstuk-state:v1");
  if (localState) {
    console.log("Loading state from local state");
    return Promise.resolve(JSON.parse(localState));
  } else
    return Promise.all([
      firebaseApi.load(userId),
      firebaseApi.loadUserSettings(userId),
    ]).then(([items, userSettings]) => ({
      items: logItems(items),
      userSettings,
    }));
};

const logItems = (items: NodesContainer): NodesContainer => {
  console.log(`Got items ${Object.keys(items).length}`);
  return items;
};

const derivePersistedState = (state: MyState): PersistedState => ({
  userSettings: {
    nodeFocused: state.nodeFocusedId,
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
