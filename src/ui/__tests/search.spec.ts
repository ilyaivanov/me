import { header, gallery, sidebar } from "./helpers/testApp";
import renderTestApp from "./helpers/renderTestApp";
import { fetchPlaylistVideos, findYoutubeVideos } from "../../api/youtubeRequest";
import firebaseApi from "../../api/firebase";
import { createEmptyItems, createItemsBasedOnStructure } from "./helpers/itemsBuilder";

const sampleYoutubeResponse = {
  items: [
    {
      id: "ITEM_FROM_BACKEND_1",
      image: "video1 image",
      itemId: "backend video1",
      name: "backend video1 title",
      itemType: "video",
    },
    {
      id: "ITEM_FROM_BACKEND_2",
      image: "video2 image",
      itemId: "backend video2",
      name: "backend video2 title",
      itemType: "video",
    },
    {
      id: "PLAYLIST_SEARCH_ITEM",
      image: "playlist_image",
      itemId: "playlist_id",
      name: "playlist_name",
      itemType: "playlist",
    },
  ],
};

it("When entering some term in the input field hitting search button items from the backend should be shown", async () => {
  (firebaseApi.load as jest.Mock).mockResolvedValue(createEmptyItems());
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
  const card1 = await gallery.findCard("ITEM_FROM_BACKEND_2");
  expect(card1).toBeInTheDocument();
});

it("Saving an items from search in a folder and vieweing that folder should show that item", async () => {
  (firebaseApi.load as jest.Mock).mockResolvedValue(
    createItemsBasedOnStructure(`
      folder1
        video1.1
        video1.2
    `)
  );
  renderTestApp();
  const searchPromise = Promise.resolve(sampleYoutubeResponse);
  (findYoutubeVideos as jest.Mock).mockReturnValue(searchPromise);
  await header.waitForPageRender();
  header.clickSearch();

  await gallery.findCard("ITEM_FROM_BACKEND_1");

  gallery.mouseDownOnDragInitiationArea("ITEM_FROM_BACKEND_1");
  gallery.moveMouse({ movementX: 10, movementY: 10 });
  sidebar.mouseEnterSidebarRow("folder1");
  gallery.mouseUp();
  sidebar.focusOnItem("folder1");

  expect(gallery.getAllCardTitles()).toEqual([
    "backend video1 title",
    "video1.1 title",
    "video1.2 title",
  ]);

  //focusing on Home should not yield any errors and show thus many preview items
  sidebar.focusOnItem("HOME");
  expect(gallery.getPrieviewImagesCount("folder1")).toBe(3);
});

//when search result is a playlist
//card should have it's image

it("having a playlisy item in a search query", async () => {
  (firebaseApi.load as jest.Mock).mockResolvedValue(
    createItemsBasedOnStructure(`
      folder1
    `)
  );
  renderTestApp();
  const searchPromise = Promise.resolve(sampleYoutubeResponse);
  (findYoutubeVideos as jest.Mock).mockReturnValue(searchPromise);
  (fetchPlaylistVideos as jest.Mock).mockResolvedValue({
    items: [
      {
        id: "PLAYLIST_SUBITEM_1",
        image: "subitem_video1 image",
        itemId: "backend video1",
        name: "subitem_video1_title",
        itemType: "video",
      },
      {
        id: "PLAYLIST_SUBITEM_2",
        image: "subitem_video2 image",
        itemId: "backend video2",
        name: "backend video2 title",
        itemType: "video",
      },
    ],
  });
  await header.waitForPageRender();
  header.clickSearch();

  await gallery.findCard("PLAYLIST_SEARCH_ITEM");

  gallery.clickOnExpandCard("PLAYLIST_SEARCH_ITEM");

  expect(
    gallery.queryLoadingIndicatorForCard("PLAYLIST_SEARCH_ITEM")
  ).toBeInTheDocument();

  await gallery.findSubtrack("PLAYLIST_SUBITEM_1");

  expect(
    gallery.queryLoadingIndicatorForCard("PLAYLIST_SEARCH_ITEM")
  ).not.toBeInTheDocument();

  expect(gallery.getSubtrackLabel("PLAYLIST_SUBITEM_1")).toBe(
    "subitem_video1_title"
  );
});
