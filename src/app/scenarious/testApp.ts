import {
  fireEvent,
  getAllByTestId,
  getByTestId,
  queryByTestId,
  screen,
  getAllByAltText,
} from "@testing-library/react";

import * as ids from "../testId";

export const header = {
  enterSearchTerm(term: string) {
    fireEvent.change(screen.getByTestId(ids.header.searchInput), {
      target: { value: term },
    });
  },

  clickSearch() {
    fireEvent.click(screen.getByTestId(ids.header.searchButton));
  },

  async waitForPageRender() {
    await screen.findByTestId("sidebar");
  },
};

class Gallery {
  getSubtrackLabel(itemId: string): string {
    const subtrack = screen.getByTestId(ids.gallery.subtrack(itemId));
    return getByTestId(subtrack, ids.gallery.subtrackText).innerHTML;
  }

  queryLoadingIndicatorForCard(itemId: string): any {
    return queryByTestId(
      this.queryCard(itemId),
      ids.gallery.cardLoadingIndicator
    );
  }
  clickOnExpandCard(itemId: string) {
    const expand = getByTestId(this.queryCard(itemId), ids.gallery.expandCard);
    fireEvent.click(expand);
  }

  queryCard(itemId: string): any {
    return queryByTestId(
      screen.getByTestId("gallery"),
      ids.gallery.card(itemId)
    );
  }

  getPrieviewImagesCount(itemId: string): any {
    const card = this.queryCard(itemId);
    const folder = getByTestId(card, ids.gallery.folderPreview);
    return getAllByAltText(folder, "preview").length;
  }

  getAllCardTitles(): any {
    return getAllByTestId(
      screen.getByTestId("gallery"),
      ids.gallery.cardTitle
    ).map((title) => title.innerHTML);
  }

  findCard(itemId: string): Promise<any> {
    return screen.findByTestId(ids.gallery.card(itemId), undefined, {
      timeout: 200,
    });
  }

  findSubtrack(itemId: string): Promise<any> {
    return screen.findByTestId(ids.gallery.subtrack(itemId), undefined, {
      timeout: 200,
    });
  }
  playItem(itemId: string) {
    fireEvent.click(getByTestId(this.queryCard(itemId), "play-icon"));
  }

  queryLoadingIndicator() {
    return screen.queryByTestId(ids.gallery.loadingIndicator);
  }

  mouseDownOnCard(itemId: string, eventData?: Partial<MouseEvent>) {
    fireEvent.mouseDown(
      screen.getByTestId(ids.gallery.card(itemId)),
      eventData
    );
  }

  moveMouse(eventData: Partial<MouseEvent>) {
    const event = new MouseEvent("mousemove", {
      clientX: eventData.clientX,
      clientY: eventData.clientY,
    });
    fireEvent(
      document,
      Object.assign(event, {
        movementX: eventData.movementX,
        movementY: eventData.movementY,
      })
    );
  }

  mouseUp(eventData?: Partial<MouseEvent>) {
    const event = new MouseEvent("mouseup");
    fireEvent(document, Object.assign(event, eventData));
  }

  getDragAvatar() {
    return screen.queryByTestId(ids.gallery.dragAvatar);
  }

  mouseEnterCard(itemId: string) {
    //TODO: when card ui will be extracted I can get rid of test-id from the drag avatar
    fireEvent.mouseEnter(
      getByTestId(screen.getByTestId("gallery"), ids.gallery.card(itemId))
    );
  }
  mouseLeaveCard(itemId: string) {
    //TODO: when card ui will be extracted I can get rid of test-id from the drag avatar
    fireEvent.mouseLeave(
      getByTestId(screen.getByTestId("gallery"), ids.gallery.card(itemId))
    );
  }
}
export const gallery = new Gallery();

class Player {
  getVideoIdBeingPlayed = () => {
    return screen.getByTestId(ids.player.mockedYoutubePlayer).innerHTML;
  };
}

export const player = new Player();

class Sidebar {
  querySidebarRow = (id: string) => screen.queryByTestId(`sidebar-row-${id}`);

  querySidebarArrow = (id: string) => screen.queryByTestId(`row-arrow-${id}`);

  clickAddFolder = () => fireEvent.click(screen.getByTestId("folder-add"));

  clickRemoveFolder = (folderId: string) =>
    fireEvent.click(screen.getByTestId(`folder-remove-${folderId}`));

  clickRenameFolder = (folderId: string) =>
    fireEvent.click(screen.getByTestId(`folder-rename-${folderId}`));

  clickRowArrow = (folderId: string) =>
    fireEvent.click(screen.getByTestId(`row-arrow-${folderId}`));

  enterTextIntoFolderInputField = (folderId: string, nextText: string) =>
    fireEvent.change(screen.getByTestId(`folder-input-${folderId}`), {
      target: { value: nextText },
    });

  loseFocusOnInput = (folderId: string) =>
    fireEvent.blur(screen.getByTestId(`folder-input-${folderId}`));

  getFolderTitle = (folderId: string) =>
    screen.queryByTestId(`folder-title-${folderId}`)?.innerHTML;

  focusOnItem = (folderId: string) => {
    const elem = this.querySidebarRow(folderId);
    if (!elem)
      throw new Error("Test error: Can't find folder with id: " + folderId);
    else fireEvent.click(elem);
  };

  mouseEnterSidebarRow(itemId: string) {
    fireEvent.mouseEnter(screen.getByTestId(`sidebar-row-${itemId}`));
  }
}

export const sidebar = new Sidebar();
