import { Outlet } from "react-router-dom";

import { useTheme } from "../../utils/hooks/useTheme";
import Menu from "../pages/classifications/home/menu";

export const Component = () => {
  useTheme("classifications");
  return (
    <>
      <Menu />
      <Outlet />
    </>
  );
};
