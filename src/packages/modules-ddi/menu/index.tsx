import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { MainMenu } from "@components/menu";

import { UIMenuItem } from "@model/Menu";
const ACTIVE = "active";
const defaultAttrs = { "aria-current": "page" };

type RouterConfig = Record<string, UIMenuItem>;

export const Menu = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const pathname = location.pathname;

  const menuItems: RouterConfig = {
    physicalInstances: {
      path: "/ddi/physical-instances",
      pathKey: /ddi\/physical-instances/,
      className: null,
      attrs: null,
      order: 2,
      label: t("physicalInstance.pluralTitle"),
    },
  };

  const paths: RouterConfig = useMemo(() => {
    const paths = Object.keys(menuItems).reduce((acc: RouterConfig, key) => {
      return {
        ...acc,
        [key]: {
          ...menuItems[key],
          className: "",
          attrs: {},
        },
      };
    }, {});

    for (const key in paths) {
      if ((paths[key]["pathKey"] as RegExp).test(pathname)) {
        paths[key]["className"] = ACTIVE;
        paths[key]["attrs"] = defaultAttrs;
        break;
      }
    }

    return paths;
  }, [pathname, menuItems]);

  return <MainMenu paths={Object.values(paths)} />;
};
