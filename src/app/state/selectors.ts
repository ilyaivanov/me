import { Item, NodesContainer } from "./index";

export const traverseOpenNodes = <T>(
  items: NodesContainer,
  rootKey: string,
  mapper: (item: Item, level: number) => T
): T[] => {
  const mapItem = (key: string, level: number): any => {
    if (items[key].isOpenFromSidebar && items[key].children.length > 0)
      return [
        mapper(items[key], level),
        ...items[key].children.map((i) => mapItem(i, level + 1)),
      ];
    else return mapper(items[key], level);
  };
  if (items[rootKey])
    return items[rootKey].children
      .map((i) => mapItem(i, 0))
      .flat(Number.MAX_VALUE);
  else return [];
};

export const hasAnySubfolders = (items: NodesContainer, itemId: string) =>
  items[itemId].children
    .map((id) => items[id].itemType !== "video")
    .reduce((acc, val) => acc || val, false);
