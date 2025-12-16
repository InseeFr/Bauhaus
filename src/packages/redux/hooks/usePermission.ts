import { useSelector } from "react-redux";

import { getPermission } from "../selectors";

export const usePermission = () => {
  return useSelector(getPermission);
};
