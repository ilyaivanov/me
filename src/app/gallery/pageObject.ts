import {
  fireEvent,
  getAllByTestId,
  getByTestId,
  queryByTestId,
  screen,
  getAllByAltText,
} from "@testing-library/react";

export const ids = {
  loadingIndicator: "loading-indicator",
  card: (cardId: string) => `card-${cardId}`,
  dragAvatar: "drag-avatar",
  cardTitle: "card-title",
  playIcon: `play-icon`,
  folderPreview: `folder-preview`,
};
// prettier-ignore
class Gallery {
  
  queryCard(itemId: string): any {
      return queryByTestId(screen.getByTestId("gallery"), ids.card(itemId))
  }

  getPrieviewImagesCount(itemId: string): any {
    const card = this.queryCard(itemId);
    const folder = getByTestId(card, ids.folderPreview);
    return getAllByAltText(folder, "preview-image").length;
  }

  getAllCardTitles(): any {
    return getAllByTestId(screen.getByTestId("gallery"), ids.cardTitle).map(title => title.innerHTML);
  }

  findCard(itemId: string): Promise<any> {
      return screen.findByTestId(ids.card(itemId), undefined, {timeout: 200})
  }

  playItem (itemId: string) {
    fireEvent.click(getByTestId(this.queryCard(itemId), "play-icon"))
  }

  queryLoadingIndicator() {
    return screen.queryByTestId(ids.loadingIndicator);
  }

  mouseDownOnCard(itemId: string, eventData? : Partial<MouseEvent>) {
    fireEvent.mouseDown(screen.getByTestId(ids.card(itemId)), eventData);
  }

  moveMouse(eventData : Partial<MouseEvent>){
    const event = new MouseEvent('mousemove', {
      clientX: eventData.clientX,
      clientY: eventData.clientY,
    });
    fireEvent(document, Object.assign(event, {
      movementX: eventData.movementX,
      movementY: eventData.movementY,
    }));
  }

  mouseUp(eventData? : Partial<MouseEvent>){
    const event = new MouseEvent('mouseup');
    fireEvent(document, Object.assign(event, eventData));
  }


  getDragAvatar(){
    return screen.queryByTestId(ids.dragAvatar);
  }

  mouseEnterCard(itemId: string) {
    //TODO: when card ui will be extracted I can get rid of test-id from the drag avatar
    fireEvent.mouseEnter(getByTestId(screen.getByTestId("gallery"), ids.card(itemId)))
  }
  mouseLeaveCard(itemId: string) {
    //TODO: when card ui will be extracted I can get rid of test-id from the drag avatar
    fireEvent.mouseLeave(getByTestId(screen.getByTestId("gallery"), ids.card(itemId)))
  }
}

export default new Gallery();
