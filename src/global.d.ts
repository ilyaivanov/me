declare global {
  export interface Item {
    id: string;
    itemType: "folder" | "video" | "channel";
    title: string;
    children: string[];

    videoId?: string;
    image?: string;
    isOpenFromSidebar?: boolean;
    isOpenInGallery?: boolean;

    youtubePlaylistId?: string;
    youtubePlaylistNextPageId?: string;
    searchTerm?: string;
    isLoadingYoutubePlaylist?: boolean;

    channelTitle?: string;
    channelId?: string;

    duration?: number;
    currentTime?: number;
  }
  export type NodesContainer = {
    [key: string]: Item;
  };

  export type SearchState = { stateType: "loading" | "done"; term: string };

  export type DragArea =
    | "sidebar"
    | "gallery"
    | "breadcrump"
    | "breadcrump_section";
  export type ColorScheme = "dark" | "light";
  export type DragAvatarView = "big" | "small";

  type Loading = {
    state: "loading";
  };

  type UserInfo = {
    state: "userLoggedIn";
    userName: string | null;
    picture: string | null;
    userId: string;
    email: string;
  };

  type Anonymous = {
    state: "anonymous";
  };
  type LoginState = Anonymous | UserInfo | Loading;

  type ContextMenuState = {
    type: "shown" | "hidden";
    x: number;
    y: number;
    nodeUnderId: string;
    nodeType: 'other' | 'video'
  };

  export type MyState = {
    items: NodesContainer;
    dragState: {
      cardDraggedId: string;
      isDragging: boolean;
      cardUnderId: string;
      dragArea: DragArea | undefined;
      dragAvatarType: DragAvatarView;
      itemDraggedRect: DOMRect | undefined;
      itemOffsets: { x: number; y: number } | undefined;
    };
    contextMenuState: ContextMenuState;
    nodeFocusedId: string;
    isSidebarVisible: boolean;
    itemIdBeingPlayed: string;
    searchState: SearchState;
    colorScheme: ColorScheme;
    loginState: LoginState;
    isPlaying: boolean;
  };
}

// Adding this exports the declaration file which Typescript/CRA can now pickup:
export {};
