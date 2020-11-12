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

type SearchState = "loading" | "done";

type DragStateType = "no_drag" | "mouse_down" | "dragging";

export const initialState = {
  isSidebarVisible: true,
  nodeFocusedId: "HOME",
  itemIdBeingPlayed: undefined as string | undefined,
  searchState: "done" as SearchState,
  dragState: {
    // type: "no_drag" as DragStateType,
    // distanceTraveled: 0,
    cardDraggedId: "",
  },
  items: {
    HOME: {
      id: "HOME",
      itemType: "folder",
      title: "Home",
      children: ["playground1", "nestedRoot", "playground12"],
    },
    SEARCH: {
      id: "SEARCH",
      itemType: "folder",
      title: "Search",
      children: [],
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
    const chil = state.items["HOME"].children.concat([action.id]);
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
  if (action.type === "PLAY_ITEM") {
    return {
      ...state,
      itemIdBeingPlayed: action.itemId,
    };
  }
  if (action.type === "VIDEO_ENDED") {
    if (state.itemIdBeingPlayed) {
      const parent = findParentId(state.items, state.itemIdBeingPlayed);
      const context = state.items[parent];
      const nextIndex = context.children.indexOf(state.itemIdBeingPlayed) + 1;
      if (nextIndex < context.children.length)
        return {
          ...state,
          itemIdBeingPlayed: context.children[nextIndex],
        };
    }
  }

  if (action.type === "SET_SEARCH_STATE") {
    return {
      ...state,
      searchState: action.state,
    };
  }
  if (action.type === "ITEMS_LOADED_FROM_SEARCH") {
    const items = {
      ...state.items,
    };
    action.items.forEach((item) => {
      items[item.id] = item;
    });
    items["SEARCH"] = {
      ...items["SEARCH"],
      children: action.items.map((i) => i.id),
    };
    return {
      ...state,
      items,
    };
  }
  if (action.type === "MOUSE_DOWN") {
    return {
      ...state,
      dragState: {
        cardDraggedId: action.itemId,
      },
    };
  }
  if (action.type === "MOUSE_UP") {
    return {
      ...state,
      dragState: {
        cardDraggedId: "",
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

const playItem = (itemId: string) => ({ type: "PLAY_ITEM", itemId } as const);

const onVideoEnd = () => ({ type: "VIDEO_ENDED" } as const);

const setSearchState = (state: SearchState) =>
  ({ type: "SET_SEARCH_STATE", state } as const);

const itemsLoadedFromSearch = (items: Item[]) =>
  ({ type: "ITEMS_LOADED_FROM_SEARCH", items } as const);

const onMouseDownForCard = (itemId: string) =>
  ({ type: "MOUSE_DOWN", itemId } as const);

const onMouseUp = () => ({ type: "MOUSE_UP" } as const);

export const allActions = {
  toggleSidebar,
  focusNode,
  createNewFolder,
  removeItem,
  changeNode,
  playItem,
  onVideoEnd,
  setSearchState,
  itemsLoadedFromSearch,
  onMouseDownForCard,
  onMouseUp,
};

export type AllActions = typeof allActions;
export type RootState = typeof initialState;
export type Action = ReturnType<AllActions[keyof AllActions]>;
