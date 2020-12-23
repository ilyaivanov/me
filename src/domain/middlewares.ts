import { Store } from "redux";
import firebaseApi from "../api/firebase";
import debounce from "lodash/debounce";
import { traverseAllNodes } from "./selectors";

export function firebaseSyncMiddleware({ getState }: Store<MyState>) {
  return (next: any) => (action: any) => {
    const itemsBefore = getState().items;
    const returnValue = next(action);
    const itemsAfter = getState().items;
    const userState = getState().loginState;
    if (itemsAfter !== itemsBefore && userState.state === "userLoggedIn") {
      const host = document.location.hostname;
      //avoid syncing state during development
      if (host !== "localhost")
        saveStateDebounced(itemsAfter, userState.userId);
    }
    return returnValue;
  };
}
const saveStateDebounced = debounce((items: NodesContainer, userId: string) => {
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
  console.log(`Saving ${ids.length} of items`);
  firebaseApi.save(copy, userId);
}, 2000);
