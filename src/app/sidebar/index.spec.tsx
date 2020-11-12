import { createMediaExplorerStore } from "../state";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import React from "react";
import Sidebar from "./index";

jest.mock("../utils/createId", () => ({
  createId: () => "MyID",
}));

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
    renderSidebar();
    expect(sidebarPageObject.querySidebarRow("MyID")).not.toBeInTheDocument();
    sidebarPageObject.clickAddFolder();
    expect(sidebarPageObject.querySidebarRow("MyID")).toBeInTheDocument();
  });

  it("Removing Playground folder", () => {
    renderSidebar();
    expect(
      sidebarPageObject.querySidebarRow("playground1")
    ).toBeInTheDocument();
    sidebarPageObject.clickRemoveFolder("playground1");
    sidebarPageObject.clickAddFolder();
    expect(
      sidebarPageObject.querySidebarRow("playground1")
    ).not.toBeInTheDocument();
  });

  it("Renaming Playground folder", () => {
    renderSidebar();
    expect(
      sidebarPageObject.querySidebarRow("playground1")
    ).toBeInTheDocument();
    sidebarPageObject.clickRenameFolder("playground1");
    sidebarPageObject.enterTextIntoFolderInputField("playground1", "New Name");

    sidebarPageObject.loseFocusOnInput("playground1");
    expect(sidebarPageObject.getFolderTitle("playground1")).toBe("New Name");
  });
});

// prettier-ignore
const sidebarPageObject = {
  querySidebarRow: (id: string) =>
    screen.queryByTestId(`sidebar-row-${id}`),

  clickAddFolder: () =>
    fireEvent.click(screen.getByTestId("folder-add")),

  clickRemoveFolder: (folderId: string) =>
    fireEvent.click(screen.getByTestId(`folder-remove-${folderId}`)),

  clickRenameFolder: (folderId: string) =>
    fireEvent.click(screen.getByTestId(`folder-rename-${folderId}`)),

  enterTextIntoFolderInputField: (folderId: string, nextText: string) =>
    fireEvent.change(screen.getByTestId(`folder-input-${folderId}`), { target: { value: nextText } }),

  loseFocusOnInput: (folderId: string) =>
    fireEvent.blur(screen.getByTestId(`folder-input-${folderId}`)),

  getFolderTitle: (folderId: string) =>
    screen.queryByTestId(`folder-title-${folderId}`)?.innerHTML
};

//TODO: rename, remove
