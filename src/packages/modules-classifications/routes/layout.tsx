import { I18nextProvider } from "react-i18next";

import { useTheme } from "@utils/hooks/useTheme";

import { ModuleOutlet } from "../../application/router/module-pages";
import { classificationsI18n } from "../i18n";
import { Menu } from "../menu/menu";

export const Component = () => {
  useTheme("classifications");

  return (
    <I18nextProvider i18n={classificationsI18n}>
      <Menu />
      <ModuleOutlet />
    </I18nextProvider>
  );
};
