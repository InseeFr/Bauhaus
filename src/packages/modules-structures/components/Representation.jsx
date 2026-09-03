import { useTranslation } from "react-i18next";

import { XSD_TYPES } from "../constants";
import "./Representation.css";

export const Representation = ({ component, codesLists, handleCodesListDetail }) => {
  const { t } = useTranslation();

  const codeList = codesLists.find(
    ({ id }) => id?.toString() === component.codeList?.toString(),
  )?.label;

  if (codeList) {
    return (
      <div className="representation">
        <span>{codeList}</span>
        <button
          type="button"
          className="btn btn-default"
          onClick={handleCodesListDetail}
          aria-label={t("component.seeCodelistDetails")}
          title={t("component.seeCodelistDetails")}
        >
          <span className="glyphicon glyphicon-th"></span>
        </button>
      </div>
    );
  }

  return XSD_TYPES.find((range) => component.range === range.value)?.label || "";
};
