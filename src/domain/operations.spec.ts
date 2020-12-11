import { createItemsBasedOnStructure } from "../ui/__tests/helpers/itemsBuilder";
import { actions, store } from "./";
import { findSimilarYoutubeVideos } from "../api/youtubeRequest";

describe("Having some video in gallery", () => {
  beforeEach(() => {
    (findSimilarYoutubeVideos as jest.Mock).mockResolvedValue({
      pageInfo: {
        totalResults: 91,
        resultsPerPage: 25,
      },
      regionCode: "UA",
      nextPageToken: "CBkQAA",
      items: [
        {
          id: "3984a678f88c5cc8265ba7c1",
          image: "https://i.ytimg.com/vi/i7kh8pNRWOo/mqdefault.jpg",
          itemId: "i7kh8pNRWOo",
          name:
            "Techniques for dealing with lack of motivation, malaise, depression",
          itemType: "video",
        },
      ],
    });
    actions.reset();
    actions.setItems(
      createItemsBasedOnStructure(`
        folder
            video
    `)
    );
  });

  describe("when clicking on find similar video icon", () => {
    beforeEach(() => actions.findSimilarVideos("video"));
    it("focus should be set on search", () => {
      expect(getState().nodeFocusedId).toBe("SEARCH_SIMILAR");
    });

    it("fpo", () => {
      expect(getState().searchState.stateType).toBe("done");
    });

    it("foo", () => {
      expect(getState().items["SEARCH_SIMILAR"].children).toHaveLength(1);
    });

    it("scrolling till the end should load more items", async () => {
      actions.onSubtracksScroll(
        {
          currentTarget: {
            scrollHeight: 1000,
            scrollTop: 700,
            offsetHeight: 200,
          },
        } as any,
        getState().items["SEARCH_SIMILAR"]
      );
      await new Promise((resolve) => setTimeout(resolve, 2));
      expect(getState().items["SEARCH_SIMILAR"].children).toHaveLength(2);
    });
  });
});

const getState = () => store.getState();
