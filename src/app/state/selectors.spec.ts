import { getPreviewItemsForFolder } from "./selectors";
import { initialState } from "./index";

it("getting all children for a Playground returns two images", function () {
  const playgroundChildren = getPreviewItemsForFolder(
    initialState.items,
    "playground1"
  ).map((i) => i.title);

  expect(playgroundChildren).toEqual(["Sync24 - DOT", "Something Something"]);
});
