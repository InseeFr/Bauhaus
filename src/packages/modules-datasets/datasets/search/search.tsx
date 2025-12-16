import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { AdvancedSearchList } from "@components/advanced-search/home";
import { CreatorsInput } from "@components/business/creators-input";
import { DatePicker } from "@components/date-picker";
import { DisseminationStatusInput } from "@components/dissemination-status/disseminationStatus";
import { TextInput } from "@components/form/input";
import { Column } from "@components/layout";
import { Loading } from "@components/loading";
import { Select } from "@components/select-rmes";

import { Options } from "@model/SelectOption";
import { validateStateOptions } from "@model/ValidationState";

import { DatasetsApi } from "@sdk/datasets-api";

import { filterKeyDate, filterKeyDeburr } from "@utils/array-utils";
import { useTitle } from "@utils/hooks/useTitle";
import useUrlQueryParameters from "@utils/hooks/useUrlQueryParameters";

import D from "../../../deprecated-locales/build-dictionary";
import { useSeriesOperationsOptions } from "../edit/tabs/useSeriesOperationsOptions";

export interface SearchDataset {
  id: string;
  labelLg1: string;
  creator: string;
  disseminationStatus: string;
  validationStatus: string;
  wasGeneratedIRIs: string;
  created: string;
  updated: string;
}

export const Component = () => {
  useTitle(D.datasetsTitle, D.advancedSearch);

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
const filterCreator = filterKeyDeburr(["creator"]);
const filterDisseminationStatus = filterKeyDeburr(["disseminationStatus"]);
const filterValidationStatus = filterKeyDeburr(["validationStatus"]);
const filterWasGeneratedIRIs = filterKeyDeburr(["wasGeneratedIRIs"]);
const filterCreatedDate = filterKeyDate("created");
const filterUpdatedDate = filterKeyDate("updated");

const defaultFormState = {
  labelLg1: "",
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
  const { form, reset, handleChange } = useUrlQueryParameters(defaultFormState);

  const {
    labelLg1,
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
      title={D.datasetsSearchTitle}
      data={dataLinks}
      initializeState={reset}
      redirect={<Navigate to="/datasets" />}
    >
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
    </AdvancedSearchList>
  );
};

export const FieldsForDatasetsAdvancedSearch = ({
  labelLg1,
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
  creator: string;
  disseminationStatus: string;
  validationStatus: string;
  wasGeneratedIRIs: string;
  created: string;
  updated: string;
  handleChange: (property: string, stateChange: string) => void;
  seriesOperationsOptions: Options;
}) => {
  return (
    <>
      <div className="row form-group">
        <div className="col-md-12">
          <label className="w-100">{D.labelTitle}</label>
          <TextInput value={labelLg1} onChange={(e) => handleChange("labelLg1", e.target.value)} />
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
          <label className="w-100">{D.validationStatusTitle}</label>
          <Select
            value={validationStatus}
            options={validateStateOptions}
            onChange={(value) => handleChange("validationStatus", value)}
          />
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-3">
          <label className="w-100">{D.createdDateTitle}</label>
          <DatePicker value={created} onChange={(value) => handleChange("created", value ?? "")} />
        </div>
        <div className="col-md-3">
          <label className="w-100">{D.modifiedDateTitle}</label>
          <DatePicker value={updated} onChange={(value) => handleChange("updated", value ?? "")} />
        </div>
        <Column>
          <label className="w-100">{D.generatedBy}</label>
          <Select
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
        </Column>
      </div>
    </>
  );
};
