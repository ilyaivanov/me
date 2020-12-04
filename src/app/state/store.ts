import {
  bindActionCreators,
  compose,
  createStore,
  applyMiddleware,
  Store,
} from "redux";
import { createId } from "../utils";
import { drop, setItemOnPlaceOf } from "./dndHelpers";
import { createActionCreators, createReducer } from "./reduxInfra";
import { findParentId, getPreviewItemsForFolder } from "./selectors";
import syncingMiddleware from "./syncingMiddleware";

const initialState: MyState = {
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
  },
  dragState: {
    cardDraggedId: "",
    isDragging: false,
    cardUnderId: "",
    dragArea: undefined,
    dragAvatarType: "big",
    itemDraggedRect: undefined,
    itemOffsets: undefined,
  },
  nodeFocusedId: "HOME",
  isSidebarVisible: true,
  itemIdBeingPlayed: "",
  searchState: { stateType: "done", term: "" },
  colorScheme: "dark",
};

const actionHandlers = {
  focusNode: (nodeFocusedId: string): Partial<MyState> => ({
    nodeFocusedId,
  }),
  toggleSidebar: () => (state: MyState): Partial<MyState> => ({
    isSidebarVisible: !state.isSidebarVisible,
  }),
  setSearchState: (searchState: SearchState): Partial<MyState> => ({
    searchState,
  }),
  setColorScheme: (colorScheme: ColorScheme): Partial<MyState> => ({
    colorScheme,
  }),
  setItems: (items: NodesContainer): Partial<MyState> => ({
    items,
  }),
  replaceChildren: (parentId: string, newChildren: Item[]) => (
    state: MyState
  ): Partial<MyState> => {
    const items = {
      ...state.items,
    };
    newChildren.forEach((item) => {
      items[item.id] = item;
    });
    items[parentId] = {
      ...items[parentId],
      children: newChildren.map((i) => i.id),
    };
    return { items };
  },
  appendChildren: (parentId: string, newChildren: Item[]) => (
    state: MyState
  ): Partial<MyState> => {
    const items = {
      ...state.items,
    };
    newChildren.forEach((item) => {
      items[item.id] = item;
    });
    items[parentId] = {
      ...items[parentId],
      children: items[parentId].children.concat(newChildren.map((i) => i.id)),
    };
    return { items };
  },

  changeItem: (itemId: string, itemChange: Partial<Item>) => (
    state: MyState
  ): Partial<MyState> => {
    return {
      items: {
        ...state.items,
        [itemId]: {
          ...state.items[itemId],
          ...itemChange,
        },
      },
    };
  },

  removeItem: (itemId: string) => (state: MyState): Partial<MyState> => {
    const parent = findParentId(state.items, itemId);
    const copy = { ...state.items };
    copy[parent] = {
      ...copy[parent],
      children: copy[parent].children.filter((id) => id !== itemId),
    };

    return {
      items: copy,
    };
  },

  createNewFolder: () => (state: MyState): Partial<MyState> => {
    //TODO: think about this side effect
    const itemId = createId();
    const chil = state.items["HOME"].children.concat([itemId]);
    return {
      ...state,
      items: {
        ...state.items,
        [itemId]: {
          id: itemId,
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
  },

  //PLAYER slice (controls only itemIdBeingPlayed, but acess items)
  playItem: (itemId: string) => (state: MyState): Partial<MyState> => {
    let id;

    if (state.items[itemId].itemType === "folder") {
      const subitems = getPreviewItemsForFolder(state.items, itemId);
      if (subitems.length > 0) {
        id = subitems[0].id;
      }
    } else {
      id = itemId;
    }
    return {
      itemIdBeingPlayed: id,
    };
  },
  playNextTrack: () => (state: MyState): Partial<MyState> => {
    if (state.itemIdBeingPlayed) {
      const parent = findParentId(state.items, state.itemIdBeingPlayed);
      const context = state.items[parent];
      const nextIndex = context.children.indexOf(state.itemIdBeingPlayed) + 1;
      if (nextIndex < context.children.length)
        return {
          itemIdBeingPlayed: context.children[nextIndex],
        };
    }
    return {};
  },
  playPreviousTrack: () => (state: MyState): Partial<MyState> => {
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
    return {};
  },

  //Dnd, controls only dragState
  setCardDragAvatarType: (dragAvatarType: DragAvatarView) => (
    state: MyState
  ): Partial<MyState> => ({
    dragState: {
      ...state.dragState,
      dragAvatarType,
    },
  }),

  mouseDown: (
    itemId: string,
    downInfo: {
      elementRect: DOMRect;
      itemOffsets: { x: number; y: number };
      dragAvatarType: DragAvatarView;
    }
  ) => ({
    dragState: {
      cardDraggedId: itemId,
      itemDraggedRect: downInfo.elementRect,
      itemOffsets: downInfo.itemOffsets,
      isDragging: false,
      dragArea: undefined,
      cardUnderId: "",
      dragAvatarType: downInfo.dragAvatarType,
    },
  }),
  startDragging: () => (state: MyState) => ({
    dragState: {
      ...state.dragState,
      isDragging: true,
    },
  }),

  setCardDestination: (itemId: string, dragArea: DragArea | undefined) => (
    state: MyState
  ) => ({
    dragState: {
      ...state.dragState,
      cardUnderId: itemId,
      dragArea: dragArea,
    },
  }),
  mouseUp: () => (state: MyState) => {
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
  },

  reset: (): Partial<MyState> => ({
    ...initialState,
  }),
};
const composeEnhancers: typeof compose =
  // @ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const createMyStore = () => {
  const store = createStore(
    createReducer(initialState, actionHandlers),
    //@ts-expect-error
    composeEnhancers(applyMiddleware(syncingMiddleware))
  );
  return store;
};

export const store: Store<MyState, any> = createMyStore();

export const actions = {
  ...bindActionCreators(createActionCreators(actionHandlers), store.dispatch),
  //   loadNewQuote,
};

export function assertUnreachable(x: never): never {
  throw new Error("Didn't expect to get here for type value " + x);
}
