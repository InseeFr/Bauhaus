import "primereact/resources/themes/lara-light-blue/theme.css";
import { Link } from "react-router-dom";
import { useMemo } from "react";

import { useTitle } from "@utils/hooks/useTitle";
import { usePrivileges } from "@utils/hooks/users";

import { hasAccessToModule } from "../auth/components/auth";
import D from "../deprecated-locales/build-dictionary";
import "../styles/bootstrap.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";

import { useAppContext } from "./app-context";
import type { AppName } from "./app-context";
import "./app.css";

const AppCard = ({ app }: { app: string }) => {
  const getAppTitle = (appKey: string): string => {
    const titleKey = `${appKey}Title`;
    return D[titleKey as keyof typeof D] || appKey;
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

/* La première ligne est réservée à ces modules. Quand l'un d'eux est désactivé ou
   inaccessible, la ligne se réduit au lieu d'être complétée par les modules
   suivants, qui restent sur la seconde ligne. */
const FIRST_ROW_MODULES: AppName[] = ["concepts", "classifications", "operations"];

export const App = () => {
  useTitle();

  const { privileges = [] } = usePrivileges();

  const {
    properties: { modules },
  } = useAppContext();

  const accessibleModules = useMemo(() => {
    return modules
      .filter((m) => !m.disabled && hasAccessToModule(m.identifier, privileges))
      .map((m) => m.identifier);
  }, [modules, privileges]);

  const rows = useMemo(() => {
    const isOnFirstRow = (app: AppName) => FIRST_ROW_MODULES.includes(app);
    return [
      accessibleModules.filter(isOnFirstRow),
      accessibleModules.filter((app) => !isOnFirstRow(app)),
    ].filter((row) => row.length > 0);
  }, [accessibleModules]);

  /* Les tuiles sont la navigation principale de l'application : un landmark nommé
     permet de l'atteindre directement au lecteur d'écran. Le découpage en lignes
     n'étant que visuel, les `ul` restent des détails de présentation. */
  return (
    <nav className="home-page-links" aria-label={D.modulesNavigationTitle}>
      {rows.map((row) => (
        <ul key={row[0]} className="home-page-links-row">
          {row.map((app) => (
            <AppCard key={app} app={app} />
          ))}
        </ul>
      ))}
    </nav>
  );
};
