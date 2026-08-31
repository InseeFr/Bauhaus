import { Outlet } from "react-router-dom";
import { I18nextProvider } from "react-i18next";

import { useTheme } from "@utils/hooks/useTheme";
import { Menu } from "../menu/menu";
import { datasetsI18n } from "../i18n";

export const Component = () => {
  useTheme("datasets");

  return (
    <I18nextProvider i18n={datasetsI18n}>
      <Menu />
      <Outlet />
    </I18nextProvider>
  );
};
