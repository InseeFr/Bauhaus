import "primereact/resources/themes/lara-light-blue/theme.css";
import { Link } from "react-router-dom";
import { useMemo } from "react";

import { useTitle } from "@utils/hooks/useTitle";
import { usePrivileges } from "@utils/hooks/users";

import { hasAccessToModule } from "../auth/components/auth";
import D from "../deprecated-locales";
import "../styles/bootstrap.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";

import { useAppContext } from "./app-context";
import type { AppName, Module } from "./app-context";
import "./app.css";

const AppCard = ({ app, disabled }: { app: string; disabled: boolean }) => {
  const getAppTitle = (appKey: string): string => {
    const titleKey = `${appKey}Title`;
    return D[titleKey as keyof typeof D] || appKey;
  };

  const content = (
    <>
      <h2 className="items page-title page-title-link">{getAppTitle(app)}</h2>
      <div className="arrow">
        <img src={`/img/fleche-01.svg`} alt="" loading="lazy" />
      </div>
      <div className="logo">
        <img src={`/img/${app}-01.svg`} alt="" loading="lazy" />
      </div>
    </>
  );

  /* Module désactivé : la tuile reste à sa place, grisée, mais n'est plus un lien.
     Le grisé n'étant qu'une convention visuelle, l'indisponibilité est aussi
     annoncée en texte aux lecteurs d'écran. */
  if (disabled) {
    return (
      <li className={`${app} disabled`}>
        <div>
          {content}
          <span className="sr-only">{D.moduleUnavailable}</span>
        </div>
      </li>
    );
  }

  return (
    <li className={app}>
      <Link to={`/${app}`}>{content}</Link>
    </li>
  );
};

/* La première ligne est réservée à ces modules. Quand l'un d'eux est désactivé ou
   inaccessible, la ligne se réduit au lieu d'être complétée par les modules
   suivants, qui restent sur la seconde ligne. */
const FIRST_ROW_MODULES: AppName[] = ["concepts", "classifications", "operations", "ddi"];

const App = () => {
  useTitle();

  const { privileges = [] } = usePrivileges();
  const {
    properties: { modules },
  } = useAppContext();

  /* Un module désactivé reste affiché (grisé) tant que l'utilisateur y a droit :
     il est simplement fermé pour l'instant. Un module hors de ses droits, lui,
     n'a pas à lui être montré du tout. */
  const accessibleModules = useMemo(() => {
    return modules.filter((m) => hasAccessToModule(m.identifier, privileges));
  }, [modules, privileges]);

  const rows = useMemo(() => {
    const isOnFirstRow = (m: Module) => FIRST_ROW_MODULES.includes(m.identifier);
    return [
      accessibleModules.filter(isOnFirstRow),
      accessibleModules.filter((m) => !isOnFirstRow(m)),
    ].filter((row) => row.length > 0);
  }, [accessibleModules]);

  /* Les tuiles sont la navigation principale de l'application : un landmark nommé
     permet de l'atteindre directement au lecteur d'écran. Le découpage en lignes
     n'étant que visuel, les `ul` restent des détails de présentation. */
  return (
    <nav className="home-page-links" aria-label={D.modulesNavigationTitle}>
      {rows.map((row) => (
        <ul key={row[0].identifier} className="home-page-links-row">
          {row.map((m) => (
            <AppCard key={m.identifier} app={m.identifier} disabled={m.disabled} />
          ))}
        </ul>
      ))}
    </nav>
  );
};

export default App;
