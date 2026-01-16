import { Outlet } from "react-router-dom";
import { I18nextProvider } from "react-i18next";

import { useTheme } from "../../utils/hooks/useTheme";
import Menu from "../menu/index";
import i18n from "../i18n/index";

export const Component = () => {
  useTheme("concepts");
  return (
    <I18nextProvider i18n={i18n}>
      <Menu />
      <Outlet />
    </I18nextProvider>
  );
};
