import gallery from "../gallery/pageObject";
import header from "../header/pageObject";
import sidebar from "../sidebar/pageObject";
import renderTestApp from "./renderTestApp";
import { findYoutubeVideos } from "../api/youtubeRequest";
import firebaseApi from "../api/firebase";
import { NodesContainer } from "../state";

const sampleYoutubeResponse = {
  items: [
    {
      id: "ITEM_FROM_BACKEND_1",
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

const testData: NodesContainer = {
  HOME: {
    id: "HOME",
    itemType: "folder",
    title: "Home",
    children: ["playground1"],
  },
  SEARCH: {
    id: "SEARCH",
    itemType: "folder",
    title: "Search",
    children: [],
  },
  playground1: {
    id: "playground1",
    itemType: "folder",
    title: "Playground",
    children: ["playground11", "playground12"],
  },
  playground11: {
    id: "playground11",
    itemType: "video",
    title: "Sync24 - DOT",
    image: "https://i.ytimg.com/vi/vQFDW0_GB8Q/mqdefault.jpg",
    videoId: "vQFDW0_GB8Q",
    children: [],
  },
  playground12: {
    id: "playground12",
    itemType: "video",
    title: "Something Something",
    image: "https://i.ytimg.com/vi/_WGJ83wSibc/mqdefault.jpg",
    videoId: "_WGJ83wSibc",
    children: [],
  },
};


it("When entering some term in the input field", async () => {
  (firebaseApi.load as jest.Mock).mockResolvedValue(testData);
  renderTestApp();
  await header.waitForPageRender();
  const searchPromise = Promise.resolve(sampleYoutubeResponse);
  (findYoutubeVideos as jest.Mock).mockReturnValue(searchPromise);
  expect(gallery.queryLoadingIndicator()).not.toBeInTheDocument();
  header.enterSearchTerm("my search term");
  header.clickSearch();
  expect(gallery.queryLoadingIndicator()).toBeInTheDocument();

  const card = await gallery.findCard("ITEM_FROM_BACKEND_1");
  expect(card).toBeInTheDocument();
  const card1 = await gallery.findCard("BACKEND_ITEM_ID_2");
  expect(card1).toBeInTheDocument();
});


it("Saving an items from search in a folder and vieweing that folder should show that item", async () => {
  (firebaseApi.load as jest.Mock).mockResolvedValue(testData);
  renderTestApp();
  const searchPromise = Promise.resolve(sampleYoutubeResponse);
  (findYoutubeVideos as jest.Mock).mockReturnValue(searchPromise);
  await header.waitForPageRender();
  header.clickSearch();

  await gallery.findCard("ITEM_FROM_BACKEND_1");

  gallery.mouseDownOnCard("ITEM_FROM_BACKEND_1");
  gallery.moveMouse({ movementX: 10, movementY: 10 });
  sidebar.mouseEnterSidebarRow("playground1");
  gallery.mouseUp();
  sidebar.focusOnItem("playground1");
  expect(gallery.queryCard("ITEM_FROM_BACKEND_1")).toBeInTheDocument();
  expect(gallery.queryCard("playground11")).toBeInTheDocument();

  //focusing on Home should not yield any errors and show thus many preview items
  sidebar.focusOnItem("HOME");
  expect(gallery.getPrieviewImagesCount("playground1")).toBe(3);
});
