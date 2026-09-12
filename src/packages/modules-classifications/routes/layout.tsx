import { I18nextProvider } from "react-i18next";
import { Outlet } from "react-router-dom";

import { useTheme } from "@utils/hooks/useTheme";

import { classificationsI18n } from "../i18n";
import { Menu } from "../menu/menu";

export const Component = () => {
  useTheme("classifications");

  return (
    <I18nextProvider i18n={classificationsI18n}>
      <Menu />
      <Outlet />
    </I18nextProvider>
  );
};
