import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import { createMediaExplorerStore } from "../state";
import App from "../App";

const renderTestApp = () => {
  const store = createMediaExplorerStore();
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default renderTestApp;
