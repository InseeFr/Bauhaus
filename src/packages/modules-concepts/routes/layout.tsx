import { I18nextProvider } from "react-i18next";
import { Outlet } from "react-router-dom";

import { useTheme } from "@utils/hooks/useTheme";

import { conceptsI18n } from "../i18n/index";
import { Menu } from "../menu/menu";

export const Component = () => {
  useTheme("concepts");

  return (
    <I18nextProvider i18n={conceptsI18n}>
      <Menu />
      <Outlet />
    </I18nextProvider>
  );
};
