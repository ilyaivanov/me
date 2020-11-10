import React from "react";
import Gallery from "./index";
import { render, screen } from "@testing-library/react";

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

it("min two columns test", function () {
  setWindowWidth(20 + 240 + 20 + 240 + 20);
  render(
    <div style={{ width: 1500 }}>
      <Gallery isSidebarVisible />
    </div>
  );

  expectGalleryHasColumnsCount(2);
});

it("three columns test", function () {
  setWindowWidth(20 + 240 + 20 + 240 + 20 + 240 + 20);
  render(<Gallery isSidebarVisible />);

  expectGalleryHasColumnsCount(3);
});

it("two columns test", function () {
  setWindowWidth(20 + 240 - 1 + 20 + 240 + 20 + 240 + 20);
  render(<Gallery isSidebarVisible />);

  expectGalleryHasColumnsCount(2);
});

