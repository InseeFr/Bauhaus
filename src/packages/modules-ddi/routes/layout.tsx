import { I18nextProvider } from "react-i18next";
import { Outlet } from "react-router-dom";

import { useTheme } from "@utils/hooks/useTheme";

import { ddiI18n } from "../i18n";
import { Menu } from "../menu";

export const Component = () => {
  useTheme("ddi");

  return (
    <I18nextProvider i18n={ddiI18n}>
      <Menu />
      <div className="container">
        <Outlet />
      </div>
    </I18nextProvider>
  );
};
