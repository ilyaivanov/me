import { prepareLoadedTestApp } from "./helpers/renderTestApp";
import { gallery, player, sidebar } from "./helpers/testApp";
import { actions } from "../../domain";
import { createItemsBasedOnStructure } from "./helpers/itemsBuilder";

const testData = createItemsBasedOnStructure(`
  playground1
    video playground11
    video playground12
`);

it("opening a folder and playing a video should play that video id", async () => {
  await prepareLoadedTestApp(testData);
  sidebar.focusOnItem("playground1");
  gallery.playItem("video playground11");
  expect(player.getVideoIdBeingPlayed()).toBe("video playground11 videoId");
});

it("playing a folder should play first video in that folder regardless of nested level", async () => {
  await prepareLoadedTestApp(testData);
  gallery.playItem("playground1");
  expect(player.getVideoIdBeingPlayed()).toBe("video playground11 videoId");
});

it("when a video ends next video in that folder should be played", async () => {
  const store = await prepareLoadedTestApp(testData);
  sidebar.focusOnItem("playground1");
  gallery.playItem("video playground11");
  store.dispatch(actions.playNextTrack());
  expect(player.getVideoIdBeingPlayed()).toBe("video playground12 videoId");
});

it("when the last video in a folder ends no new video should be played", async () => {
  const store = await prepareLoadedTestApp(testData);
  sidebar.focusOnItem("playground1");
  gallery.playItem("video playground12");
  store.dispatch(actions.playNextTrack());
  expect(player.getVideoIdBeingPlayed()).toBe("video playground12 videoId");
});
