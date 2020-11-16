import gallery from "../gallery/pageObject";
import header from "../header/pageObject";
import sidebar from "../sidebar/pageObject";
import renderTestApp from "./renderTestApp";
import { findYoutubeVideos } from "../api/youtubeRequest";

jest.mock("../api/youtubeRequest", () => ({
  findYoutubeVideos: jest.fn(),
}));
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

it("When entering some term in the input field", async () => {
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


fit("Saving an items from search in a folder and vieweing that folder should show that item", async () => {
  renderTestApp();
  const searchPromise = Promise.resolve(sampleYoutubeResponse);
  (findYoutubeVideos as jest.Mock).mockReturnValue(searchPromise);
  header.clickSearch();

  await gallery.findCard("BACKEND_ITEM_ID_1");

  gallery.mouseDownOnCard("BACKEND_ITEM_ID_1");
  gallery.moveMouse({movementX: 10, movementY: 10})
  sidebar.mouseEnterSidebarRow("playground1")
  gallery.mouseUp();
  sidebar.focusOnItem("playground1")
  expect(gallery.queryCard("BACKEND_ITEM_ID_1")).toBeInTheDocument();
  expect(gallery.queryCard("playground11")).toBeInTheDocument();

  //focusing on Home should not yield any errors and show thus many preview items
  sidebar.focusOnItem("HOME");
  expect(gallery.getPrieviewImagesCount("playground1")).toBe(3)
});
