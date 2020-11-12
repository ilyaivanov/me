import { Item } from "../state";

export const searchVideos = (term: string): Promise<Item[]> => {
  console.log("Searching for the " + term);
  return new Promise<Item[]>((resolve) => {
    setTimeout(resolve, 2000);
  });
};
