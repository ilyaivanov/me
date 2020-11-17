import { createMediaExplorerStore } from "../state";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import React from "react";
import Sidebar from "./index";
import sidebar from "./pageObject";
import { createId } from "../utils";

const renderSidebar = () => {
  const store = createMediaExplorerStore();
  render(
    <Provider store={store}>
      <Sidebar />
    </Provider>
  );
};

describe("Having a single folder in a sidebar", () => {
  it("when adding a new folder it appears at the end of the root", () => {
    (createId as jest.Mock).mockReturnValue("MyID");
    renderSidebar();
    expect(sidebar.querySidebarRow("MyID")).not.toBeInTheDocument();
    sidebar.clickAddFolder();
    expect(sidebar.querySidebarRow("MyID")).toBeInTheDocument();
  });

  it("Removing Playground folder", () => {
    renderSidebar();
    expect(sidebar.querySidebarRow("playground1")).toBeInTheDocument();
    sidebar.clickRemoveFolder("playground1");
    expect(sidebar.querySidebarRow("playground1")).not.toBeInTheDocument();
  });

  it("Renaming Playground folder", () => {
    renderSidebar();
    expect(sidebar.querySidebarRow("playground1")).toBeInTheDocument();
    sidebar.clickRenameFolder("playground1");
    sidebar.enterTextIntoFolderInputField("playground1", "New Name");

    sidebar.loseFocusOnInput("playground1");
    expect(sidebar.getFolderTitle("playground1")).toBe("New Name");
  });

  it("when nested node is opened its children are visible", function () {
    renderSidebar();
    expect(sidebar.querySidebarRow("nested1")).not.toBeInTheDocument();
    sidebar.clickRowArrow("nestedRoot");
    expect(sidebar.querySidebarArrow("nestedRoot")).toHaveClass(
      "row-arrow-open"
    );
    expect(sidebar.querySidebarRow("nested1")).toBeInTheDocument();
  });
});
