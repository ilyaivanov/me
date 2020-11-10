import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import { createMediaExplorerStore } from "./state";
import { Provider } from "react-redux";

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
