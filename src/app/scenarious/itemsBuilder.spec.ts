import { createItemsBasedOnStructure } from "./itemsBuilder";

it("folder with two folders each having two videos", function () {
  const items = createItemsBasedOnStructure(`
    folder 1
      folder 1.1
        video 1.1.1
        video 1.1.2
      folder 1.2
        video 1.2.1
        video 1.2.2
    folder 2
      video 2.1
  `);

  expect(items["HOME"].children).toEqual(["folder 1", "folder 2"]);
  expect(items["folder 1"].children).toEqual(["folder 1.1", "folder 1.2"]);
  expect(items["folder 2"].children).toEqual(["video 2.1"]);
  expect(items["folder 1.1"].children).toEqual(["video 1.1.1", "video 1.1.2"]);
  expect(items["folder 1.2"].children).toEqual(["video 1.2.1", "video 1.2.2"]);
  expect(items["video 1.2.1"].itemType).toEqual("video");
  expect(items["folder 1.2"].itemType).toEqual("folder");
});
