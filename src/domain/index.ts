import * as storeModule from "./store";
import * as operations from "./operations";
import * as selectorsImported from "./selectors";

export const actions = {
  ...storeModule.actions,
  ...operations,
};

export const store = storeModule.store;

export const selectors = selectorsImported;
