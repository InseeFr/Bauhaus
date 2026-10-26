import { I18nextProvider } from "react-i18next";
import { useNavigation } from "react-router";

import { Loading } from "@components/loading";

import { useTheme } from "@utils/hooks/useTheme";

import { ModuleOutlet } from "../../application/router/module-pages";
import { operationsI18n } from "../i18n";
import { Menu } from "../menu/menu";

export const Component = () => {
  useTheme("operations");

  const navigation = useNavigation();

  return (
    <I18nextProvider i18n={operationsI18n}>
      <Menu />
      {navigation.state === "loading" ? <Loading /> : <ModuleOutlet />}
    </I18nextProvider>
  );
};
