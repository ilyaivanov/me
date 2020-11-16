import { Store } from "redux";
import { Action, NodesContainer, RootState } from "./index";
import firebase from "firebase";
const { debounce } = require("lodash");

export default function middleware({ getState }: Store<RootState>) {
  return (next: any) => (action: Action) => {
    const itemsBefore = getState().items;
    const returnValue = next(action);
    const itemsAfter = getState().items;
    if (itemsAfter !== itemsBefore) {
      saveStateDebounced(itemsAfter);
    }
    return returnValue;
  };
}

const saveStateDebounced = debounce((items: NodesContainer) => {
  return firebase
    .firestore()
    .collection("boards")
    .doc("ilyaivanov")
    .set(items)
    .then(() => {
      console.log('state on the backend updated')
    })
    .catch((e) => {
      console.error("Error while saving board", e, items);
    });
}, 500);
