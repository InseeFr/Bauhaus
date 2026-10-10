import { I18nextProvider } from "react-i18next";
import { Outlet } from "react-router";

import { useTheme } from "@utils/hooks/useTheme";

import { DataDescriptionMenu } from "../../application/section-menus";
import { ddiI18n } from "../i18n";

export const Component = () => {
  useTheme("ddi");

  return (
    <I18nextProvider i18n={ddiI18n}>
      <DataDescriptionMenu />
      <div className="container">
        <Outlet />
      </div>
    </I18nextProvider>
  );
};
