import { ReactElement } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { AdvancedSearchCard } from "@components/advanced-search/fields";
import { CreatorsInput } from "@components/business/creators-input";
import { DatePicker } from "@components/date-picker";
import { DisseminationStatusInput } from "@components/dissemination-status/disseminationStatus";
import { NumberResults } from "@components/number-results";
import { PageTitle } from "@components/page-title";
import { Pagination } from "@components/pagination";
import { Select } from "@components/select-rmes";
import { List } from "@components/ui/list-group";
import { SearchField, SearchTextField } from "@components/ui/search-field";

import { filterKeyDate, filterKeyDeburr } from "@utils/array-utils";
import { useTitle } from "@utils/hooks/useTitle";
import { useUrlQueryParameters } from "@utils/hooks/useUrlQueryParameters";

import { validateStateOptions } from "@model/ValidationState";
import { ConceptForAdvancedSearch } from "../../../../types/concept";
import { Controls } from "./Controls";

const filterLabel = filterKeyDeburr(["label"]);
const filterAltLabel = filterKeyDeburr(["altLabel"]);
const filterDefinition = filterKeyDeburr(["definition"]);
const filterCreator = filterKeyDeburr(["creator"]);
const filterDisseminationStatus = filterKeyDeburr(["disseminationStatus"]);
const filterValidationStatus = filterKeyDeburr(["validationState"]);
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
  onExport: (ids: string[], type: string, withConcepts: boolean, lang?: "lg1" | "lg2") => void;
}

export const ConceptSearchList = ({
  conceptSearchList,
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

  const hitEls: ReactElement[] = hits.map(({ id, label }) => (
    <List.Item key={id}>
      <Link to={`/concepts/${id}`}>{label}</Link>
    </List.Item>
  ));

  return (
    <div className="container">
      <PageTitle title={t("concept.search.title")} />
      <Controls
        onClickReturn={() => navigate("/concepts")}
        initializeState={reset}
        onExport={onExport}
        conceptsList={hits}
      />
      <AdvancedSearchCard className="concept-search-form">
        <SearchTextField
          label={t("common.labelTitle")}
          value={label}
          onChange={(value) => handleChange("label", value)}
          placeholder={t("common.searchLabelPlaceholder")}
        />
        <SearchTextField
          label={t("concept.general.altLabelTitle")}
          value={altLabel}
          onChange={(value) => handleChange("altLabel", value)}
          placeholder={t("common.searchAltLabelPlaceholder")}
        />
        <SearchTextField
          label={t("concept.notes.conceptsDefinition")}
          value={definition}
          onChange={(value) => handleChange("definition", value)}
          placeholder={t("common.searchDefinitionPlaceholder")}
        />
        <div className="field col-12 md:col-4">
          <CreatorsInput
            mode="organisation"
            value={creator}
            onChange={(value: string | string[]) => handleChange("creator", value as string)}
            required={false}
          />
        </div>
        <div className="field col-12 md:col-4">
          <DisseminationStatusInput
            value={disseminationStatus}
            handleChange={(option) => handleChange("disseminationStatus", option ?? "")}
          />
        </div>
        <SearchField label={t("common.validationStatusTitle")} col="col-12 md:col-4">
          {(id) => (
            <Select
              inputId={id}
              placeholder={t("common.validationStatusPlaceholder")}
              value={
                validateStateOptions.find(({ value }) => value === validationStatus)?.value ?? ""
              }
              options={validateStateOptions}
              onChange={(value: string) => handleChange("validationStatus", value)}
            />
          )}
        </SearchField>
        <div className="field col-12 md:col-6">
          <label>{t("concept.dateMessage.creation")}</label>
          <div className="flex align-items-center gap-2">
            <DatePicker
              className="flex-1"
              value={dateCreatedStart}
              onChange={(value?: string) => handleChange("dateCreatedStart", value ?? "")}
            />
            <span className="white-space-nowrap">{t("concept.dateMessage.transition")}</span>
            <DatePicker
              className="flex-1"
              value={dateCreatedEnd}
              onChange={(value?: string) => handleChange("dateCreatedEnd", value ?? "")}
            />
          </div>
        </div>
        <div className="field col-12 md:col-6">
          <label>{t("concept.dateMessage.update")}</label>
          <div className="flex align-items-center gap-2">
            <DatePicker
              className="flex-1"
              value={dateModifiedStart}
              onChange={(value?: string) => handleChange("dateModifiedStart", value ?? "")}
            />
            <span className="white-space-nowrap">{t("concept.dateMessage.transition")}</span>
            <DatePicker
              className="flex-1"
              value={dateModifiedEnd}
              onChange={(value?: string) => handleChange("dateModifiedEnd", value ?? "")}
            />
          </div>
        </div>
      </AdvancedSearchCard>
      <div className="text-center">
        <h4>
          <NumberResults results={hitEls} />
        </h4>
        <Pagination itemEls={hitEls} />
      </div>
    </div>
  );
};
