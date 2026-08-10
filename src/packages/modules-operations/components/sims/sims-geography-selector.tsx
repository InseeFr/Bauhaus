import { Row } from "@components/layout";
import { List } from "@components/ui/list-group";

import D from "../../i18n/build-dictionary";
import SimsGeographyI18NLabel from "./sims-geography-i18n-label";

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
const SimsGeographySelector = ({
  includes,
  excludes,
  onRemoveExclude,
  onRemoveInclude,
}: Readonly<SimsGeographySelectorTypes>) => {
  const excludedItems = excludes.map((geography) => (
    <List.Item key={geography.value}>
      <SimsGeographyI18NLabel geography={geography} />

      <button
        type="button"
        className="documentsbloc__delete documentsbloc__btn"
        aria-label={D.btnDelete}
        onClick={() => onRemoveExclude(geography)}
      >
        <span className="glyphicon glyphicon-trash" aria-hidden="true" />
      </button>
    </List.Item>
  ));

  const includedItems = includes.map((geography) => (
    <List.Item key={geography.value}>
      <SimsGeographyI18NLabel geography={geography} />

      <button
        type="button"
        className="documentsbloc__delete documentsbloc__btn"
        aria-label={D.btnDelete}
        onClick={() => onRemoveInclude(geography)}
      >
        <span className="glyphicon glyphicon-trash" aria-hidden="true" />
      </button>
    </List.Item>
  ));
  return (
    <Row>
      <div className="col-md-6">
        <h4>{D.includedZone}</h4>
        {includedItems}
      </div>
      <div className="col-md-6">
        <h4>{D.excludedZone}</h4>
        {excludedItems}
      </div>
    </Row>
  );
};

export default SimsGeographySelector;
