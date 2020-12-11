import { Store } from "redux";
import firebaseApi from "../api/firebase";
import debounce from "lodash/debounce";

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
const saveStateDebounced = debounce(
  (items: NodesContainer) => firebaseApi.save(items),
  500
);