import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { AdvancedSearchCard } from "@components/advanced-search/fields";
import { AdvancedSearchList } from "@components/advanced-search/home";
import { CreatorsInput } from "@components/business/creators-input";
import { DatePicker } from "@components/date-picker";
import { DisseminationStatusInput } from "@components/dissemination-status/disseminationStatus";
import { Loading } from "@components/loading";
import { Select } from "@components/select-rmes";
import { List } from "@components/ui/list-group";
import { SearchField, SearchTextField } from "@components/ui/search-field";

import { Options } from "@model/SelectOption";
import { validateStateOptions } from "@model/ValidationState";

import { DatasetsApi } from "@sdk/datasets-api";

import { filterKeyDate, filterKeyDeburr } from "@utils/array-utils";
import { useTitle } from "@utils/hooks/useTitle";
import { useUrlQueryParameters } from "@utils/hooks/useUrlQueryParameters";

import { useSeriesOperationsOptions } from "../../../hooks/useSeriesOperationsOptions";

export interface SearchDataset {
  id: string;
  labelLg1: string;
  creator: string;
  disseminationStatus: string;
  validationStatus: string;
  wasGeneratedIRIs: string;
  created: string;
  updated: string;
  altIdentifier?: string;
}

export const Component = () => {
  const { t } = useTranslation();

  useTitle(t("dataset.searchTitle"));

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SearchDataset[]>([]);

  useEffect(() => {
    DatasetsApi.getDatasetsForSearch()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const seriesOperationsOptions = useSeriesOperationsOptions();

  if (loading) return <Loading />;

  return <AdvancedSearchForm data={data} seriesOperationsOptions={seriesOperationsOptions} />;
};

const filterLabel = filterKeyDeburr(["labelLg1"]);
const filterAltIdentifier = filterKeyDeburr(["altIdentifier"]);
const filterCreator = filterKeyDeburr(["creator"]);
const filterDisseminationStatus = filterKeyDeburr(["disseminationStatus"]);
const filterValidationStatus = filterKeyDeburr(["validationStatus"]);
const filterWasGeneratedIRIs = filterKeyDeburr(["wasGeneratedIRIs"]);
const filterCreatedDate = filterKeyDate("created");
const filterUpdatedDate = filterKeyDate("updated");

const defaultFormState = {
  labelLg1: "",
  altIdentifier: "",
  creator: "",
  disseminationStatus: "",
  validationStatus: "",
  wasGeneratedIRIs: "",
  created: "",
  updated: "",
};

export const AdvancedSearchForm = ({
  data,
  seriesOperationsOptions,
}: {
  data: SearchDataset[];
  seriesOperationsOptions: Options;
}) => {
  const { t } = useTranslation();

  const { form, reset, handleChange } = useUrlQueryParameters(defaultFormState);

  const {
    labelLg1,
    altIdentifier,
    creator,
    disseminationStatus,
    validationStatus,
    wasGeneratedIRIs,
    created,
    updated,
  } = form;

  const today = new Date();

  const filteredData = data
    .filter(filterLabel(labelLg1))
    .filter(filterAltIdentifier(altIdentifier))
    .filter(filterCreator(creator))
    .filter(filterDisseminationStatus(disseminationStatus))
    .filter(filterValidationStatus(validationStatus))
    .filter(filterWasGeneratedIRIs(wasGeneratedIRIs))
    .filter(filterCreatedDate(created, today))
    .filter(filterUpdatedDate(updated, today));

  const dataLinks = filteredData.map(({ id, labelLg1 }) => (
    <List.Item key={id}>
      <Link to={`/datasets/${id}`}>{labelLg1}</Link>
    </List.Item>
  ));

  return (
    <AdvancedSearchList
      title={t("dataset.searchTitle")}
      data={dataLinks}
      initializeState={reset}
      redirect={<Navigate to="/datasets" />}
    >
      <AdvancedSearchCard className="dataset-search-form">
        <FieldsForDatasetsAdvancedSearch
          labelLg1={labelLg1}
          altIdentifier={altIdentifier}
          creator={creator}
          disseminationStatus={disseminationStatus}
          validationStatus={validationStatus}
          wasGeneratedIRIs={wasGeneratedIRIs}
          created={created}
          updated={updated}
          handleChange={handleChange}
          seriesOperationsOptions={seriesOperationsOptions}
        />
      </AdvancedSearchCard>
    </AdvancedSearchList>
  );
};

export const FieldsForDatasetsAdvancedSearch = ({
  labelLg1,
  altIdentifier,
  creator,
  disseminationStatus,
  validationStatus,
  wasGeneratedIRIs,
  created,
  updated,
  handleChange,
  seriesOperationsOptions,
}: {
  labelLg1: string;
  altIdentifier: string;
  creator: string;
  disseminationStatus: string;
  validationStatus: string;
  wasGeneratedIRIs: string;
  created: string;
  updated: string;
  handleChange: (property: string, stateChange: string) => void;
  seriesOperationsOptions: Options;
}) => {
  const { t } = useTranslation();

  return (
    <>
      <SearchTextField
        label={t("dataset.globalInformation.mainTitle")}
        value={labelLg1}
        onChange={(value) => handleChange("labelLg1", value)}
      />
      <SearchTextField
        label={t("dataset.internalManagement.altId.title")}
        value={altIdentifier}
        onChange={(value) => handleChange("altIdentifier", value)}
      />
      <div className="field col-12 md:col-4">
        <CreatorsInput
          mode="organisation"
          lang="default"
          value={creator}
          onChange={(value: any) => handleChange("creator", value)}
          required={false}
        />
      </div>
      <div className="field col-12 md:col-4">
        <DisseminationStatusInput
          value={disseminationStatus}
          handleChange={(value) => handleChange("disseminationStatus", value)}
        />
      </div>
      <SearchField label={t("dataset.globalInformation.validationStatus")} col="col-12 md:col-4">
        {(id) => (
          <Select
            inputId={id}
            value={validationStatus}
            options={validateStateOptions}
            onChange={(value) => handleChange("validationStatus", value)}
          />
        )}
      </SearchField>
      <SearchField label={t("dataset.globalInformation.creationDate")} col="col-12 md:col-4">
        {(id) => (
          <DatePicker
            className="w-full"
            inputId={id}
            value={created}
            onChange={(value) => handleChange("created", value ?? "")}
          />
        )}
      </SearchField>
      <SearchField label={t("dataset.globalInformation.updatingDate")} col="col-12 md:col-4">
        {(id) => (
          <DatePicker
            className="w-full"
            inputId={id}
            value={updated}
            onChange={(value) => handleChange("updated", value ?? "")}
          />
        )}
      </SearchField>
      <SearchField label={t("dataset.internalManagement.generatedBy")} col="col-12 md:col-4">
        {(id) => (
          <Select
            inputId={id}
            value={wasGeneratedIRIs}
            options={seriesOperationsOptions}
            onChange={(value: string) => handleChange("wasGeneratedIRIs", value)}
            itemTemplate={(v: any) => {
              if (!v.value.includes("/serie/")) {
                return <span className="padding">{v.label}</span>;
              }
              return `${v.label}`;
            }}
          />
        )}
      </SearchField>
    </>
  );
};
