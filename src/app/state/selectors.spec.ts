import { getPreviewImagesForFolder } from "./selectors";
import { initialState } from "./index";

it("getting all children for a Playground returns two images", function () {
  expect(getPreviewImagesForFolder(initialState.items, "playground1")).toEqual([
    "https://i.ytimg.com/vi/vQFDW0_GB8Q/mqdefault.jpg",
    "https://i.ytimg.com/vi/_WGJ83wSibc/mqdefault.jpg",
  ]);
});
