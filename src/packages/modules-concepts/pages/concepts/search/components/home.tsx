import { ChangeEvent, ReactElement } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { DatePicker } from "@components/date-picker";
import { DisseminationStatusInput } from "@components/dissemination-status/disseminationStatus";
import { TextInput } from "@components/form/input";
import { NumberResults } from "@components/number-results";
import { PageTitle } from "@components/page-title";
import { Pagination } from "@components/pagination";
import { Select } from "@components/select-rmes";

import { filterKeyDate, filterKeyDeburr } from "@utils/array-utils";
import { useTitle } from "@utils/hooks/useTitle";
import useUrlQueryParameters from "@utils/hooks/useUrlQueryParameters";

import { ConceptForAdvancedSearch } from "../../../../types/concept";
import Controls from "./controls";

const filterLabel = filterKeyDeburr(["label"]);
const filterAltLabel = filterKeyDeburr(["altLabel"]);
const filterDefinition = filterKeyDeburr(["definition"]);
const filterCreator = filterKeyDeburr(["creator"]);
const filterDisseminationStatus = filterKeyDeburr(["disseminationStatus"]);
const filterValidationStatus = filterKeyDeburr(["validationStatus"]);
const filterCreatedDate = filterKeyDate("created");
const filterModifiedDate = filterKeyDate("modified");

const defaultFormState = {
  label: "",
  altLabel: "",
  definition: "",
  creator: "",
  dateCreatedStart: "",
  dateCreatedEnd: "",
  dateModifiedStart: "",
  dateModifiedEnd: "",
  disseminationStatus: "",
  validationStatus: "",
};

interface ConceptSearchListProps {
  conceptSearchList: ConceptForAdvancedSearch[];
  stampList: string[];
  onExport: (ids: string[], type: string, withConcepts: boolean, lang?: "lg1" | "lg2") => void;
}

const ConceptSearchList = ({
  conceptSearchList,
  stampList,
  onExport,
}: Readonly<ConceptSearchListProps>) => {
  const { t } = useTranslation();
  useTitle(t("concept.title"), t("common.advancedSearch"));

  const { form, reset, handleChange } = useUrlQueryParameters(defaultFormState);
  const navigate = useNavigate();

  const {
    label,
    altLabel,
    definition,
    creator,
    disseminationStatus,
    validationStatus,
    dateCreatedStart,
    dateCreatedEnd,
    dateModifiedStart,
    dateModifiedEnd,
  } = form;

  const hits: ConceptForAdvancedSearch[] = conceptSearchList
    .filter(filterLabel(label))
    .filter(filterAltLabel(altLabel))
    .filter(filterDefinition(definition))
    .filter(filterCreator(creator))
    .filter(filterDisseminationStatus(disseminationStatus))
    .filter(filterValidationStatus(validationStatus))
    .filter(filterCreatedDate(dateCreatedStart, dateCreatedEnd))
    .filter(filterModifiedDate(dateModifiedStart, dateModifiedEnd));

  const stampListOptions = stampList.map((stamp) => ({
    label: stamp,
    value: stamp,
  }));

  const validationStatusOptions = [
    { label: t("concept.general.conceptStatusValid"), value: "true" },
    { label: t("concept.general.conceptStatusProvisional"), value: "false" },
  ];

  const hitEls: ReactElement[] = hits.map(({ id, label }) => (
    <li key={id} className="list-group-item">
      <Link to={`/concepts/${id}`}>{label}</Link>
    </li>
  ));

  return (
    <div>
      <div className="container">
        <PageTitle title={t("concept.search.title")} />
        <Controls
          onClickReturn={() => navigate("/concepts")}
          initializeState={reset}
          onExport={onExport}
          conceptsList={hits}
        />
        <div className="row form-group">
          <div className="col-md-12">
            <TextInput
              value={label}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("label", e.target.value)}
              placeholder={t("common.searchLabelPlaceholder")}
            />
          </div>
        </div>
        <div className="row form-group">
          <div className="col-md-12">
            <TextInput
              value={altLabel}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange("altLabel", e.target.value)
              }
              placeholder={t("common.searchAltLabelPlaceholder")}
            />
          </div>
        </div>
        <div className="row form-group">
          <div className="col-md-12">
            <TextInput
              value={definition}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange("definition", e.target.value)
              }
              placeholder={t("common.searchDefinitionPlaceholder")}
            />
          </div>
        </div>
        <div className="row form-group">
          <div className="col-md-4">
            <Select
              placeholder={t("common.stampsPlaceholder")}
              value={stampListOptions.find(({ value }) => value === creator)?.value ?? ""}
              options={stampListOptions}
              onChange={(value: string) => handleChange("creator", value)}
            />
          </div>
          <div className="col-md-4">
            <DisseminationStatusInput
              value={disseminationStatus}
              withLabel={false}
              handleChange={(option) => handleChange("disseminationStatus", option ?? "")}
            />
          </div>
          <div className="col-md-4">
            <Select
              placeholder={t("common.validationStatusPlaceholder")}
              value={
                validationStatusOptions.find(({ value }) => value === validationStatus)?.value ?? ""
              }
              options={validationStatusOptions}
              onChange={(value: string) => handleChange("validationStatus", value)}
            />
          </div>
        </div>
        <div className="row vertical-center">
          <div className="col-md-3 text-center">
            <label>{t("concept.dateMessage.creation")}</label>
          </div>
          <div className="col-md-4">
            <DatePicker
              value={dateCreatedStart}
              onChange={(value?: string) => handleChange("dateCreatedStart", value ?? "")}
            />
          </div>
          <div className="col-md-1 text-center">
            <label>{t("concept.dateMessage.transition")}</label>
          </div>
          <div className="col-md-4">
            <DatePicker
              value={dateCreatedEnd}
              onChange={(value?: string) => handleChange("dateCreatedEnd", value ?? "")}
            />
          </div>
        </div>
        <div className="row vertical-center">
          <div className="col-md-3 text-center">
            <label>{t("concept.dateMessage.update")}</label>
          </div>
          <div className="col-md-4">
            <DatePicker
              value={dateModifiedStart}
              onChange={(value?: string) => handleChange("dateModifiedStart", value ?? "")}
            />
          </div>
          <div className="col-md-1 text-center">
            <label>{t("concept.dateMessage.transition")}</label>
          </div>
          <div className="col-md-4">
            <DatePicker
              value={dateModifiedEnd}
              onChange={(value?: string) => handleChange("dateModifiedEnd", value ?? "")}
            />
          </div>
        </div>
        <div className="text-center">
          <div>
            <h4>
              <NumberResults results={hitEls} />
            </h4>
          </div>
          <div>
            <Pagination itemEls={hitEls} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConceptSearchList;
