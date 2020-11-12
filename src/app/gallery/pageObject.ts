import { fireEvent, screen } from "@testing-library/react";

export const ids = {
  loadingIndicator: "loading-indicator",
  card: (cardId: string) => `card-${cardId}`,
};
// prettier-ignore
class Gallery {
  
  queryCard(itemId: string): any {
      return screen.queryByTestId(ids.card(itemId))
  }

  findCard(itemId: string): Promise<any> {
      return screen.findByTestId(ids.card(itemId), undefined, {timeout: 200})
  }

  playItem (itemId: string) {
    fireEvent.click(screen.getByTestId("play-icon-" + itemId))
  }

  queryLoadingIndicator() {
    return screen.queryByTestId(ids.loadingIndicator);
  }
}

export default new Gallery();
