import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { MainMenu } from "@components/menu";

import { UIMenuItem } from "@model/Menu";

import { useAuthorizationGuard } from "../../auth/components/auth";

const defaultAttrs = { "aria-current": "page" };

export const Menu = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const activePath = location.pathname;
  if (activePath === "/") return null;

  const canAccessAdministration = useAuthorizationGuard({
    module: "CONCEPT_CONCEPT",
    privilege: "ADMINISTRATION",
  });

  let paths: UIMenuItem[] = [
    {
      path: import.meta.env.VITE_CONCEPTS_DOCUMENTATION,
      pathKey: "help",
      className: null,
      order: 4,
      attrs: {
        target: "_blank",
      },
      label: t("common.help"),
      alignToRight: true,
    },
    {
      path: "/concepts/collections",
      pathKey: "collection",
      className: null,
      attrs: null,
      order: 2,
      label: t("collection.title"),
    },
    {
      path: "/concepts",
      pathKey: "concept",
      className: null,
      order: 1,
      label: t("concept.title"),
    },
  ];

  if (canAccessAdministration) {
    paths = [
      {
        path: "/concepts/administration",
        pathKey: "administration",
        className: null,
        attrs: null,
        label: t("common.administrationTitle"),
        order: 3,
        alignToRight: true,
      },
      ...paths,
    ];
  }
  const currentPath = paths.find((path) => {
    return location.pathname.includes(path.pathKey);
  });
  if (currentPath) {
    currentPath.className = "active";
    currentPath.attrs = defaultAttrs;
  }

  return <MainMenu paths={paths} />;
};
