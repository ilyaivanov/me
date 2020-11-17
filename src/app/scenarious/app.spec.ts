import { fireEvent, getByTestId, screen } from "@testing-library/react";
import renderTestApp, { prepareLoadedTestApp } from "./renderTestApp";
import { NodesContainer } from "../state";

const testData: NodesContainer = {
  HOME: {
    id: "HOME",
    itemType: "folder",
    title: "Home",
    children: ["playground1"],
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
};

it("by default sidebar is open", async () => {
  await prepareLoadedTestApp(testData);
  expect(screen.getByTestId("sidebar")).not.toHaveClass("closed");
});

it("when user clicks toggle sidebar it is closed", async function () {
  await prepareLoadedTestApp(testData);
  fireEvent.click(screen.getByTestId("toggle-sidebar"));
  expect(screen.getByTestId("sidebar")).toHaveClass("closed");
});

it("should have a playground1 in the sidebar", async function () {
  await prepareLoadedTestApp(testData);
  renderTestApp();
  expect(screen.getByTestId("sidebar-row-playground1")).toBeInTheDocument();
});

it("playground1 should not have an open arrow since its children are only videos", async function () {
  await prepareLoadedTestApp(testData);
  const row = screen.getByTestId("sidebar-row-playground1");
  expect(getByTestId(row, "row-arrow-playground1")).toHaveClass("hidden");
});

describe("having a sidebar when pressing on a Playground folder", () => {
  it("Playground is set to focus", async () => {
    await prepareLoadedTestApp(testData);
    expect(screen.getByTestId("sidebar-row-playground1")).not.toHaveClass(
      "focused"
    );
    fireEvent.click(screen.getByTestId("sidebar-row-playground1"));
    expect(screen.getByTestId("sidebar-row-playground1")).toHaveClass(
      "focused"
    );
  });
  it("nodes of that folder are shown in a body", async () => {
    await prepareLoadedTestApp(testData);
    fireEvent.click(screen.getByTestId("sidebar-row-playground1"));
    expect(screen.getByTestId("card-playground11")).toBeInTheDocument();
    expect(screen.getByTestId("card-playground12")).toBeInTheDocument();
  });

  it("pressing home should set focus back to home with Playground1 card", async () => {
    await prepareLoadedTestApp(testData);
    fireEvent.click(screen.getByTestId("sidebar-row-playground1"));
    fireEvent.click(screen.getByTestId("sidebar-row-HOME"));
    expect(screen.getByTestId("card-playground1")).toBeInTheDocument();
  });
});
