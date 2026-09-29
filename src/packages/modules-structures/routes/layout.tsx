import { I18nextProvider } from "react-i18next";
import { Outlet } from "react-router-dom";

import { useTheme } from "@utils/hooks/useTheme";

import { AdministrationMenu } from "../../application/section-menus";
import { structuresI18n } from "../i18n";

export const Component = () => {
  useTheme("structures");

  return (
    <I18nextProvider i18n={structuresI18n}>
      <AdministrationMenu />
      <div className="container">
        <Outlet />
      </div>
    </I18nextProvider>
  );
};
