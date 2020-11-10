import { createStore } from "redux";

const initialState = { isSidebarVisible: true };

const reducer = (state = initialState, action: any) => {
  if (action.type == "TOGGLE_SIDEBAR") {
    return {
      ...state,
      isSidebarVisible: !state.isSidebarVisible,
    };
  }
  return state;
};

export const createMediaExplorerStore = () => {
  const store = createStore(reducer);
  return store;
};

export const toggleSidebar = () => ({ type: "TOGGLE_SIDEBAR" });
