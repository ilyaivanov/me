import React from "react";
import { render, screen, getByTestId, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import App from "../App";
import { createMediaExplorerStore } from "../state";

const renderApp = () => {
  const store = createMediaExplorerStore();
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
};

it("by default sidebar is open", () => {
  renderApp();
  expect(screen.getByTestId("sidebar")).not.toHaveClass("closed");
});

it("when user clicks toggle sidebar it is closed", function () {
  renderApp();
  fireEvent.click(screen.getByTestId("toggle-sidebar"));
  expect(screen.getByTestId("sidebar")).toHaveClass("closed");
});

it("should have a playground1 in the sidebar", function () {
  renderApp();
  expect(screen.getByTestId("sidebar-row-playground1")).toBeInTheDocument();
});

it("playground1 should not have an open arrow since its children are only videos", function () {
  renderApp();
  const row = screen.getByTestId("sidebar-row-playground1");
  expect(getByTestId(row, "row-arrow")).toHaveClass("hidden");
});
