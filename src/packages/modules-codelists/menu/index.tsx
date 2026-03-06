import { useLocation } from "react-router-dom";

import { MainMenu } from "@components/menu";

import { UIMenuItem } from "@model/Menu";

import D from "../i18n/build-dictionary";

const defaultAttrs = { "aria-current": "page" };

const MenuCodelists = () => {
  const location = useLocation();

  const activePath = location.pathname;
  if (activePath === "/") return null;

  const paths: UIMenuItem[] = [
    {
      path: "/codelists",
      pathKey: "codelists",
      className: null,
      attrs: null,
      label: D.codelistsTitle,
      order: 1,
    },
  ];

  const currentPath = paths.find((path) => {
    return location.pathname.includes(path.pathKey);
  });
  if (currentPath) {
    currentPath.className = "active";
    currentPath.attrs = defaultAttrs;
  }

  return <MainMenu paths={paths} />;
};

export default MenuCodelists;
