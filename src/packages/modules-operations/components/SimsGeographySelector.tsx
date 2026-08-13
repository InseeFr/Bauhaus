import { useTranslation } from "react-i18next";

import { Row } from "@components/layout";

import { SimsGeographyI18NLabel } from "./SimsGeographyI18NLabel";

export interface Geography {
  value: string;
  label: string;
  labelLg2: string;
  typeTerritory: string;
}

interface SimsGeographySelectorTypes {
  excludes: Geography[];
  includes: Geography[];
  onRemoveExclude: (value: Geography) => void;
  onRemoveInclude: (value: Geography) => void;
}

export const SimsGeographySelector = ({
  includes,
  excludes,
  onRemoveExclude,
  onRemoveInclude,
}: Readonly<SimsGeographySelectorTypes>) => {
  const { t } = useTranslation();

  const excludedItems = excludes.map((geography) => (
    <li className="list-group-item" key={geography.value}>
      <SimsGeographyI18NLabel geography={geography} />
      <button
        type="button"
        className="documentsbloc-delete documentsbloc-btn"
        aria-label={t("geography.btnDelete")}
        onClick={() => onRemoveExclude(geography)}
      >
        <span className="glyphicon glyphicon-trash" aria-hidden="true" />
      </button>
    </li>
  ));

  const includedItems = includes.map((geography) => (
    <li className="list-group-item" key={geography.value}>
      <SimsGeographyI18NLabel geography={geography} />
      <button
        type="button"
        className="documentsbloc-delete documentsbloc-btn"
        aria-label={t("geography.btnDelete")}
        onClick={() => onRemoveInclude(geography)}
      >
        <span className="glyphicon glyphicon-trash" aria-hidden="true" />
      </button>
    </li>
  ));

  return (
    <Row>
      <div className="col-md-6">
        <h4>{t("geography.includedZone")}</h4>
        {includedItems}
      </div>
      <div className="col-md-6">
        <h4>{t("geography.excludedZone")}</h4>
        {excludedItems}
      </div>
    </Row>
  );
};
