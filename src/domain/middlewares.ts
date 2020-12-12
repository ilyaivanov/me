import { Store } from "redux";
import firebaseApi from "../api/firebase";
import debounce from "lodash/debounce";
import { traverseAllNodes } from "./selectors";

export function firebaseSyncMiddleware({ getState }: Store<MyState>) {
  return (next: any) => (action: any) => {
    const itemsBefore = getState().items;
    const returnValue = next(action);
    const itemsAfter = getState().items;
    if (itemsAfter !== itemsBefore) {
      const host = document.location.hostname;
      //avoid syncing state during development
      if (host !== "localhost") saveStateDebounced(itemsAfter);
    }
    return returnValue;
  };
}
const saveStateDebounced = debounce((items: NodesContainer) => {
  const copy: NodesContainer = {
    HOME: items.HOME,
  };
  const ids = traverseAllNodes(items, "HOME", (x) => x.id);
  ids.forEach((id) => {
    copy[id] = items[id];
  });
  console.log(`Saving ${ids.length} of items`);
  firebaseApi.save(copy);
}, 500);
