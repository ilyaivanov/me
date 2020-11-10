import { createStore } from "redux";

const initialState = { isSidebarVisible: true };

const reducer = (state = initialState, action: Action) => {
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

export const toggleSidebar = () => ({ type: "TOGGLE_SIDEBAR" } as const);

export const allActions = {
  toggleSidebar,
};

export type AllActions = typeof allActions;

export type Action = ReturnType<AllActions[keyof AllActions]>;
