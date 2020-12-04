import { Item } from "../state/store";
import { fetchPlaylistVideos, findYoutubeVideos } from "./youtubeRequest";

export const searchVideos = (
  term: string,
  pageToken?: string
): Promise<GetVideosResponse> => {
  return findYoutubeVideos(term, pageToken).then((response) => ({
    nextPageToken: response.nextPageToken,
    items: response.items.map((item: any) => ({
      id: item.id,
      itemType: item.itemType === "playlist" ? "folder" : item.itemType,
      image: item.image,
      title: item.name,
      videoId: item.itemId,
      youtubePlaylistId: item.itemType === "playlist" ? item.itemId : "",
      children: [],
    })),
  }));
};

export type GetVideosResponse = {
  nextPageToken?: string;
  items: Item[];
};

export const loadPlaylistVideos = (
  playlistId: string,
  pageToken?: string
): Promise<GetVideosResponse> => {
  return fetchPlaylistVideos(playlistId, pageToken).then((response) => ({
    nextPageToken: response.nextPageToken,
    items: response.items.map((item: any) => ({
      id: item.id,
      itemType: item.itemType === "playlist" ? "folder" : item.itemType,
      image: item.image,
      title: item.name,
      videoId: item.itemId,
      youtubePlaylistId: item.itemType === "playlist" ? item.itemId : "",
      children: [],
    })),
  }));
};
