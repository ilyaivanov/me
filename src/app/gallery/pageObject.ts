import { fireEvent, screen } from "@testing-library/react";

export const ids = {
  loadingIndicator: "loading-indicator",
  card: (cardId: string) => `card-${cardId}`,
  dragAvatar: "drag-avatar",

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

  mouseDownOnCard(itemId: string) {
    fireEvent.mouseDown(screen.getByTestId(ids.card(itemId)));
  }

  moveMouse(eventData : Partial<MouseEvent>){
    const event = new MouseEvent('mousemove');
    fireEvent(document, Object.assign(event, eventData));
  }

  mouseUp(eventData : Partial<MouseEvent>){
    const event = new MouseEvent('mouseup');
    fireEvent(document, Object.assign(event, eventData));
  }

  getDragAvatar(){
    return screen.queryByTestId(ids.dragAvatar);
  }
}

export default new Gallery();
