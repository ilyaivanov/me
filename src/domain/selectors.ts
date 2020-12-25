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

export const traverseAllNodes = <T>(
  items: NodesContainer,
  rootKey: string,
  mapper: (item: Item, level: number) => T
): T[] => {
  const mapItem = (key: string, level: number): any => {
    if (items[key].children.length > 0)
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

//TODO: optimization, no need to traverse ALL nodes, just find first 5
export const getPreviewItemsForFolder = (
  items: NodesContainer,
  itemId: string
): Item[] =>
  traverseAllNodes(items, itemId, (item) => item).filter(
    (item) => item.itemType === "video"
  );

export const getFirstVideoImage = (items: NodesContainer, folderId: string) => {
  const allChildVideos = traverseAllNodes(
    items,
    folderId,
    (item) => item
  ).filter((item) => item.itemType === "video");

  if (allChildVideos.length > 0) return getVideoImage(allChildVideos[0]);
  return undefined;
};

export const hasAnySubfolders = (items: NodesContainer, itemId: string) =>
  items[itemId].children
    .map((id) => items[id].itemType !== "video")
    .reduce((acc, val) => acc || val, false);

export const findParentId = (items: NodesContainer, childId: string) =>
  Object.keys(items).find(
    (parentKey) => items[parentKey].children.indexOf(childId) > -1
  ) as string;

export const getParentTitle = (
  items: NodesContainer,
  item: Item | undefined
): string => (item ? items[findParentId(items, item.id)].title : "");

export const isAChildOf = (
  items: NodesContainer,
  parentId: string,
  childId: string
) => traverseAllNodes(items, parentId, (node) => node.id).indexOf(childId) >= 0;

export const getVideoImage = (item?: Item) =>
  item &&
  (item.image ||
    (item.videoId && `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`));

export const getNodePath = (items: NodesContainer, nodeId: string): Item[] => {
  const path: Item[] = [];
  let parentId = nodeId;
  while (parentId) {
    path.push(items[parentId]);
    parentId = findParentId(items, parentId);
  }
  path.reverse();
  return path;
};

export const isOnThePlayPath = (
  items: NodesContainer,
  itemId: string | undefined
) => {
  if (!itemId) return false;
  const path = getNodePath(items, itemId);
  return path.map((i) => i.id).indexOf(itemId) >= 0;
};
