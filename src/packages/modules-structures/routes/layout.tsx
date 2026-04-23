import { Outlet } from "react-router-dom";

import { useTheme } from "../../utils/hooks/useTheme";
import { Menu } from "../menu/menu";

export const Component = () => {
  useTheme("structures");

  return (
    <>
      <Menu />
      <div className="container">
        <Outlet />
      </div>
    </>
  );
};
