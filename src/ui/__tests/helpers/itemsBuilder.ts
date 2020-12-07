const empty: NodesContainer = {
  HOME: {
    id: "HOME",
    itemType: "folder",
    title: "Home",
    children: [],
  },
  SEARCH: {
    id: "SEARCH",
    itemType: "folder",
    title: "Search",
    children: [],
  },
};

//for examples see unit tests
export const createItemsBasedOnStructure = (structure: string) => {
  const lines = structure
    .split("\n")
    .filter((line) => line.trim().length !== 0);

  return lines
    .map((line, index) => ({
      id: line.trim(),
      parentId: getParent(lines, index),
    }))
    .reduce(
      (items, { id, parentId }) => addItemTo(parentId, createItem(id), items),
      empty
    );
};

export const createEmptyItems = () => empty;

const getParent = (lines: string[], currentItemIndex: number) => {
  if (currentItemIndex === 0) return "HOME";
  const currentLevel = getLevel(lines[currentItemIndex]);
  for (let i = currentItemIndex; i--; i >= 0) {
    if (getLevel(lines[i]) < currentLevel) {
      return lines[i].trim();
    }
  }
  return "HOME";
};

const getLevel = (line: string) => {
  let spaceCount = 0;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === " ") spaceCount += 1;
    else return spaceCount;
  }
  return spaceCount;
};

const addItemTo = (parent: string, item: Item, items: NodesContainer) => ({
  ...items,
  [parent]: {
    ...items[parent],
    children: items[parent].children.concat(item.id),
  },
  [item.id]: item,
});

const createItem = (id: string): Item => {
  const isVideo = id.startsWith("video");
  return {
    id,
    itemType: isVideo ? "video" : "folder",
    image: isVideo ? id + " image" : undefined,
    videoId: isVideo ? id + " videoId" : undefined,
    title: id + " title",
    children: [],
  };
};
