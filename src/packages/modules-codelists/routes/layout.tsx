import { I18nextProvider } from "react-i18next";
import { Outlet } from "react-router";

import { useTheme } from "@utils/hooks/useTheme";

import { AdministrationMenu } from "../../application/section-menus";
import { codelistsI18n } from "../i18n";

export const Component = () => {
  useTheme("codelists");

  return (
    <I18nextProvider i18n={codelistsI18n}>
      <AdministrationMenu />
      <div className="container">
        <Outlet />
      </div>
    </I18nextProvider>
  );
};
