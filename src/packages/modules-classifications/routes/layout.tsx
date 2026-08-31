import { Outlet } from "react-router-dom";
import { I18nextProvider } from "react-i18next";

import { useTheme } from "../../utils/hooks/useTheme";
import { Menu } from "../menu/menu";
import { classificationsI18n } from "../i18n";

export const Component = () => {
  useTheme("classifications");

  return (
    <I18nextProvider i18n={classificationsI18n}>
      <Menu />
      <Outlet />
    </I18nextProvider>
  );
};
