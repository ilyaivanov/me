import { Reducer } from "redux";

export const createActionCreators = <T>(actionDefinitions: T): T =>
  Object.keys(actionDefinitions).reduce((acc, actionType) => {
    return {
      ...acc,
      [actionType]: (payload: any, extraPayload: any) => ({
        type: actionType,
        payload,
        extraPayload,
      }),
    };
  }, {}) as T;

export const createReducer = <T>(
  initialState: T,
  actionDefinitions: any
): Reducer<T, any> => (state: T | undefined, action: any): T => {
  if (!state) return { ...initialState };
  else {
    const actionDefinition = actionDefinitions[action.type];
    if (!actionDefinition) return state;
    const actionHandlerResult = actionDefinition(
      action.payload,
      action.extraPayload
    );
    const assignedVal =
      typeof actionHandlerResult === "function"
        ? actionHandlerResult(state)
        : actionHandlerResult;

    return Object.assign({}, state, assignedVal);
  }
};
