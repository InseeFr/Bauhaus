import { Outlet } from "react-router-dom";
import { I18nextProvider } from "react-i18next";

import { useTheme } from "@utils/hooks/useTheme";
import { Menu } from "../menu/menu";
import codelistsI18n from "../i18n";

export const Component = () => {
  useTheme("codelists");

  return (
    <I18nextProvider i18n={codelistsI18n}>
      <Menu />
      <div className="container">
        <Outlet />
      </div>
    </I18nextProvider>
  );
};
