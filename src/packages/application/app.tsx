import "primereact/resources/themes/lara-light-blue/theme.css";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { usePrivileges } from "@utils/hooks/users";
import { useTitle } from "@utils/hooks/useTitle";

import { hasAccessToModule } from "../auth/components/auth";
import { appI18n } from "../i18n";
import "../styles/bootstrap.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";

import { useAppContext } from "./app-context";
import type { AppName, Module } from "./app-context";
import "./app.css";

const AppCard = ({ app }: { app: string }) => {
  const { t, i18n } = useTranslation("translation", { i18n: appI18n });

  const getAppTitle = (appKey: string): string => {
    const titleKey = `home.${appKey}Title`;
    return i18n.exists(titleKey) ? t(titleKey) : appKey;
  };

  return (
    <li className={app}>
      <Link to={`/${app}`}>
        <h2 className="items page-title page-title-link">{getAppTitle(app)}</h2>
        <div className="arrow">
          <img src={`/img/fleche-01.svg`} alt="" loading="lazy" />
        </div>
        <div className="logo">
          <img src={`/img/${app}-01.svg`} alt="" loading="lazy" />
        </div>
      </Link>
    </li>
  );
};

/* La première ligne est réservée à ces modules. Quand l'un d'eux n'est pas déclaré
   ou pas accessible, la ligne se réduit au lieu d'être complétée par les modules
   suivants, qui restent sur la seconde ligne. */
const FIRST_ROW_MODULES: AppName[] = ["concepts", "classifications", "operations", "ddi"];

export const App = () => {
  const { t } = useTranslation("translation", { i18n: appI18n });

  useTitle();

  const { privileges = [] } = usePrivileges();

  const {
    properties: { modules },
  } = useAppContext();

  /* Deux raisons de ne pas afficher une tuile : le module se déclare masqué, ou il est hors
     des droits de l'utilisateur. Un module masqué ici peut rester joignable par URL. */
  const visibleModules = useMemo(() => {
    return modules.filter((m) => m.show && hasAccessToModule(m.identifier, privileges));
  }, [modules, privileges]);

  const rows = useMemo(() => {
    const isOnFirstRow = (m: Module) => FIRST_ROW_MODULES.includes(m.identifier);
    return [
      visibleModules.filter(isOnFirstRow),
      visibleModules.filter((m) => !isOnFirstRow(m)),
    ].filter((row) => row.length > 0);
  }, [visibleModules]);

  /* Les tuiles sont la navigation principale de l'application : un landmark nommé
     permet de l'atteindre directement au lecteur d'écran. Le découpage en lignes
     n'étant que visuel, les `ul` restent des détails de présentation. */
  return (
    <nav className="home-page-links" aria-label={t("home.modulesNavigationTitle")}>
      {rows.map((row) => (
        <ul key={row[0].identifier} className="home-page-links-row">
          {row.map((m) => (
            <AppCard key={m.identifier} app={m.identifier} />
          ))}
        </ul>
      ))}
    </nav>
  );
};
