import { I18nextProvider } from "react-i18next";
import { Outlet } from "react-router-dom";

import { useTheme } from "@utils/hooks/useTheme";

import { DataDescriptionMenu } from "../../application/section-menus";
import { datasetsI18n } from "../i18n";

export const Component = () => {
  useTheme("datasets");

  return (
    <I18nextProvider i18n={datasetsI18n}>
      <DataDescriptionMenu />
      <Outlet />
    </I18nextProvider>
  );
};
