import { useLocation } from "react-router-dom";

import { MainMenu } from "@components/menu";

import { UIMenuItem } from "@model/Menu";

import D from "../../deprecated-locales/build-dictionary";

const defaultAttrs = { "aria-current": "page" };

export const Menu = () => {
  const location = useLocation();
  const activePath = location.pathname;
  if (activePath === "/") return null;

  const paths: UIMenuItem[] = [
    {
      path: "/datasets",
      pathKey: "datasets",
      className: null,
      attrs: null,
      label: D.datasetsTitle,
      order: 1,
    },
    {
      path: "/datasets/distributions",
      pathKey: "distributions",
      className: null,
      attrs: null,
      label: D.distributionsTitle,
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
