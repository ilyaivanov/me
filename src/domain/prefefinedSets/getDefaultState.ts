import { rootNodes } from "../store";
import { items } from "./vadym";

export const getDefaultStateForUser = (email: string): NodesContainer => {
  if (email === "gradarg@gmail.com" || email === "katerynabertash1@gmail.com")
    return {
      ...rootNodes,
      ...items,
    };
  return {
    ...rootNodes,
  };
};
