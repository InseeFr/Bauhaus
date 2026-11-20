import { I18nextProvider } from "react-i18next";

import { useTheme } from "@utils/hooks/useTheme";

import { ModuleOutlet } from "../../application/router/module-pages";
import { DataDescriptionMenu } from "../../application/section-menus";
import { ddiI18n } from "../i18n";
import "./layout.css";

export const Component = () => {
  useTheme("ddi");

  return (
    <I18nextProvider i18n={ddiI18n}>
      <DataDescriptionMenu />
      <div className="ddi-layout">
        <ModuleOutlet />
      </div>
    </I18nextProvider>
  );
};
