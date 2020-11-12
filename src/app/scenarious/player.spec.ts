import renderTestApp from "./renderTestApp";
import sidebar from "../sidebar/pageObject";
import gallery from "../gallery/pageObject";
import player from "../player/pageObject";
import {allActions} from "../state";

it("opening a folder and playing a video should play that video id", () => {
  renderTestApp();
  sidebar.focusOnItem("playground1");
  gallery.playItem("playground11");
  expect(player.getVideoIdBeingPlayed()).toBe("vQFDW0_GB8Q");
});

it("playing a folder should play first video in that folder regardless of nested level", () => {
  renderTestApp();
  gallery.playItem('nestedRoot')
  expect(player.getVideoIdBeingPlayed()).toBe("_WGJ83wSibc");
});


it("when a video ends next video in that folder should be played", () => {
  const store = renderTestApp();
  sidebar.focusOnItem("playground1");
  gallery.playItem("playground11");
  store.dispatch(allActions.onVideoEnd());
  expect(player.getVideoIdBeingPlayed()).toBe("_WGJ83wSibc");
});

it("when the last video in a folder ends no new video should be played", () => {
  const store = renderTestApp();
  sidebar.focusOnItem("playground1");
  gallery.playItem("playground12");
  store.dispatch(allActions.onVideoEnd());
  expect(player.getVideoIdBeingPlayed()).toBe("_WGJ83wSibc");
});
