import React from "react";
import Gallery from "./index";
import { render, screen } from "@testing-library/react";
import { createMediaExplorerStore } from "../state";
import { Provider } from "react-redux";
import {ids} from "./pageObject";

//GAllery Page object candidate
const setWindowWidth = (width: number) =>
  Object.defineProperty(window.HTMLElement.prototype, "scrollWidth", {
    writable: true,
    configurable: true,
    value: width,
  });

const expectGalleryHasColumnsCount = (numberOfCols: number) => {
  expect(screen.getByTestId(ids.card("playground1"))).toHaveStyle("width: 20px");
};
const renderGallery = () => {
  render(
    <Provider store={createMediaExplorerStore()}>
      <Gallery isSidebarVisible  />
    </Provider>
  );
};

xit("min two columns test", function () {
  setWindowWidth(20 + 240 + 20 + 240 + 20);
  renderGallery();

  expectGalleryHasColumnsCount(2);
});

xit("three columns test", function () {
  setWindowWidth(20 + 240 + 20 + 240 + 20 + 240 + 20);
  renderGallery();
  expectGalleryHasColumnsCount(3);
});

xit("two columns test", function () {
  setWindowWidth(20 + 240 - 1 + 20 + 240 + 20 + 240 + 20);
  renderGallery();
  expectGalleryHasColumnsCount(2);
});

it("when rendering a gallery with a default state first node is playground (first node of a home focus folder)", function () {
  renderGallery();
  const playgroundCard = screen.getByTestId("card-playground1");

  expect(playgroundCard).toBeInTheDocument();
});
