import {prepareLoadedTestApp} from "./renderTestApp";
import sidebar from "../sidebar/pageObject";
import gallery from "../gallery/pageObject";
import player from "../player/pageObject";
import {allActions, NodesContainer} from "../state";
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
it("opening a folder and playing a video should play that video id", async () => {
  await prepareLoadedTestApp(testData);
  sidebar.focusOnItem("playground1");
  gallery.playItem("playground11");
  expect(player.getVideoIdBeingPlayed()).toBe("vQFDW0_GB8Q");
});

it("playing a folder should play first video in that folder regardless of nested level", async () => {
  await prepareLoadedTestApp(testData);
  gallery.playItem('playground1')
  expect(player.getVideoIdBeingPlayed()).toBe("vQFDW0_GB8Q");
});


it("when a video ends next video in that folder should be played", async () => {
  const store = await prepareLoadedTestApp(testData);
  sidebar.focusOnItem("playground1");
  gallery.playItem("playground11");
  store.dispatch(allActions.onVideoEnd());
  expect(player.getVideoIdBeingPlayed()).toBe("_WGJ83wSibc");
});

it("when the last video in a folder ends no new video should be played", async () => {
  const store = await prepareLoadedTestApp(testData);
  sidebar.focusOnItem("playground1");
  gallery.playItem("playground12");
  store.dispatch(allActions.onVideoEnd());
  expect(player.getVideoIdBeingPlayed()).toBe("_WGJ83wSibc");
});
