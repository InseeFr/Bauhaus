import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { MainMenu } from "@components/menu";

import { UIMenuItem } from "@model/Menu";

import { useAuthorizationGuard } from "../../auth/components/auth";

const defaultAttrs = { "aria-current": "page" };

export const Menu = () => {
  const { t } = useTranslation();

  const canAccessAdministration = useAuthorizationGuard({
    module: "CODESLIST_CODESLIST",
    privilege: "READ",
  });

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

  if (canAccessAdministration) {
    paths.unshift({
      path: "/codelists/partial",
      pathKey: "partial",
      className: null,
      attrs: null,
      label: t("partial-codelists.pluralTitle"),
      order: 2,
    });
  }

  const currentPath = paths.find((path) => {
    if (path.pathKey instanceof RegExp) {
      return path.pathKey.test(location.pathname);
    }
    return location.pathname.includes(path.pathKey);
  });

  if (currentPath) {
    currentPath.className = "active";
    currentPath.attrs = defaultAttrs;
  }

  return <MainMenu paths={paths} />;
};
