import { useMemo } from "react";
import { useLocation } from "react-router-dom";

import { MainMenu } from "@components/menu";

import { UIMenuItem } from "@model/Menu";
import D from "../../deprecated-locales";
const ACTIVE = "active";
const defaultAttrs = { "aria-current": "page" };

type RouterConfig = Record<string, UIMenuItem>;

const menuItems: RouterConfig = {
  physicalInstances: {
    path: "/ddi/physical-instances",
    pathKey: /ddi\/physical-instances/,
    className: null,
    attrs: null,
    order: 2,
    label: D.physicalInstanceTitle,
  },
} as const;

export const Menu = () => {
  const location = useLocation();
  const pathname = location.pathname;

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
  }, [pathname]);

  return <MainMenu paths={Object.values(paths)} />;
};
