import { Store } from "redux";
import { Action, NodesContainer, RootState } from "./index";
import firebaseApi from "../api/firebase";
import debounce from "lodash/debounce";

export default function middleware({ getState }: Store<RootState>) {
  return (next: any) => (action: Action) => {
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
