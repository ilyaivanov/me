import gallery from "../gallery/pageObject";
import header from "../header/pageObject";
import renderTestApp from "./renderTestApp";
import { findYoutubeVideos } from "../api/youtubeRequest";

jest.mock("../api/youtubeRequest", () => ({
  findYoutubeVideos: jest.fn(),
}));

fit("When entering some term in the input field", async () => {
  const sampleYoutubeResponse = {
    items: [
      {
        id: "BACKEND_ITEM_ID_1",
        image: "https://i.ytimg.com/vi/5z6IKnYXqFM/default.jpg",
        itemId: "5z6IKnYXqFM",
        name: "Sync24 - Comfortable Void [Full Album]",
        itemType: "video",
      },
      {
        id: "BACKEND_ITEM_ID_2",
        image: "https://i.ytimg.com/vi/8ONz3_vjJIY/default.jpg",
        itemId: "8ONz3_vjJIY",
        name: "Sync24 - Omnious [Full Album]",
        itemType: "video",
      },
    ],
  };
  renderTestApp();
  const searchPromise = Promise.resolve(sampleYoutubeResponse);
  (findYoutubeVideos as jest.Mock).mockReturnValue(searchPromise);
  expect(gallery.queryLoadingIndicator()).not.toBeInTheDocument();
  header.enterSearchTerm("my search term");
  header.clickSearch();
  expect(gallery.queryLoadingIndicator()).toBeInTheDocument();

  const card = await gallery.findCard("BACKEND_ITEM_ID_1");
  expect(card).toBeInTheDocument();
  const card1 = await gallery.findCard("BACKEND_ITEM_ID_2");
  expect(card1).toBeInTheDocument();
});
