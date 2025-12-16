import { Outlet } from "react-router-dom";

import { useTheme } from "../../utils/hooks/useTheme";
import DatasetsMenu from "./menu";

export const Component = () => {
  useTheme("datasets");
  return (
    <>
      <DatasetsMenu />
      <Outlet />
    </>
  );
};
