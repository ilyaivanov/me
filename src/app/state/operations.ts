import { loadPlaylistVideos } from "../api/searchVideos";
import { Item } from "./store";
import { actions } from "./store";

export const onSubtracksScroll = (
  e: React.UIEvent<HTMLDivElement, UIEvent>,
  item: Item
) => {
  if (item.youtubePlaylistNextPageId && !item.isLoadingYoutubePlaylist) {
    const el = e.currentTarget;
    const LOADING_INDICATOR_HEIGHT = 100;
    if (
      el.scrollHeight - el.scrollTop - el.offsetHeight <=
      LOADING_INDICATOR_HEIGHT
    ) {
      if (item.youtubePlaylistId) {
        actions.changeItem(item.id, {
          isLoadingYoutubePlaylist: true,
        });
        loadPlaylistVideos(
          item.youtubePlaylistId,
          item.youtubePlaylistNextPageId
        ).then((response) => {
          actions.changeItem(item.id, {
            isLoadingYoutubePlaylist: false,
            youtubePlaylistNextPageId: response.nextPageToken,
          });

          actions.appendChildren(item.id, response.items);
        });
      }
    } else {
    }
  }
};
