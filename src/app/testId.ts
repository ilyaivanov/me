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
