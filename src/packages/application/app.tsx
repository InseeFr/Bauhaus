import "primereact/resources/themes/lara-light-blue/theme.css";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useTitle } from "@utils/hooks/useTitle";

import { appI18n } from "../i18n";
import "../styles/bootstrap.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";

import type { AppName } from "./app-context";
import "./app.css";
import { landingModule, SECTION_ROWS } from "./sections";
import type { Section } from "./sections";
import { useVisibleModules } from "./visible-modules";

const AppCard = ({ section, target }: { section: Section; target: AppName }) => {
  const { t } = useTranslation("translation", { i18n: appI18n });

  return (
    <li className={section.identifier}>
      <Link to={`/${target}`}>
        <h2 className="items page-title page-title-link">{t(`home.${section.identifier}Title`)}</h2>
        <div className="arrow">
          <img src={`/img/fleche-01.svg`} alt="" loading="lazy" />
        </div>
        {section.logo && (
          <div className="logo">
            <img src={`/img/${section.logo}`} alt="" loading="lazy" />
          </div>
        )}
      </Link>
    </li>
  );
};

export const App = () => {
  const { t } = useTranslation("translation", { i18n: appI18n });

  useTitle();

  const visibleModules = useVisibleModules();

  const rows = useMemo(
    () =>
      SECTION_ROWS.map((row) =>
        row.flatMap((section) => {
          const target = landingModule(section, visibleModules);
          return target ? [{ section, target }] : [];
        }),
      ).filter((row) => row.length > 0),
    [visibleModules],
  );

  /* Les tuiles sont la navigation principale de l'application : un landmark nommé
     permet de l'atteindre directement au lecteur d'écran. Le découpage en lignes
     n'étant que visuel, les `ul` restent des détails de présentation. */
  return (
    <nav className="home-page-links" aria-label={t("home.modulesNavigationTitle")}>
      {rows.map((row) => (
        <ul key={row[0].section.identifier} className="home-page-links-row">
          {row.map(({ section, target }) => (
            <AppCard key={section.identifier} section={section} target={target} />
          ))}
        </ul>
      ))}
    </nav>
  );
};
