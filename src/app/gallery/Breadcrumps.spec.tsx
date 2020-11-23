import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { createItemsBasedOnStructure } from "../scenarious/itemsBuilder";
import { allActions, createMediaExplorerStore } from "../state";
import Breadcrumps from "./Breadcrumps";

describe("Having a sidebar with some folders", () => {
  let store: ReturnType<typeof createMediaExplorerStore>;
  beforeEach(() => {
    const items = createItemsBasedOnStructure(`
              folder1
                  subfolder1.1
                      video 1.1.1
                  subfolder1.2
          `);
    store = createMediaExplorerStore();
    store.dispatch(allActions.setItems(items));
    render(
      <Provider store={store}>
        <Breadcrumps />
      </Provider>
    );
  });
  it("when focus is on Home (by default) only home text should be in the breadcrump", () => {
    expect(getBreadcrumpLabels()).toEqual(["Home"]);
  });

  describe("focusing on folder1", () => {
    beforeEach(() => {
      store.dispatch(allActions.focusNode("folder1"));
    });
    it("adds that folder to the breadcrumps", () => {
      expect(getBreadcrumpLabels()).toEqual(["Home", "folder1 title"]);
    });

    xit("adds that folder siblings to submenu section", () => {});
  });

  it("focusing on subfolder1.1 should add all intermediate folders to the breadcrumps", () => {
    store.dispatch(allActions.focusNode("subfolder1.1"));
    expect(getBreadcrumpLabels()).toEqual([
      "Home",
      "folder1 title",
      "subfolder1.1 title",
    ]);
  });
});

const getBreadcrumpLabels = (): string[] =>
  screen.getAllByTestId("breadcrump-section-text").map((i) => i.innerHTML);
