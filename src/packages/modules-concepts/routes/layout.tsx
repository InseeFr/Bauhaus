import { Outlet } from "react-router-dom";
import { I18nextProvider } from "react-i18next";

import { useTheme } from "../../utils/hooks/useTheme";
import { Menu } from "../menu/menu";
import { conceptsI18n } from "../i18n/index";

export const Component = () => {
  useTheme("concepts");

  return (
    <I18nextProvider i18n={conceptsI18n}>
      <Menu />
      <Outlet />
    </I18nextProvider>
  );
};
