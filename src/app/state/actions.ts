import { loadPlaylistVideos } from "../api/searchVideos";
import { AllActions, Item } from "./index";

export const onSubtracksScroll = (
  e: React.UIEvent<HTMLDivElement, UIEvent>,
  item: Item,
  actions: AllActions
) => {
  if (item.youtubePlaylistNextPageId && !item.isLoadingYoutubePlaylist) {
    const el = e.currentTarget;
    const LOADING_INDICATOR_HEIGHT = 100;
    if (
      el.scrollHeight - el.scrollTop - el.offsetHeight <=
      LOADING_INDICATOR_HEIGHT
    ) {
      if (item.youtubePlaylistId) {
        actions.changeNode(item.id, {
          isLoadingYoutubePlaylist: true,
        });
        loadPlaylistVideos(
          item.youtubePlaylistId,
          item.youtubePlaylistNextPageId
        ).then((response) => {
          actions.changeNode(item.id, {
            isLoadingYoutubePlaylist: false,
            youtubePlaylistNextPageId: response.nextPageToken,
          });

          actions.appendItemChildren(item.id, response.items);
        });
      }
    }else {

    }
  }
};