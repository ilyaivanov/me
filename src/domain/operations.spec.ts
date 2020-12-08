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
    fit("focus should be set on search", () => {
      expect(getState().nodeFocusedId).toBe("SEARCH");
    });

    fit("fpo", () => {
      expect(getState().searchState.stateType).toBe("done");
    });
  });
});

const getState = () => store.getState();
