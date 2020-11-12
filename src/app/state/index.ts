import { createStore } from "redux";
import { findParentId } from "./selectors";
import { createId } from "../utils";

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

export const initialState = {
  isSidebarVisible: true,
  nodeFocusedId: "HOME",
  items: {
    HOME: {
      id: "HOME",
      itemType: "folder",
      title: "Home",
      children: ["playground1", "nestedRoot", "playground12"],
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
    nestedRoot: {
      id: "nestedRoot",
      itemType: "folder",
      title: "Nested Root",
      children: ["nested1", "nested2", "nested3"],
    },
    nested1: {
      id: "nested1",
      itemType: "folder",
      title: "Nested 1",
      children: ["nested1Video"],
    },
    nested2: {
      id: "nested2",
      itemType: "folder",
      title: "Nested 2",
      children: ["nested2Video"],
    },
    nested3: {
      id: "nested3",
      itemType: "folder",
      title: "Nested 3",
      children: ["nested3Video"],
    },
    nested1Video: {
      id: "nested1Video",
      itemType: "video",
      title: "Something Something",
      image: "https://i.ytimg.com/vi/_WGJ83wSibc/mqdefault.jpg",
      videoId: "_WGJ83wSibc",
      children: [],
    },
    nested2Video: {
      id: "nested2Video",
      itemType: "video",
      title: "Something Something",
      image: "https://i.ytimg.com/vi/_WGJ83wSibc/mqdefault.jpg",
      videoId: "_WGJ83wSibc",
      children: [],
    },
    nested3Video: {
      id: "nested3Video",
      itemType: "video",
      title: "Joe Rogan Experience #1562 - Dave Smith",
      image: "https://i.ytimg.com/vi/5PrLGhJnO7I/mqdefault.jpg",
      videoId: "5PrLGhJnO7I",
      children: [],
    },
  } as NodesContainer,
};
const reducer = (state = initialState, action: Action): RootState => {
  if (action.type === "TOGGLE_SIDEBAR") {
    return {
      ...state,
      isSidebarVisible: !state.isSidebarVisible,
    };
  }
  if (action.type === "FOCUS_NODE") {
    return {
      ...state,
      nodeFocusedId: action.itemId,
    };
  }
  if (action.type === "CHANGE_NODE") {
    return {
      ...state,
      items: {
        ...state.items,
        [action.itemId]: {
          ...state.items[action.itemId],
          ...action.item,
        },
      },
    };
  }
  if (action.type === "REMOVE_ITEM") {
    const parent = findParentId(state.items, action.itemId);
    const copy = { ...state.items };
    copy[parent] = {
      ...copy[parent],
      children: copy[parent].children.filter((id) => id !== action.itemId),
    };
    return {
      ...state,
      items: copy,
    };
  }
  if (action.type === "CREATE_NEW_FOLDER") {
    const chil = state.items["HOME"].children.concat([action.id]); //?
    return {
      ...state,
      items: {
        ...state.items,
        [action.id]: {
          id: action.id,
          itemType: "folder",
          title: "New Folder",
          children: [],
        },
        HOME: {
          ...state.items["HOME"],
          children: chil,
        },
      },
    };
  }
  return state;
};

export const createMediaExplorerStore = () => {
  return createStore(reducer);
};

const toggleSidebar = () => ({ type: "TOGGLE_SIDEBAR" } as const);
const createNewFolder = () =>
  ({ type: "CREATE_NEW_FOLDER", id: createId() } as const);
const focusNode = (itemId: string) => ({ type: "FOCUS_NODE", itemId } as const);
const changeNode = (itemId: string, item: Partial<Item>) =>
  ({ type: "CHANGE_NODE", itemId, item } as const);

const removeItem = (itemId: string) =>
  ({ type: "REMOVE_ITEM", itemId } as const);

export const allActions = {
  toggleSidebar,
  focusNode,
  createNewFolder,
  removeItem,
  changeNode,
};

export type AllActions = typeof allActions;
export type RootState = typeof initialState;
export type Action = ReturnType<AllActions[keyof AllActions]>;
