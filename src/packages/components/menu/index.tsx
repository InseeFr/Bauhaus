import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { componentsI18n } from "../i18n";
import "./index.css";

const WITH_SEPARATOR_CLASS = "with-separator";

interface Path {
  path: string;
  className: string;
  attrs: Record<string, string>;
  image?: string;
  label: string;
  /** Entrée annoncée mais pas encore disponible : affichée grisée, sans lien. */
  disabled?: boolean;
}

function getClasses(path: Path, index: number, paths: Path[]) {
  return [
    "main-menu-item",
    path.className,
    path.disabled ? "disabled" : "",
    !paths[index + 1] ? "" : WITH_SEPARATOR_CLASS,
  ]
    .filter(Boolean)
    .join(" ");
}

const MenuList = ({ paths, className }: Readonly<{ paths: Path[]; className: string }>) => (
  <ul className={className}>
    {paths.map((path, index) => (
      <li className={getClasses(path, index, paths)} key={path.path}>
        {path.disabled ? (
          <span aria-disabled="true">{path.label}</span>
        ) : (
          <Link to={path.path} {...path.attrs}>
            {path.label}
          </Link>
        )}
      </li>
    ))}
  </ul>
);

interface MainMenuTypes {
  paths: any[];
}

export const MainMenu = ({ paths }: Readonly<MainMenuTypes>) => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });

  const orderedPaths = paths
    .filter((path) => path.shouldBeDisplayed !== false)
    .sort((p1, p2) => p1.order - p2.order);

  const allPaths = [{ label: t("home"), path: "/" }, ...orderedPaths].reduce(
    (acc, path) => {
      if (path.alignToRight) {
        return [[...acc[0]], [...acc[1], path]];
      } else {
        return [[...acc[0], path], [...acc[1]]];
      }
    },
    [[], []],
  );

  return (
    <nav className="main-menu">
      <MenuList paths={allPaths[0]} className="main-menu-list" />
      {allPaths[1].length > 0 && (
        <MenuList paths={allPaths[1]} className="main-menu-list main-menu-list-right" />
      )}
    </nav>
  );
};
