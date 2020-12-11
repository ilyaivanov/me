import { store, actions } from "./store";

describe("Domain specs", () => {
  beforeEach(actions.reset);

  it("by default items should only be home and search", () => {
    const { items } = getState();
    expect(Object.keys(items)).toEqual(["HOME", "SEARCH", "SEARCH_SIMILAR"]);
  });

  it("by default Home is focused", () => {
    const { nodeFocusedId } = getState();
    expect(nodeFocusedId).toEqual("HOME");
  });
  it("when focusing some item id is store under node focused field", () => {
    actions.focusNode("SEARCH");
    const { nodeFocusedId } = getState();
    expect(nodeFocusedId).toEqual("SEARCH");
  });

  describe("having one item under Home", () => {
    beforeEach(() => {
      actions.replaceChildren("HOME", [createRegularFolder("sub1", "title1")]);
    });

    it("Home should have that item id as child", () => {
      const home = getState().items["HOME"];
      expect(home.children).toEqual(["sub1"]);
    });

    it("should also add that item under children", () => {
      const { items } = getState();
      expect(items["sub1"].id).toBe("sub1");
    });

    it("appending new children to home should add that item to children and items", () => {
      actions.appendChildren("HOME", [createRegularFolder("sub2")]);
      const { items } = getState();
      const homeChildren = items["HOME"].children;
      expect(homeChildren).toEqual(["sub1", "sub2"]);
      expect(items["sub2"].id).toBe("sub2");
    });

    it("changing that item by renaming it should change name of that item", () => {
      expect(getState().items["sub1"].title).toBe("title1");
      actions.changeItem("sub1", { title: "new title" });
      expect(getState().items["sub1"].title).toBe("new title");
    });

    it("removing that item should remove it from Home and items", () => {
      expect(getHome().children).toEqual(["sub1"]);
      actions.removeItem("sub1");
      expect(getHome().children).toEqual([]);
    });
  });

  //   it("when loading new quote a laoding indicator should be shown", async () => {
  //     //@ts-expect-error
  //     fetch = jest.fn();
  //     (fetch as jest.Mock).mockResolvedValue({
  //       json: () => Promise.resolve({ text: "my quote" }),
  //     });
  //     expect(store.getState().isLoading).toBe(false);
  //     const searchPromise = actions.loadNewQuote();
  //     expect(store.getState().isLoading).toBe(true);
  //     await searchPromise;
  //     expect(store.getState().isLoading).toBe(false);
  //     expect(store.getState().quote).toBe("my quote");
  //   });
});

//Minor helpers to abstract irrelevant details
const createRegularFolder = (id: string, title?: string): Item => ({
  id,
  itemType: "folder",
  title: title || id + " title",
  children: [],
});

const getState = () => store.getState();

const getHome = (): Item => getState().items["HOME"];
