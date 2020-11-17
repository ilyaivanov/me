import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import { createMediaExplorerStore, NodesContainer } from "../state";
import App from "../App";
import firebaseApi from "../api/firebase";
import header from "../header/pageObject";

const renderTestApp = () => {
  const store = createMediaExplorerStore();
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  return store;
};

export const prepareLoadedTestApp = async (items: NodesContainer) => {
  (firebaseApi.load as jest.Mock).mockResolvedValue(items);
  const store = renderTestApp();
  await header.waitForPageRender();
  return store;
};

export default renderTestApp;
