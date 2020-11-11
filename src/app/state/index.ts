import { createStore } from "redux";

export interface Item {
  id: string;
  itemType: "folder" | "video";
  title: string;
  children: string[];

  videoId?: string;
  image?: string;
  isOpenFromSidebar?: boolean;
}
export type NodesContainer = {
  [key: string]: Item;
};

const initialState = {
  isSidebarVisible: true,
  items: {
    HOME: {
      id: "HOME",
      itemType: "folder",
      title: "Home",
      children: ["playground1"],
    },
    playground1: {
      id: "playground1",
      itemType: "folder",
      title: "Playground",
      children: ["playground11", "playground12"],
    },
    playground11: {
      id: "playground11",
      itemType: "video",
      title: "Sync24 - DOT",
      image: "https://i.ytimg.com/vi/vQFDW0_GB8Q/mqdefault.jpg",
      videoId: "vQFDW0_GB8Q",
      children: [],
    },
    playground12: {
      id: "playground12",
      itemType: "video",
      title: "Something Something",
      image: "https://i.ytimg.com/vi/_WGJ83wSibc/mqdefault.jpg",
      videoId: "_WGJ83wSibc",
      children: [],
    },
  } as NodesContainer,
};
const reducer = (state = initialState, action: Action) => {
  if (action.type === "TOGGLE_SIDEBAR") {
    return {
      ...state,
      isSidebarVisible: !state.isSidebarVisible,
    };
  }
  return state;
};

export const createMediaExplorerStore = () => {
  return createStore(reducer);
};

export const toggleSidebar = () => ({ type: "TOGGLE_SIDEBAR" } as const);

export const allActions = {
  toggleSidebar,
};

export type AllActions = typeof allActions;
export type RootState = typeof initialState;
export type Action = ReturnType<AllActions[keyof AllActions]>;
