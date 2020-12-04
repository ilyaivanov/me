import { bindActionCreators, createStore, Store } from "redux";
import {
  assertUnreachable,
  ColorScheme,
  DragArea,
  DragAvatarView,
  Item,
  NodesContainer,
  SearchState,
} from ".";
import { drop, setItemOnPlaceOf } from "./dndHelpers";
import { createActionCreators, createReducer } from "./reduxInfra";
import { findParentId, getPreviewItemsForFolder } from "./selectors";

const initialState = {
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
  nodeFocusedId: "HOME",
  isSidebarVisible: true,
  itemIdBeingPlayed: "",
  searchState: { stateType: "done", term: "" } as SearchState,
  colorScheme: "dark" as ColorScheme,
};

type State = typeof initialState;

const actionHandlers = {
  focusNode: (nodeFocusedId: string): Partial<State> => ({
    nodeFocusedId,
  }),
  toggleSodebar: (isSidebarVisible: boolean): Partial<State> => ({
    isSidebarVisible,
  }),
  setSearchState: (searchState: SearchState): Partial<State> => ({
    searchState,
  }),
  setColorScheme: (colorScheme: ColorScheme): Partial<State> => ({
    colorScheme,
  }),
  setItems: (items: NodesContainer): Partial<State> => ({
    items,
  }),
  replaceChildren: (parentId: string, newChildren: Item[]) => (
    state: State
  ): Partial<State> => {
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
    state: State
  ): Partial<State> => {
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
    state: State
  ): Partial<State> => {
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

  removeItem: (itemId: string) => (state: State): Partial<State> => {
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

  createNewFolder: (itemId: string) => (state: State): Partial<State> => {
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
  playItem: (itemId: string) => (state: State): Partial<State> => {
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
  playNextTrack: () => (state: State): Partial<State> => {
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
  playPreviousTrack: () => (state: State): Partial<State> => {
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
    state: State
  ): Partial<State> => ({
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
  startDragging: () => (state: State) => ({
    dragState: {
      ...state.dragState,
      isDragging: true,
    },
  }),

  setCardDestination: (itemId: string, dragArea: DragArea | undefined) => (
    state: State
  ) => ({
    dragState: {
      ...state.dragState,
      cardUnderId: itemId,
      dragArea: dragArea,
    },
  }),
  mouseUp: () => (state: State) => {
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

  reset: (): Partial<State> => ({
    ...initialState,
  }),
};

export const createMyStore = () => {
  const store = createStore(createReducer(initialState, actionHandlers));
  return store;
};

export const store: Store<State, any> = createMyStore();

// export const loadNewQuote = () => {
//   actions.setIsLoading(true);
//   return fetch("https://uselessfacts.jsph.pl/random.json?language=en")
//     .then((response) => response.json())
//     .then((res) => {
//       actions.setQuote(res.text);
//       actions.setIsLoading(false);
//     });
// };

export const actions = {
  ...bindActionCreators(createActionCreators(actionHandlers), store.dispatch),
  //   loadNewQuote,
};
