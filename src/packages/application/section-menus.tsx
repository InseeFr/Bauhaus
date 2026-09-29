import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { MainMenu } from "@components/menu";

import { appI18n } from "../i18n";
import type { AppName } from "./app-context";
import { useVisibleModules } from "./visible-modules";

interface SectionMenuItem {
  path: string;
  labelKey: string;
  /** Module qui porte la page : l'entrée disparaît quand il n'est pas proposé à l'utilisateur. */
  module?: AppName;
  disabled?: boolean;
}

/* Menu commun aux modules regroupés sous une même tuile de la page d'accueil : on passe
   d'un module à l'autre sans repasser par l'accueil. */
const SectionMenu = ({ items }: Readonly<{ items: SectionMenuItem[] }>) => {
  const { t } = useTranslation("translation", { i18n: appI18n });
  const { pathname } = useLocation();
  const visibleModules = useVisibleModules();

  const shownItems = items.filter((item) => !item.module || visibleModules.includes(item.module));

  // L'entrée la plus spécifique l'emporte : /structures/components n'active pas /structures.
  const currentPath = shownItems
    .filter((item) => !item.disabled)
    .map((item) => item.path)
    .sort((a, b) => b.length - a.length)
    .find((path) => pathname === path || pathname.startsWith(path + "/"));

  const paths = shownItems.map((item, index) => ({
    path: item.path,
    label: t(item.labelKey),
    order: index,
    disabled: item.disabled,
    className: item.path === currentPath ? "active" : null,
    attrs: item.path === currentPath ? { "aria-current": "page" } : null,
  }));

  return <MainMenu paths={paths} />;
};

const DATA_DESCRIPTION_ITEMS: SectionMenuItem[] = [
  { path: "/datasets", labelKey: "menu.datasets", module: "datasets" },
  { path: "/datasets/distributions", labelKey: "menu.distributions", module: "datasets" },
  { path: "/ddi", labelKey: "menu.variables", module: "ddi" },
  // Listes de codes DDI : annoncées, pas encore développées.
  { path: "/ddi/codelists", labelKey: "menu.codelists", disabled: true },
];

const ADMINISTRATION_ITEMS: SectionMenuItem[] = [
  { path: "/codelists", labelKey: "menu.codelists", module: "codelists" },
  { path: "/structures", labelKey: "menu.structures", module: "structures" },
  { path: "/structures/components", labelKey: "menu.components", module: "structures" },
];

export const DataDescriptionMenu = () => <SectionMenu items={DATA_DESCRIPTION_ITEMS} />;

export const AdministrationMenu = () => <SectionMenu items={ADMINISTRATION_ITEMS} />;
