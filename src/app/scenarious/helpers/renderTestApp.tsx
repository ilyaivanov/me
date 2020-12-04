import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import App from "../../App";
import firebaseApi from "../../api/firebase";
import { header } from "./testApp";
import { store, actions } from "../../state/store";
import { NodesContainer } from "../../state/store";

const renderTestApp = () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  return store;
};

export const prepareLoadedTestApp = async (items: NodesContainer) => {
  actions.reset();
  (firebaseApi.load as jest.Mock).mockResolvedValue(items);
  const store = renderTestApp();
  await header.waitForPageRender();
  return store;
};

export default renderTestApp;
