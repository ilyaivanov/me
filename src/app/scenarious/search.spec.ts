import gallery from "../gallery/pageObject";
import header from "../header/pageObject";
import renderTestApp from "./renderTestApp";
import { searchVideos } from "../api/searchVideos";

jest.mock("../api/searchVideos", () => ({
  searchVideos: jest.fn(),
}));

it("When entering some term in the input field", () => {
  renderTestApp();
  const searchPromise = Promise.resolve();
  (searchVideos as jest.Mock).mockReturnValue(searchPromise);
  expect(gallery.queryLoadingIndicator()).not.toBeInTheDocument();
  header.enterSearchTerm("my search term");
  header.clickSearch();
  expect(gallery.queryLoadingIndicator()).toBeInTheDocument();

  return searchPromise.then(() => {
    expect(gallery.queryLoadingIndicator()).not.toBeInTheDocument();
  });
});