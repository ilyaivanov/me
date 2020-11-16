import renderTestApp from "./renderTestApp";
import gallery from "../gallery/pageObject";
import sidebar from "../sidebar/pageObject";

//TODO: improve test cases names
describe("foo", () => {
  beforeEach(renderTestApp);

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
    gallery.mouseDownOnCard("playground12", { clientX: 310, clientY: 260 });
    gallery.moveMouse({
      movementX: 3,
      movementY: 4,
      clientX: 313,
      clientY: 264,
    });
    expect(gallery.queryCard("playground12")).toHaveClass("card-being-dragged");
    gallery.mouseEnterCard("playground11");

    expect(gallery.queryCard("playground11")).toHaveClass(
      "card-drag-destination"
    );

    gallery.mouseLeaveCard("playground11");

    expect(gallery.queryCard("playground11")).not.toHaveClass(
      "card-drag-destination"
    );
  });

  it("releasing item during drag it should place a card on that position", function () {
    const givenOrder = ["Playground", "Nested Root", "Something Something"];
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
      "Nested Root",
      "Playground",
      "Something Something",
    ];
    expect(gallery.getAllCardTitles()).toEqual(newOrderOfCards);
  });

  it("COPY 1", function () {
    const givenOrder = ["Playground", "Nested Root", "Something Something"];
    const titles = gallery.getAllCardTitles();
    expect(titles).toEqual(givenOrder);

    //TODO: extract this to a pageObject
    gallery.mouseDownOnCard("playground12", { clientX: 310, clientY: 260 });
    gallery.moveMouse({
      movementX: 3,
      movementY: 4,
      clientX: 313,
      clientY: 264,
    });

    gallery.mouseEnterCard("playground1");
    gallery.mouseUp();

    const newOrderOfCards = [
      "Something Something",
      "Playground",
      "Nested Root",
    ];
    expect(gallery.getAllCardTitles()).toEqual(newOrderOfCards);
  });

  it("COPY 12", function () {
    //TODO: extract this to a pageObject
    gallery.mouseDownOnCard("playground12", { clientX: 310, clientY: 260 });
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
    gallery.mouseDownOnCard("playground12", { clientX: 310, clientY: 260 });
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
    const withoutPlayground = [
      "Playground",
      "Nested Root",
    ];
    expect(gallery.getAllCardTitles()).toEqual(withoutPlayground);

    sidebar.focusOnItem("playground1");
    const expectedCardsForPlayground = [
      "Something Something",
      "Sync24 - DOT",
      "Something Something",
    ];
    expect(gallery.getAllCardTitles()).toEqual(expectedCardsForPlayground);
  });


});
