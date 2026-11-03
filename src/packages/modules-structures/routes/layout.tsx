import { I18nextProvider } from "react-i18next";

import { useTheme } from "@utils/hooks/useTheme";

import { ModuleOutlet } from "../../application/router/module-pages";
import { AdministrationMenu } from "../../application/section-menus";
import { structuresI18n } from "../i18n";

export const Component = () => {
  useTheme("structures");

  return (
    <I18nextProvider i18n={structuresI18n}>
      <AdministrationMenu />
      <div className="container">
        <ModuleOutlet />
      </div>
    </I18nextProvider>
  );
};
