import { I18nextProvider } from "react-i18next";

import { useTheme } from "@utils/hooks/useTheme";

import { ModuleOutlet } from "../../application/router/module-pages";
import { conceptsI18n } from "../i18n/index";
import { Menu } from "../menu/menu";

export const Component = () => {
  useTheme("concepts");

  return (
    <I18nextProvider i18n={conceptsI18n}>
      <Menu />
      <ModuleOutlet />
    </I18nextProvider>
  );
};
