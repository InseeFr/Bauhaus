import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { AdvancedSearchList } from "@components/advanced-search/home";
import { DatePicker } from "@components/date-picker";
import { TextInput } from "@components/form/input";
import { Loading } from "@components/loading";
import { Select } from "@components/select-rmes";

import { Options } from "@model/SelectOption";
import { validateStateOptions } from "@model/ValidationState";

import { DistributionApi } from "@sdk/distributions-api";

import { filterKeyDate, filterKeyDeburr } from "@utils/array-utils";
import { useTitle } from "@utils/hooks/useTitle";
import useUrlQueryParameters from "@utils/hooks/useUrlQueryParameters";

import D from "../../../../deprecated-locales/build-dictionary";
import { useSeriesOperationsOptions } from "../../../hooks/useSeriesOperationsOptions";
import { FieldsForDatasetsAdvancedSearch, SearchDataset } from "../../datasets/search/search";

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
  useTitle(D.distributionsTitle, D.advancedSearch);

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
    <li key={distributionId} className="list-group-item">
      <Link to={`/datasets/distributions/${distributionId}`}>{distributionLabelLg1}</Link>
    </li>
  ));

  return (
    <AdvancedSearchList
      title={D.distributionsSearchTitle}
      data={dataLinks}
      initializeState={reset}
      redirect={<Navigate to="/datasets/distributions" />}
    >
      <fieldset>
        <legend>{D.distributionTitle}</legend>
        <div className="row form-group">
          <div className="col-md-12">
            <label className="w-100">{D.labelTitle}</label>
            <TextInput
              value={distributionLabelLg1}
              onChange={(e) => handleChange("distributionLabelLg1", e.target.value)}
            />
          </div>
        </div>
        <div className="row form-group">
          <div className="col-md-3">
            <label className="w-100">{D.createdDateTitle}</label>
            <DatePicker
              value={distributionCreated}
              onChange={(value) => handleChange("distributionCreated", value ?? "")}
            />
          </div>
          <div className="col-md-4">
            <label className="w-100">{D.modifiedDateTitle}</label>
            <DatePicker
              value={distributionUpdated}
              onChange={(value) => handleChange("distributionUpdated", value ?? "")}
            />
          </div>
          <div className="col-md-4">
            <label className="w-100">{D.validationStatusTitle}</label>
            <Select
              value={distributionValidationStatus}
              options={validateStateOptions}
              onChange={(value) => handleChange("distributionValidationStatus", value)}
            />
          </div>
        </div>
      </fieldset>
      <fieldset>
        <legend>{D.datasetTitle}</legend>
        <div className="row form-group">
          <div className="col-md-12">
            <label className="w-100">{D.datasetsAltId}</label>
            <TextInput
              value={altIdentifier}
              onChange={(e) => handleChange("altIdentifier", e.target.value)}
            />
          </div>
        </div>
        <FieldsForDatasetsAdvancedSearch
          labelLg1={labelLg1}
          creator={creator}
          disseminationStatus={disseminationStatus}
          validationStatus={validationStatus}
          wasGeneratedIRIs={wasGeneratedIRIs}
          created={created}
          updated={updated}
          handleChange={handleChange}
          seriesOperationsOptions={seriesOperationsOptions}
        />
      </fieldset>
    </AdvancedSearchList>
  );
};
