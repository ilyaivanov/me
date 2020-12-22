import {
  fetchPlaylistVideos,
  findYoutubeVideos,
  findSimilarYoutubeVideos,
  getChannelPlaylists,
  getChannelUploadsPlaylistId,
} from "../api/youtubeRequest";
import { createId } from "./createId";
import { actions, store } from "./store";

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
      } else if (
        item.itemType === "channel" &&
        item.videoId &&
        item.youtubePlaylistNextPageId
      ) {
        actions.changeItem(item.id, {
          isLoadingYoutubePlaylist: true,
        });
        findChannelPlaylists(item.videoId, item.youtubePlaylistNextPageId).then(
          (response) => {
            actions.changeItem(item.id, {
              isLoadingYoutubePlaylist: false,
              youtubePlaylistNextPageId: response.nextPageToken,
            });
            actions.appendChildren(item.id, response.items);
          }
        );
      } else if (item.videoId) {
        actions.changeItem(item.id, {
          isLoadingYoutubePlaylist: true,
        });
        findSimilar(item.videoId, item.youtubePlaylistNextPageId).then(
          (response) => {
            actions.changeItem(item.id, {
              isLoadingYoutubePlaylist: false,
              youtubePlaylistNextPageId: response.nextPageToken,
            });
            actions.appendChildren(item.id, response.items);
          }
        );
      } else if (item.searchTerm) {
        actions.changeItem(item.id, {
          isLoadingYoutubePlaylist: true,
        });
        searchVideos(item.searchTerm, item.youtubePlaylistNextPageId).then(
          (response) => {
            actions.changeItem(item.id, {
              isLoadingYoutubePlaylist: false,
              youtubePlaylistNextPageId: response.nextPageToken,
            });
            actions.appendChildren(item.id, response.items);
          }
        );
      }
    }
  }
};

export const searchForItems = (term: string) => {
  actions.setSearchState({
    stateType: "loading",
    term: `Searching for '${term}'...`,
  });
  actions.focusNode("SEARCH");
  searchVideos(term).then((response) => {
    actions.setSearchState({
      stateType: "done",
      term: ``,
    });
    actions.replaceChildren("SEARCH", response.items);
    actions.changeItem("SEARCH", {
      youtubePlaylistNextPageId: response.nextPageToken,
      searchTerm: term,
    });
  });
};

export const findSimilarVideos = (itemId: string) => {
  const item = store.getState().items[itemId];
  actions.setSearchState({
    stateType: "loading",
    term: `Searching similar to '${item.title}'...`,
  });
  actions.focusNode("SEARCH_SIMILAR");
  if (item.videoId) {
    findSimilar(item.videoId).then((response) => {
      actions.setSearchState({
        stateType: "done",
        term: "",
      });
      actions.replaceChildren("SEARCH_SIMILAR", response.items);
      actions.changeItem("SEARCH_SIMILAR", {
        youtubePlaylistNextPageId: response.nextPageToken,
        videoId: item.videoId,
      });
    });
  }
};

export const loadYoutubePlaylist = (item: Item) => {
  if (
    item.itemType === "channel" &&
    !item.isLoadingYoutubePlaylist &&
    item.children.length === 0
  ) {
    actions.changeItem(item.id, {
      isLoadingYoutubePlaylist: true,
    });
    Promise.all([
      findChannelPlaylists(item.videoId as string),
      getChannelUploadsPlaylistId(item.videoId as string),
    ]).then(([response, allUploadsPlaylistId]) => {
      actions.changeItem(item.id, {
        isLoadingYoutubePlaylist: false,
        youtubePlaylistNextPageId: response.nextPageToken,
      });
      const uploadsPlaylist: Item = {
        id: createId(),
        title: item.title + " - All",
        children: [],
        youtubePlaylistId: allUploadsPlaylistId,
        videoId: allUploadsPlaylistId,
        image: item.image,
        itemType: "folder",
      };
      console.log(uploadsPlaylist);
      const allPlaylits = [uploadsPlaylist].concat(response.items);
      actions.replaceChildren(item.id, allPlaylits);
    });
  } else if (
    item.youtubePlaylistId &&
    !item.isLoadingYoutubePlaylist &&
    item.children.length === 0
  ) {
    actions.changeItem(item.id, {
      isLoadingYoutubePlaylist: true,
    });

    loadPlaylistVideos(item.youtubePlaylistId).then((response) => {
      actions.changeItem(item.id, {
        isLoadingYoutubePlaylist: false,
        youtubePlaylistNextPageId: response.nextPageToken,
      });

      actions.replaceChildren(item.id, response.items);
    });
  }
};

type GetVideosResponse = {
  nextPageToken?: string;
  items: Item[];
};

const loadPlaylistVideos = (
  playlistId: string,
  pageToken?: string
): Promise<GetVideosResponse> => {
  return fetchPlaylistVideos(playlistId, pageToken).then((response) => ({
    nextPageToken: response.nextPageToken,
    items: response.items.map(mapItem),
  }));
};

const searchVideos = (
  term: string,
  pageToken?: string
): Promise<GetVideosResponse> => {
  return findYoutubeVideos(term, pageToken).then((response) => ({
    nextPageToken: response.nextPageToken,
    items: response.items.map(mapItem),
  }));
};

const findSimilar = (
  videoId: string,
  pageToken?: string
): Promise<GetVideosResponse> => {
  return findSimilarYoutubeVideos(videoId, pageToken).then((response) => ({
    nextPageToken: response.nextPageToken,
    items: response.items.map(mapItem),
  }));
};

const findChannelPlaylists = (
  channelId: string,
  pageToken?: string
): Promise<GetVideosResponse> => {
  return getChannelPlaylists(channelId, pageToken).then((response) => ({
    nextPageToken: response.nextPageToken,
    items: response.items.map(mapItem),
  }));
};

const mapItem = (item: any): Item => {
  let resItem = {
    id: item.id,
    itemType: item.itemType === "playlist" ? "folder" : item.itemType,
    title: item.name,
    videoId: item.itemId,
    channelId: item.channelId,
    channelTitle: item.channelTitle,
    youtubePlaylistId: item.itemType === "playlist" ? item.itemId : "",
    children: [],
  };
  //skip images for videos, to save space on Firebase
  if (item.itemType !== "video")
    // @ts-expect-error
    resItem.image = item.image;
  return resItem;
};
