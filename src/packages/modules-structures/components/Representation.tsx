import { useTranslation } from "react-i18next";

import { Codelists } from "@model/Codelist";
import { Component } from "@model/structures/Component";

import { XSD_TYPES } from "../constants";
import "./Representation.css";

interface RepresentationTypes {
  component: Component;
  codelists: Codelists;
  handleCodelistDetail: VoidFunction;
}

export const Representation = ({
  component,
  codelists,
  handleCodelistDetail,
}: Readonly<RepresentationTypes>) => {
  const { t } = useTranslation();

  const codelist = codelists.find(
    ({ id }) => id?.toString() === component.codeList?.toString(),
  )?.label;

  if (codelist) {
    return (
      <div className="representation">
        <span>{codelist}</span>
        <button
          type="button"
          className="btn btn-default"
          onClick={handleCodelistDetail}
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
