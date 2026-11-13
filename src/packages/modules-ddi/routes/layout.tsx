import { I18nextProvider } from "react-i18next";
import { Outlet } from "react-router";

import { useTheme } from "@utils/hooks/useTheme";

import { DataDescriptionMenu } from "../../application/section-menus";
import { ddiI18n } from "../i18n";
import "./layout.css";

export const Component = () => {
  useTheme("ddi");

  return (
    <I18nextProvider i18n={ddiI18n}>
      <DataDescriptionMenu />
      <div className="ddi-layout">
        <Outlet />
      </div>
    </I18nextProvider>
  );
};
