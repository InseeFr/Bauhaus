import { useEffect, useId, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { AdvancedSearchList } from "@components/advanced-search/home";
import { CreatorsInput } from "@components/business/creators-input";
import { DatePicker } from "@components/date-picker";
import { DisseminationStatusInput } from "@components/dissemination-status/disseminationStatus";
import { TextInput } from "@components/form/input";
import { Loading } from "@components/loading";
import { Select } from "@components/select-rmes";

import { Options } from "@model/SelectOption";
import { validateStateOptions } from "@model/ValidationState";

import { DatasetsApi } from "@sdk/datasets-api";

import { filterKeyDate, filterKeyDeburr } from "@utils/array-utils";
import { useTitle } from "@utils/hooks/useTitle";
import useUrlQueryParameters from "@utils/hooks/useUrlQueryParameters";

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
    <li key={id} className="list-group-item">
      <Link to={`/datasets/${id}`}>{labelLg1}</Link>
    </li>
  ));

  return (
    <AdvancedSearchList
      title={t("dataset.searchTitle")}
      data={dataLinks}
      initializeState={reset}
      redirect={<Navigate to="/datasets" />}
    >
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
  const createdDateId = useId();
  const updatedDateId = useId();
  const validationStatusId = useId();
  const generatedByIRIsId = useId();

  return (
    <>
      <div className="row form-group">
        <div className="col-md-12">
          <label className="w-100">
            {t("dataset.globalInformation.mainTitle")}
            <TextInput
              value={labelLg1}
              onChange={(e) => handleChange("labelLg1", e.target.value)}
            />
          </label>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-12">
          <label className="w-100">
            {t("dataset.internalManagement.altId.title")}
            <TextInput
              value={altIdentifier}
              onChange={(e) => handleChange("altIdentifier", e.target.value)}
            />
          </label>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-4">
          <CreatorsInput
            lang="default"
            value={creator}
            onChange={(value: any) => handleChange("creator", value)}
            required={false}
          />
        </div>
        <div className="col-md-4">
          <DisseminationStatusInput
            value={disseminationStatus}
            handleChange={(value) => handleChange("disseminationStatus", value)}
          />
        </div>
        <div className="col-md-4">
          <label className="w-100" htmlFor={validationStatusId}>
            {t("dataset.globalInformation.validationStatus")}
          </label>
          <Select
            inputId={validationStatusId}
            value={validationStatus}
            options={validateStateOptions}
            onChange={(value) => handleChange("validationStatus", value)}
          />
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-4">
          <label className="w-100" htmlFor={createdDateId}>
            {t("dataset.globalInformation.creationDate")}
          </label>
          <DatePicker
            className="w-full"
            inputId={createdDateId}
            value={created}
            onChange={(value) => handleChange("created", value ?? "")}
          />
        </div>
        <div className="col-md-4">
          <label className="w-100" htmlFor={updatedDateId}>
            {t("dataset.globalInformation.updatingDate")}
          </label>
          <DatePicker
            className="w-full"
            inputId={updatedDateId}
            value={updated}
            onChange={(value) => handleChange("updated", value ?? "")}
          />
        </div>
        <div className="col-md-4">
          <label className="w-100" htmlFor={generatedByIRIsId}>
            {t("dataset.internalManagement.generatedBy")}
          </label>
          <Select
            inputId={generatedByIRIsId}
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
        </div>
      </div>
    </>
  );
};
