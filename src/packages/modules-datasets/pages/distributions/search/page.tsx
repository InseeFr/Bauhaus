import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { AdvancedSearchCard } from "@components/advanced-search/fields";
import { AdvancedSearchList } from "@components/advanced-search/home";
import { DatePicker } from "@components/date-picker";
import { Loading } from "@components/loading";
import { Select } from "@components/select-rmes";
import { List } from "@components/ui/list-group";
import { SearchField, SearchTextField } from "@components/ui/search-field";

import { Options } from "@model/SelectOption";
import { validateStateOptions } from "@model/ValidationState";

import { DistributionApi } from "@sdk/distributions-api";

import { filterKeyDate, filterKeyDeburr } from "@utils/array-utils";
import { useTitle } from "@utils/hooks/useTitle";
import { useUrlQueryParameters } from "@utils/hooks/useUrlQueryParameters";

import { useSeriesOperationsOptions } from "../../../hooks/useSeriesOperationsOptions";
import { FieldsForDatasetsAdvancedSearch, SearchDataset } from "../../datasets/search/page";

interface SearchDistribution {
  distributionId: string;
  distributionLabelLg1: string;
  distributionValidationStatus: string;
  distributionCreated: string;
  distributionUpdated: string;
  altIdentifier: string;
  dataset: SearchDataset;
}

export const Component = () => {
  const { t } = useTranslation();

  useTitle(t("distribution.searchTitle"));

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<SearchDistribution[]>([]);

  useEffect(() => {
    DistributionApi.getDistributionsForSearch()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const seriesOperationsOptions = useSeriesOperationsOptions();

  if (loading) return <Loading />;

  return <AdvancedSearchForm data={data} seriesOperationsOptions={seriesOperationsOptions} />;
};

const filterDistributionLabel = filterKeyDeburr(["distributionLabelLg1"]);
const filterDistributionValidationStatus = filterKeyDeburr(["distributionValidationStatus"]);
const filterDistributionCreatedDate = filterKeyDate("distributionCreated");
const filterDistributionUpdatedDate = filterKeyDate("distributionUpdated");
const filterLabel = filterKeyDeburr(["labelLg1"]);
const filterAltId = filterKeyDeburr(["altIdentifier"]);
const filterCreator = filterKeyDeburr(["creator"]);
const filterDisseminationStatus = filterKeyDeburr(["disseminationStatus"]);
const filterValidationStatus = filterKeyDeburr(["validationStatus"]);
const filterWasGeneratedIRIs = filterKeyDeburr(["wasGeneratedIRIs"]);
const filterCreatedDate = filterKeyDate("created");
const filterUpdatedDate = filterKeyDate("updated");

const defaultFormState = {
  distributionLabelLg1: "",
  distributionValidationStatus: "",
  distributionCreated: "",
  distributionUpdated: "",
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
  data: SearchDistribution[];
  seriesOperationsOptions: Options;
}) => {
  const { t } = useTranslation();

  const { form, reset, handleChange } = useUrlQueryParameters(defaultFormState);

  const {
    distributionLabelLg1,
    distributionValidationStatus,
    distributionCreated,
    distributionUpdated,
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
    .filter(filterDistributionLabel(distributionLabelLg1))
    .filter(filterDistributionValidationStatus(distributionValidationStatus))
    .filter(filterDistributionCreatedDate(distributionCreated, today))
    .filter(filterDistributionUpdatedDate(distributionUpdated, today))
    .filter(filterLabel(labelLg1))
    .filter(filterAltId(altIdentifier))
    .filter(filterCreator(creator))
    .filter(filterDisseminationStatus(disseminationStatus))
    .filter(filterValidationStatus(validationStatus))
    .filter(filterWasGeneratedIRIs(wasGeneratedIRIs))
    .filter(filterCreatedDate(created, today))
    .filter(filterUpdatedDate(updated, today));

  const dataLinks = filteredData.map(({ distributionId, distributionLabelLg1 }) => (
    <List.Item key={distributionId}>
      <Link to={`/datasets/distributions/${distributionId}`}>{distributionLabelLg1}</Link>
    </List.Item>
  ));

  return (
    <AdvancedSearchList
      title={t("distribution.searchTitle")}
      data={dataLinks}
      initializeState={reset}
      redirect={<Navigate to="/datasets/distributions" />}
    >
      <AdvancedSearchCard title={t("distribution.title")} className="distribution-search-form">
        <SearchTextField
          label={t("distribution.mainTitle")}
          value={distributionLabelLg1}
          onChange={(value) => handleChange("distributionLabelLg1", value)}
        />
        <SearchField label={t("distribution.creationDate")} col="col-12 md:col-4">
          {(id) => (
            <DatePicker
              className="w-full"
              inputId={id}
              value={distributionCreated}
              onChange={(value) => handleChange("distributionCreated", value ?? "")}
            />
          )}
        </SearchField>
        <SearchField label={t("distribution.updatingDate")} col="col-12 md:col-4">
          {(id) => (
            <DatePicker
              className="w-full"
              inputId={id}
              value={distributionUpdated}
              onChange={(value) => handleChange("distributionUpdated", value ?? "")}
            />
          )}
        </SearchField>
        <SearchField label={t("distribution.validationStatus")} col="col-12 md:col-4">
          {(id) => (
            <Select
              inputId={id}
              value={distributionValidationStatus}
              options={validateStateOptions}
              onChange={(value) => handleChange("distributionValidationStatus", value)}
            />
          )}
        </SearchField>
      </AdvancedSearchCard>
      <AdvancedSearchCard title={t("dataset.title")} className="dataset-search-form">
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
