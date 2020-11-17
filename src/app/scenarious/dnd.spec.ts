import {prepareLoadedTestApp} from "./renderTestApp";
import gallery from "../gallery/pageObject";
import sidebar from "../sidebar/pageObject";
import {NodesContainer} from "../state";

const testData: NodesContainer = {
  HOME: {
    id: "HOME",
    itemType: "folder",
    title: "Home",
    children: ["playground1", "nestedRoot", "playground12"],
  },
  SEARCH: {
    id: "SEARCH",
    itemType: "folder",
    title: "Search",
    children: [],
  },
  playground1: {
    id: "playground1",
    itemType: "folder",
    title: "Playground",
    children: ["playground11", "playground12"],
  },
  playground11: {
    id: "playground11",
    itemType: "video",
    title: "Sync24 - DOT",
    image: "https://i.ytimg.com/vi/vQFDW0_GB8Q/mqdefault.jpg",
    videoId: "vQFDW0_GB8Q",
    children: [],
  },
  playground12: {
    id: "playground12",
    itemType: "video",
    title: "Something Something",
    image: "https://i.ytimg.com/vi/_WGJ83wSibc/mqdefault.jpg",
    videoId: "_WGJ83wSibc",
    children: [],
  },
  nestedRoot: {
    id: "nestedRoot",
    itemType: "folder",
    title: "Nested Root",
    children: ["nested1", "nested2", "nested3"],
  },
  nested1: {
    id: "nested1",
    itemType: "folder",
    title: "Nested 1",
    children: ["nested1Video"],
  },
  nested2: {
    id: "nested2",
    itemType: "folder",
    title: "Nested 2",
    children: ["nested2Video"],
  },
  nested3: {
    id: "nested3",
    itemType: "folder",
    title: "Nested 3",
    children: ["nested3Video"],
  },
  nested1Video: {
    id: "nested1Video",
    itemType: "video",
    title: "Something Something",
    image: "https://i.ytimg.com/vi/_WGJ83wSibc/mqdefault.jpg",
    videoId: "_WGJ83wSibc",
    children: [],
  },
  nested2Video: {
    id: "nested2Video",
    itemType: "video",
    title: "Something Something",
    image: "https://i.ytimg.com/vi/_WGJ83wSibc/mqdefault.jpg",
    videoId: "_WGJ83wSibc",
    children: [],
  },
  nested3Video: {
    id: "nested3Video",
    itemType: "video",
    title: "Joe Rogan Experience #1562 - Dave Smith",
    image: "https://i.ytimg.com/vi/5PrLGhJnO7I/mqdefault.jpg",
    videoId: "5PrLGhJnO7I",
    children: [],
  },
};

//TODO: improve test cases names
describe("foo", () => {
  beforeEach(async () => {
    await prepareLoadedTestApp(testData)
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
