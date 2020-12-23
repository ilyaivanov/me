import { items, original } from "./vadym";

fit("sample", () => {
  let items: NodesContainer = {};
  original.map((board) => {
    items[board.id] = {
      id: board.id,
      title: board.name,
      itemType: "folder",
      children: board.stacks.map((s) => s.id),
    };

    board.stacks.forEach((stack) => {
      items[stack.id] = {
        id: stack.id,
        title: stack.name,
        itemType: "folder",
        children: stack.items.map((i) => i.id),
      };
      stack.items.forEach((item) => {
        items[item.id] = {
          id: item.id,
          itemType: "video",
          title: item.name,
          videoId: item.itemId,
          children: [],
        };
      });
    });
  });
  console.log(items);
});
