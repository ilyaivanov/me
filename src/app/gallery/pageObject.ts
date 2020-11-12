import { fireEvent, screen } from "@testing-library/react";

export const ids = {
  loadingIndicator: "loading-indicator",
};
// prettier-ignore
class Gallery {
  playItem = (itemId: string) =>
    fireEvent.click(screen.getByTestId("play-icon-" + itemId))

  queryLoadingIndicator() {
    return screen.queryByTestId(ids.loadingIndicator);
  }
}

export default new Gallery();
