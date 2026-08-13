import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Note } from "@components/note";

export function SeeAlso({ links, secondLang }) {
  const { t } = useTranslation();

  function displaySeeAlsos(label) {
    function displaySeeAlso(seeAlso, title, path) {
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
