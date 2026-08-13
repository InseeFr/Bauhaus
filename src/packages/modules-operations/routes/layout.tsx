import { Outlet, useNavigation } from "react-router-dom";
import { I18nextProvider } from "react-i18next";

import { Loading } from "@components/loading";
import { useTheme } from "@utils/hooks/useTheme";

import { MenuOperations as Menu } from "../menu/menu";
import i18n from "../i18n";

export const Component = () => {
  useTheme("operations");

  const navigation = useNavigation();

  return (
    <I18nextProvider i18n={i18n}>
      <Menu />
      {navigation.state === "loading" ? <Loading /> : <Outlet />}
    </I18nextProvider>
  );
};
