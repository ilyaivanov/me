declare global {
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
    searchTerm?: string;
    isLoadingYoutubePlaylist?: boolean;
  }
  export type NodesContainer = {
    [key: string]: Item;
  };

  export type SearchState = { stateType: "loading" | "done"; term: string };

  export type DragArea = "sidebar" | "gallery" | "breadcrump";
  export type ColorScheme = "dark" | "light";
  export type DragAvatarView = "big" | "small";

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
    nodeFocusedId: string;
    isSidebarVisible: boolean;
    itemIdBeingPlayed: string;
    searchState: SearchState;
    colorScheme: ColorScheme;
  };
}

// Adding this exports the declaration file which Typescript/CRA can now pickup:
export {};
