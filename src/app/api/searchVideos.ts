import { Item } from "../state";
import { findYoutubeVideos } from "./youtubeRequest";

export const searchVideos = (term: string): Promise<Item[]> => {
  return findYoutubeVideos(term).then((response) =>
    response.items.map((item: any) => ({
      id: item.id,
      itemType: item.itemType,
      image: `https://i.ytimg.com/vi/${item.itemId}/mqdefault.jpg`,
      title: item.name,
      videoId: item.itemId,
      children: []
    }))
  );
};
