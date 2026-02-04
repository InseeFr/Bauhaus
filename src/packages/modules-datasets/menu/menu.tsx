import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { MainMenu } from "@components/menu";

import { UIMenuItem } from "@model/Menu";

const defaultAttrs = { "aria-current": "page" };

export const Menu = () => {
  const { t } = useTranslation();

  const location = useLocation();
  const activePath = location.pathname;
  if (activePath === "/") return null;

  const paths: UIMenuItem[] = [
    {
      path: "/datasets",
      pathKey: "datasets",
      className: null,
      attrs: null,
      label: t("dataset.pluralTitle"),
      order: 1,
    },
    {
      path: "/datasets/distributions",
      pathKey: "distributions",
      className: null,
      attrs: null,
      label: t("distribution.pluralTitle"),
      order: 2,
    },
  ];

  const currentPath = [...paths]
    .sort((a, b) => b.path.length - a.path.length) // sort the most specific first so it will be found before
    .find((path) => {
      return location.pathname.startsWith(path.path);
    });

  if (currentPath) {
    currentPath.className = "active";
    currentPath.attrs = defaultAttrs;
  }

  return <MainMenu paths={paths} />;
};
