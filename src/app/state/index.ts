import { applyMiddleware, compose, createStore } from "redux";
import { findParentId, getPreviewItemsForFolder } from "./selectors";
import { createId } from "../utils";
import { drop, setItemOnPlaceOf } from "./dndHelpers";
import syncingMiddleware from "./syncingMiddleware";

export interface Item {
  id: string;
  itemType: "folder" | "video";
  title: string;
  children: string[];

  videoId?: string;
  image?: string;
  isOpenFromSidebar?: boolean;
  isOpenInGallery?: boolean;

  youtubePlaylistId?: string;
  youtubePlaylistNextPageId?: string;
  isLoadingYoutubePlaylist?: boolean;
}
export type NodesContainer = {
  [key: string]: Item;
};

type SearchState = { stateType: "loading" | "done"; term: string };

type DragArea = "sidebar" | "gallery" | "breadcrump";
type ColorScheme = "dark" | "light";
type DragAvatarView = "big" | "small";
export const initialState = {
  isSidebarVisible: true,
  colorScheme: "dark" as ColorScheme,
  nodeFocusedId: "HOME",
  itemIdBeingPlayed: undefined as string | undefined,
  searchState: { stateType: "done", term: "" } as SearchState,
  dragState: {
    // type: "no_drag" as DragStateType,
    // distanceTraveled: 0,
    cardDraggedId: "",
    isDragging: false,
    cardUnderId: "",
    dragArea: undefined as DragArea | undefined,
    dragAvatarType: "big" as DragAvatarView,
    itemDraggedRect: undefined as DOMRect | undefined,
    itemOffsets: undefined as { x: number; y: number } | undefined,
  },
  items: {
    HOME: {
      id: "HOME",
      itemType: "folder",
      title: "Home",
      children: [],
    },
    SEARCH: {
      id: "SEARCH",
      itemType: "folder",
      title: "Search",
      children: [],
    },
  } as NodesContainer,
};
const reducer = (state = initialState, action: Action): RootState => {
  if (!state) return initialState;

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
    let id;

    if (state.items[action.itemId].itemType === "folder") {
      const subitems = getPreviewItemsForFolder(state.items, action.itemId);
      if (subitems.length > 0) {
        id = subitems[0].id;
      }
    } else {
      id = action.itemId;
    }
    return {
      ...state,
      itemIdBeingPlayed: id,
    };
  }
  if (action.type === "PLAY_NEXT_TRACK") {
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
  if (action.type === "PLAY_PREVIOUS_TRACK") {
    if (state.itemIdBeingPlayed) {
      const parent = findParentId(state.items, state.itemIdBeingPlayed);
      const context = state.items[parent];
      const nextIndex = context.children.indexOf(state.itemIdBeingPlayed) - 1;
      if (nextIndex >= 0)
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
  if (action.type === "SET_ITEM_CHILDREN") {
    const items = {
      ...state.items,
    };
    action.items.forEach((item) => {
      items[item.id] = item;
    });
    items[action.parentId] = {
      ...items[action.parentId],
      children: action.items.map((i) => i.id),
    };
    return {
      ...state,
      items,
    };
  }
  if (action.type === "APPEND_ITEM_CHILDREN") {
    const items = {
      ...state.items,
    };
    action.items.forEach((item) => {
      items[item.id] = item;
    });
    items[action.parentId] = {
      ...items[action.parentId],
      children: items[action.parentId].children.concat(action.items.map((i) => i.id)),
    };
    return {
      ...state,
      items,
    };
  }
  if (action.type === "SET_CARD_DRAG_AVATAR") {
    return {
      ...state,
      dragState: {
        ...state.dragState,
        dragAvatarType: action.avatarType,
      },
    };
  }
  if (action.type === "MOUSE_DOWN") {
    return {
      ...state,
      dragState: {
        cardDraggedId: action.itemId,
        itemDraggedRect: action.elementRect,
        itemOffsets: action.itemOffsets,
        isDragging: false,
        dragArea: undefined,
        cardUnderId: "",
        dragAvatarType: action.dragAvatarType,
      },
    };
  }
  if (action.type === "START_DRAGGING") {
    return {
      ...state,
      dragState: {
        ...state.dragState,
        isDragging: true,
      },
    };
  }
  if (action.type === "MOUSE_UP") {
    const dragState = state.dragState;
    let items;
    const dragArea = dragState.dragArea;
    if (dragState.cardUnderId && dragState.cardDraggedId && dragArea) {
      if (dragArea === "sidebar" || dragArea === "breadcrump") {
        items = drop(
          state.items,
          dragState.cardDraggedId,
          dragState.cardUnderId,
          "inside"
        );
      } else if (dragArea === "gallery") {
        items = setItemOnPlaceOf(
          state.items,
          dragState.cardDraggedId,
          dragState.cardUnderId
        );
      } else {
        assertUnreachable(dragArea);
      }
    } else {
      items = state.items;
    }
    return {
      ...state,
      items,
      dragState: {
        cardDraggedId: "",
        cardUnderId: "",
        dragArea: undefined,
        itemDraggedRect: undefined,
        itemOffsets: undefined,
        isDragging: false,
        dragAvatarType: "big",
      },
    };
  }
  if (action.type === "SET_CARD_DESTINATION") {
    return {
      ...state,
      dragState: {
        ...state.dragState,
        cardUnderId: action.itemId,
        dragArea: action.dragArea,
      },
    };
  }
  if (action.type === "SET_ITEMS") {
    return {
      ...state,
      items: action.items,
    };
  }
  if (action.type === "SET_COLOR_SCHEME") {
    return {
      ...state,
      colorScheme: action.scheme,
    };
  }
  return state;
};

const composeEnhancers: typeof compose =
  // @ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const createMediaExplorerStore = () => {
  return createStore(
    reducer,
    //@ts-expect-error
    composeEnhancers(applyMiddleware(syncingMiddleware))
  );
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

const playNextTrack = () => ({ type: "PLAY_NEXT_TRACK" } as const);

const playPreviousTrack = () => ({ type: "PLAY_PREVIOUS_TRACK" } as const);

const setSearchState = (state: SearchState) =>
  ({ type: "SET_SEARCH_STATE", state } as const);

const setItemChildren = (parentId: string, items: Item[]) =>
  ({ type: "SET_ITEM_CHILDREN", parentId, items } as const);

const appendItemChildren = (parentId: string, items: Item[]) =>
  ({ type: "APPEND_ITEM_CHILDREN", parentId, items } as const);

const onMouseDownForCard = (
  itemId: string,
  elementRect: DOMRect,
  itemOffsets: { x: number; y: number },
  dragAvatarType: DragAvatarView
) =>
  ({
    type: "MOUSE_DOWN",
    itemId,
    elementRect,
    itemOffsets,
    dragAvatarType,
  } as const);

const onMouseUp = () => ({ type: "MOUSE_UP" } as const);

const setCardDestination = (itemId: string, dragArea: DragArea | undefined) =>
  ({ type: "SET_CARD_DESTINATION", itemId, dragArea } as const);

const setItems = (items: NodesContainer) =>
  ({ type: "SET_ITEMS", items } as const);

const startDragging = () => ({ type: "START_DRAGGING" } as const);

const setColorScheme = (scheme: ColorScheme) =>
  ({ type: "SET_COLOR_SCHEME", scheme } as const);

const setCardDragAvatar = (avatarType: DragAvatarView) =>
  ({ type: "SET_CARD_DRAG_AVATAR", avatarType } as const);

export const allActions = {
  toggleSidebar,
  focusNode,
  createNewFolder,
  removeItem,
  changeNode,
  playItem,
  playNextTrack,
  playPreviousTrack,
  setSearchState,
  onMouseDownForCard,
  onMouseUp,
  setCardDestination,
  setItems,
  setItemChildren,
  appendItemChildren,
  startDragging,
  setColorScheme,
  setCardDragAvatar,
};

export type AllActions = typeof allActions;
export type RootState = typeof initialState;
export type Action = ReturnType<AllActions[keyof AllActions]>;

function assertUnreachable(x: never): never {
  throw new Error("Didn't expect to get here for type value " + x);
}
