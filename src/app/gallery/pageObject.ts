import { fireEvent, screen } from "@testing-library/react";

// prettier-ignore
class Gallery {
  playItem = (itemId: string) =>
    fireEvent.click(screen.getByTestId("play-icon-" + itemId))
}

export default new Gallery();
