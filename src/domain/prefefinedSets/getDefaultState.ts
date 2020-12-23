import { rootNodes } from "../store";
import { items } from "./vadym";

export const getDefaultStateForUser = (email: string) => {
  if (email === "gradarg@gmail.com")
    return {
      ...rootNodes,
      ...items,
    };
  return {
    ...rootNodes,
  };
};
