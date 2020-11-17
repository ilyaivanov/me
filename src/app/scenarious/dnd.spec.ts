import { prepareLoadedTestApp } from "./renderTestApp";
import gallery from "../gallery/pageObject";
import sidebar from "../sidebar/pageObject";
import { NodesContainer } from "../state";
import { createItemsBasedOnStructure } from "./itemsBuilder";

const testData1 = createItemsBasedOnStructure(`
  playground1
    video playground11
    video playground12
  nestedRoot
    nested1
      video nested1Video
    nested2
      video nested2Video
    nested3
      video nested3Video
  video playground2
`);

//TODO: improve test cases names
describe("foo", () => {
  beforeEach(async () => {
    await prepareLoadedTestApp(testData1);
  });

  it("having an app", function () {
    gallery.moveMouse({ movementX: 5, movementY: 5 });
    expect(gallery.getDragAvatar()).not.toBeInTheDocument();

    gallery.mouseDownOnCard("playground1", { clientX: 10, clientY: 10 });

    //I'm not initiating drag immediately, user needs to drag at least 4 pixels in distance
    gallery.moveMouse({ movementX: 1, movementY: 1 });
    gallery.moveMouse({ movementX: -1, movementY: 1 });
    expect(gallery.getDragAvatar()).not.toBeInTheDocument();

    gallery.moveMouse({ movementX: 5, movementY: 5 });
    expect(gallery.getDragAvatar()).toBeInTheDocument();

    gallery.mouseUp({});
    expect(gallery.getDragAvatar()).not.toBeInTheDocument();
  });

  it("firing fucking events", () => {
    // @ts-ignore
    window.HTMLElement.prototype.getBoundingClientRect = () => ({
      width: 120,
      height: 200,
      top: 250,
      left: 300,
    });

    gallery.mouseDownOnCard("playground1", { clientX: 310, clientY: 260 });
    gallery.moveMouse({
      movementX: 3,
      movementY: 4,
      clientX: 313,
      clientY: 264,
    });

    const style = gallery.getDragAvatar()?.style;
    if (!style) {
      throw new Error("No styles present on the avatar");
    }
    expect(style.width).toBe("120px");
    expect(style.height).toBe("200px");
    expect(style.top).toBe("254px");
    expect(style.left).toBe("303px");
  });

  it("when mouse enters card no card-destination class should be added", function () {
    expect(gallery.queryCard("playground1")).not.toHaveClass(
      "card-drag-destination"
    );
    gallery.mouseEnterCard("playground1");
    expect(gallery.queryCard("playground1")).not.toHaveClass(
      "card-drag-destination"
    );
  });

  it("while dragging and mouse enters card card-destination class should be added", function () {
    sidebar.focusOnItem("playground1");
    gallery.mouseDownOnCard("video playground12", {
      clientX: 310,
      clientY: 260,
    });
    gallery.moveMouse({
      movementX: 3,
      movementY: 4,
      clientX: 313,
      clientY: 264,
    });
    expect(gallery.queryCard("video playground12")).toHaveClass(
      "card-being-dragged"
    );
    gallery.mouseEnterCard("video playground11");

    expect(gallery.queryCard("video playground11")).toHaveClass(
      "card-drag-destination"
    );

    gallery.mouseLeaveCard("video playground11");

    expect(gallery.queryCard("video playground11")).not.toHaveClass(
      "card-drag-destination"
    );
  });

  it("releasing item during drag it should place a card on that position", function () {
    const givenOrder = [
      "playground1 title",
      "nestedRoot title",
      "video playground2 title",
    ];
    const titles = gallery.getAllCardTitles();
    expect(titles).toEqual(givenOrder);

    //TODO: extract this to a pageObject
    gallery.mouseDownOnCard("playground1", { clientX: 310, clientY: 260 });
    gallery.moveMouse({
      movementX: 3,
      movementY: 4,
      clientX: 313,
      clientY: 264,
    });

    gallery.mouseEnterCard("nestedRoot");
    gallery.mouseUp();

    const newOrderOfCards = [
      "nestedRoot title",
      "playground1 title",
      "video playground2 title",
    ];
    expect(gallery.getAllCardTitles()).toEqual(newOrderOfCards);
  });

  it("COPY 1", function () {
    const givenOrder = [
      "playground1 title",
      "nestedRoot title",
      "video playground2 title",
    ];
    const titles = gallery.getAllCardTitles();
    expect(titles).toEqual(givenOrder);

    //TODO: extract this to a pageObject
    gallery.mouseDownOnCard("video playground2", {
      clientX: 310,
      clientY: 260,
    });
    gallery.moveMouse({
      movementX: 3,
      movementY: 4,
      clientX: 313,
      clientY: 264,
    });

    gallery.mouseEnterCard("playground1");
    gallery.mouseUp();

    const newOrderOfCards = [
      "video playground2 title",
      "playground1 title",
      "nestedRoot title",
    ];
    expect(gallery.getAllCardTitles()).toEqual(newOrderOfCards);
  });

  it("COPY 12", function () {
    //TODO: extract this to a pageObject
    gallery.mouseDownOnCard("video playground2", {
      clientX: 310,
      clientY: 260,
    });
    gallery.moveMouse({
      movementX: 6,
      movementY: 4,
      clientX: 313,
      clientY: 264,
    });

    sidebar.mouseEnterSidebarRow("playground1");
    expect(sidebar.querySidebarRow("playground1")).toHaveClass(
      "row-mouse-over-during-drag"
    );

    gallery.mouseUp();
    expect(sidebar.querySidebarRow("playground1")).not.toHaveClass(
      "row-mouse-over-during-drag"
    );
  });

  it("COPY 123", function () {
    //TODO: extract this to a pageObject
    gallery.mouseDownOnCard("video playground2", {
      clientX: 310,
      clientY: 260,
    });
    gallery.moveMouse({
      movementX: 6,
      movementY: 4,
      clientX: 313,
      clientY: 264,
    });

    sidebar.mouseEnterSidebarRow("playground1");

    expect(gallery.queryCard("playground1")).not.toHaveClass(
      "card-drag-destination"
    );

    gallery.mouseUp();
    const withoutPlayground = ["playground1 title", "nestedRoot title"];
    expect(gallery.getAllCardTitles()).toEqual(withoutPlayground);

    sidebar.focusOnItem("playground1");
    const expectedCardsForPlayground = [
      "video playground2 title",
      "video playground11 title",
      "video playground12 title",
    ];
    expect(gallery.getAllCardTitles()).toEqual(expectedCardsForPlayground);
  });
});
