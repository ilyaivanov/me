import { Item, NodesContainer } from "./index";
import { findParentId } from "./selectors";

  export const drop = (
  items: NodesContainer,
  itemBeingDragged: string,
  itemToDropAround: string,
  howToDrop: "before" | "after" | "inside" | "instead"
): NodesContainer => {
  const parentId = findParentId(items, itemBeingDragged || "");
  const copyItems = assignItem(items, parentId, (i) => ({
    children: i.children.filter((child) => child !== itemBeingDragged),
  }));
  if (howToDrop === "inside") {
    let targetIndex = 0;

    const newChildren = [...copyItems[itemToDropAround].children];
    newChildren.splice(targetIndex, 0, itemBeingDragged);
    copyItems[itemToDropAround] = {
      ...copyItems[itemToDropAround],
      children: newChildren,
    };
  } else {
    const nodeUnderParentId = findParentId(copyItems, itemToDropAround);
    const parentItem = copyItems[nodeUnderParentId];

    let targetIndex = parentItem.children.indexOf(itemToDropAround);

    if (howToDrop === "after") {
      targetIndex += 1;
    }

    const newChildren = [...copyItems[nodeUnderParentId].children];
    newChildren.splice(targetIndex, 0, itemBeingDragged);
    copyItems[nodeUnderParentId] = {
      ...copyItems[nodeUnderParentId],
      children: newChildren,
    };
  }

  return copyItems;
};

export const setItemOnPlaceOf = (
  items: NodesContainer,
  itemBeingDragged: string,
  itemToReplace: string
): NodesContainer => {
  const parentOfItemBeingDragged = findParentId(items, itemBeingDragged || "");
  const parentTargetItemId = findParentId(items, itemToReplace || "");

  if (parentOfItemBeingDragged === parentTargetItemId) {
    const parentChildren = items[parentOfItemBeingDragged].children;
    const targetIndex = parentChildren.indexOf(itemToReplace);
    const currentIndex = parentChildren.indexOf(itemBeingDragged);
    const dropDestination = targetIndex < currentIndex ? "before" : "after";
    return drop(items, itemBeingDragged, itemToReplace, dropDestination);
  } else {
    return drop(items, itemBeingDragged, itemToReplace, "before");
  }
};

const assignItem = (
  items: NodesContainer,
  itemId: string,
  mapper: (item: Item) => Partial<Item>
) => ({
  ...items,
  [itemId]: {
    ...items[itemId],
    ...mapper(items[itemId]),
  },
});
