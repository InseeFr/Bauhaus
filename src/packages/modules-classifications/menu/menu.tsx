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
      path: "/classifications/families",
      pathKey: "classifications/famil",
      className: null,
      attrs: null,
      label: t("family.pluralTitle"),
      order: 0,
    },
    {
      path: "/classifications/series",
      pathKey: "classifications/series",
      className: null,
      attrs: null,
      label: t("serie.pluralTitle"),
      order: 1,
    },
    {
      path: "/classifications/correspondences",
      pathKey: "classifications/correspondence",
      className: null,
      attrs: null,
      label: t("correspondence.pluralTitle"),
      order: 3,
    },
    {
      path: "/classifications",
      pathKey: "classification",
      className: null,
      attrs: null,
      label: t("classification.pluralTitle"),
      order: 2,
    },
  ];

  const currentPath = paths.find((path) => {
    return location.pathname.includes(path.pathKey as string);
  });

  if (currentPath) {
    currentPath.className = "active";
    currentPath.attrs = defaultAttrs;
  }

  return <MainMenu paths={paths} />;
};
