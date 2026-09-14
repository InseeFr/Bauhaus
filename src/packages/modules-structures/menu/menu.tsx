import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { MainMenu } from "@components/menu";

import { UIMenuItem } from "@model/Menu";

const defaultAttrs = { "aria-current": "page" };

export const Menu = () => {
  const { t } = useTranslation();

  const location = useLocation();
  if (location.pathname === "/") return null;

  const paths: UIMenuItem[] = [
    {
      path: "/structures",
      pathKey: "structures",
      className: null,
      attrs: null,
      order: 1,
      label: t("structure.pluralTitle"),
    },
    {
      path: "/structures/components",
      pathKey: "structures/components",
      className: null,
      attrs: null,
      order: 2,
      label: t("component.pluralTitle"),
    },
  ];

  const currentPath = [...paths]
    .sort((a, b) => b.path.length - a.path.length)
    .find(({ path }) => location.pathname === path || location.pathname.startsWith(path + "/"));

  if (currentPath) {
    currentPath.className = "active";
    currentPath.attrs = defaultAttrs;
  }

  return <MainMenu paths={paths} />;
};
