import { Outlet } from "react-router-dom";

import { useTheme } from "../../utils/hooks/useTheme";
import { Menu } from "../menu/menu";

export const Component = () => {
  useTheme("classifications");

  return (
    <>
      <Menu />
      <Outlet />
    </>
  );
};
