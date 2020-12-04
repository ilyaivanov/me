import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import React from "react";
import Sidebar from "../sidebar/index";
import { header, sidebar, gallery } from "./helpers/testApp";
import { createId } from "../utils";
import { prepareLoadedTestApp } from "./helpers/renderTestApp";
import { createItemsBasedOnStructure } from "./helpers/itemsBuilder";
import { actions, store } from "../state/store";

const renderSidebar = () => {
  render(
    <Provider store={store}>
      <Sidebar />
    </Provider>
  );
};
const testData = createItemsBasedOnStructure(`
    playground1
      video playground11
      video playground12
    nestedRoot
      nested1
`);

describe("having a sidebar when pressing on a Playground folder", () => {
  beforeEach(() => {
    actions.reset();
  });

  it("Playground is set to focus", async () => {
    await prepareLoadedTestApp(testData);
    expect(sidebar.getRow("playground1")).not.toHaveClass("focused");
    sidebar.focusOnItem("playground1");
    expect(sidebar.getRow("playground1")).toHaveClass("focused");
  });
  it("nodes of that folder are shown in a body", async () => {
    await prepareLoadedTestApp(testData);
    sidebar.focusOnItem("playground1");
    expect(gallery.queryCard("video playground11")).toBeInTheDocument();
    expect(gallery.queryCard("video playground12")).toBeInTheDocument();
  });

  it("pressing home should set focus back to home with Playground1 card", async () => {
    await prepareLoadedTestApp(testData);
    sidebar.focusOnItem("playground1");
    sidebar.focusOnItem("HOME");
    expect(gallery.queryCard("playground1")).toBeInTheDocument();
  });
});

describe("Having a single folder in a sidebar", () => {
  it("by default sidebar is open", async () => {
    await prepareLoadedTestApp(testData);
    expect(sidebar.getContainer()).not.toHaveClass("closed");
  });

  it("when user clicks toggle sidebar it is closed", async function () {
    await prepareLoadedTestApp(testData);
    header.toggleSidebar();
    expect(sidebar.getContainer()).toHaveClass("closed");
  });

  it("should have a playground1 in the sidebar", async function () {
    await prepareLoadedTestApp(testData);
    expect(sidebar.getRow("playground1")).toBeInTheDocument();
  });

  it("playground1 should not have an open arrow since its children are only videos", async function () {
    await prepareLoadedTestApp(testData);
    expect(sidebar.getRowArrow("playground1")).toHaveClass("hidden");
  });

  it("when adding a new folder it appears at the end of the root", () => {
    (createId as jest.Mock).mockReturnValue("MyID");
    renderSidebar();
    expect(sidebar.querySidebarRow("MyID")).not.toBeInTheDocument();
    sidebar.clickAddFolder();
    expect(sidebar.querySidebarRow("MyID")).toBeInTheDocument();
  });

  it("Removing Playground folder", async () => {
    await prepareLoadedTestApp(testData);
    expect(sidebar.querySidebarRow("playground1")).toBeInTheDocument();
    sidebar.clickRemoveFolder("playground1");
    expect(sidebar.querySidebarRow("playground1")).not.toBeInTheDocument();
  });

  it("Renaming Playground folder", async () => {
    await prepareLoadedTestApp(testData);
    expect(sidebar.querySidebarRow("playground1")).toBeInTheDocument();
    sidebar.clickRenameFolder("playground1");
    sidebar.enterTextIntoFolderInputField("playground1", "New Name");

    sidebar.loseFocusOnInput("playground1");
    expect(sidebar.getFolderTitle("playground1")).toBe("New Name");
  });

  it("when nested node is opened its children are visible", async () => {
    await prepareLoadedTestApp(testData);
    expect(sidebar.querySidebarRow("nested1")).not.toBeInTheDocument();
    sidebar.clickRowArrow("nestedRoot");
    expect(sidebar.querySidebarArrow("nestedRoot")).toHaveClass(
      "row-arrow-open"
    );
    expect(sidebar.querySidebarRow("nested1")).toBeInTheDocument();
  });
});
