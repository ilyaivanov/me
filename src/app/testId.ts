export const header = {
  searchInput: "search-input",
  searchButton: "search-button",
  toggleSidebarButton: "toggle-sidebar",
};

export const gallery = {
  loadingIndicator: "loading-indicator",
  card: (itemId: string) => `card-${itemId}`,
  subtrack: (itemId: string) => `subtrack-${itemId}`,
  dragAvatar: "drag-avatar",
  cardTitle: "card-title",
  playIcon: `play-icon`,
  folderPreview: `folder-preview`,
  expandCard: "expand-card",
  subtrackText: "subtrack-label",
  cardLoadingIndicator: "card-loading-indicator",
};

export const player = {
  //used as a constant in setupTests.tsx, because jest.Mock can't reference external variables
  mockedYoutubePlayer: "mocked-youtube-player",
};

export const sidebar = {
  folderInput: (itemId: string) => `folder-input-${itemId}`,
  folderTitle: (itemId: string) => `folder-title-${itemId}`,
  row: (itemId: string) => `sidebar-row-${itemId}`,
  rowArrow: (itemId: string) => `row-arrow-${itemId}`,
  removeFolder: (itemId: string) => `folder-remove-${itemId}`,
  renameFolder: (itemId: string) => `folder-rename-${itemId}`,
  addFolder: "folder-add",
};
