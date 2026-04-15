import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { MainMenu } from "@components/menu";

import { UIMenuItem } from "@model/Menu";

const defaultAttrs = { "aria-current": "page" };

export const Menu = () => {
  const { t } = useTranslation();

  const location = useLocation();
  if (location.pathname === "/") return null;

  const paths: UIMenuItem[] = [
    {
      path: "/codelists",
      pathKey: "codelists",
      className: null,
      attrs: null,
      label: t("codelists.pluralTitle"),
      order: 1,
    },
  ];

  const currentPath = paths.find(
    ({ path }) => location.pathname === path || location.pathname.startsWith(path + "/"),
  );

  if (currentPath) {
    currentPath.className = "active";
    currentPath.attrs = defaultAttrs;
  }

  return <MainMenu paths={paths} />;
};
