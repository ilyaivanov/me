import React from "react";
import Gallery from "./index";
import { render, screen } from "@testing-library/react";
import { createMediaExplorerStore } from "../state";
import { Provider } from "react-redux";

//GAllery Page object candidate
const setWindowWidth = (width: number) =>
  Object.defineProperty(window.HTMLElement.prototype, "scrollWidth", {
    writable: true,
    configurable: true,
    value: width,
  });

const expectGalleryHasColumnsCount = (numberOfCols: number) =>
  expect(screen.queryAllByTestId(/gallery-column-\d+/).length).toBe(
    numberOfCols
  );

const renderGallery = () => {
  render(
    <Provider store={createMediaExplorerStore()}>
      <Gallery isSidebarVisible />
    </Provider>
  );
};

it("min two columns test", function () {
  setWindowWidth(20 + 240 + 20 + 240 + 20);
  renderGallery();

  expectGalleryHasColumnsCount(2);
});

it("three columns test", function () {
  setWindowWidth(20 + 240 + 20 + 240 + 20 + 240 + 20);
  renderGallery();
  expectGalleryHasColumnsCount(3);
});

it("two columns test", function () {
  setWindowWidth(20 + 240 - 1 + 20 + 240 + 20 + 240 + 20);
  renderGallery();
  expectGalleryHasColumnsCount(2);
});

it("when rendering a gallery with a default state first node is playground (first node of a home focus folder)", function () {
  renderGallery();
  const playgroundCard = screen.getByTestId("card-playground1");

  expect(playgroundCard).toBeInTheDocument();
});

