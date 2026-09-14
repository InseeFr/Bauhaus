import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Note } from "@components/note";

import { OperationsLink } from "@model/operations/operations-link";

interface SeeAlsoTypes {
  links: Record<string, OperationsLink[]>;
  secondLang?: boolean;
}

export function SeeAlso({ links, secondLang }: Readonly<SeeAlsoTypes>) {
  const { t } = useTranslation();

  function displaySeeAlsos(label: "labelLg1" | "labelLg2") {
    function displaySeeAlso(seeAlso: OperationsLink[] | undefined, title: string, path: string) {
      return (
        seeAlso && (
          <li>
            {title}
            <ul>
              {seeAlso.map((link) => (
                <li key={link.id}>
                  <Link to={`${path}/${link.id}`}>{link[label]}</Link>
                </li>
              ))}
            </ul>
          </li>
        )
      );
    }
    return (
      <ul>
        {displaySeeAlso(links.indicator, t("common.indicatorsTitle"), "/operations/indicator")}
        {displaySeeAlso(links.operation, t("common.operationsTitle"), "/operations/operation")}
        {displaySeeAlso(links.series, t("common.seriesTitle"), "/operations/series")}
        {displaySeeAlso(links.family, t("common.familiesTitle"), "/operations/family")}
      </ul>
    );
  }

  return (
    <div className="row bauhaus-see-also">
      <Note
        text={displaySeeAlsos("labelLg1")}
        title={t("common.seeAlso", { lng: "fr" })}
        alone={!secondLang}
        allowEmpty={true}
      />
      {secondLang && (
        <Note
          text={displaySeeAlsos("labelLg2")}
          title={t("common.seeAlso", { lng: "en" })}
          alone={false}
          allowEmpty={true}
        />
      )}
    </div>
  );
}
