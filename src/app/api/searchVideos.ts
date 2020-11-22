import { Item } from "../state";
import { fetchPlaylistVideos, findYoutubeVideos } from "./youtubeRequest";

export const searchVideos = (term: string): Promise<Item[]> => {
  return findYoutubeVideos(term).then((response) =>
    response.items.map((item: any) => ({
      id: item.id,
      itemType: item.itemType === "playlist" ? "folder" : item.itemType,
      image: item.image,
      title: item.name,
      videoId: item.itemId,
      youtubePlaylistId: item.itemType === "playlist" ? item.itemId : undefined,
      children: [],
    }))
  );
};


export const loadPlaylistVideos = (playlistId: string) : Promise<Item[]> => {
  return fetchPlaylistVideos(playlistId).then((response) =>
    response.items.map((item: any) => ({
      id: item.id,
      itemType: item.itemType === "playlist" ? "folder" : item.itemType,
      image: item.image,
      title: item.name,
      videoId: item.itemId,
      youtubePlaylistId: item.itemType === "playlist" ? item.itemId : undefined,
      children: [],
    }))
  );
}
