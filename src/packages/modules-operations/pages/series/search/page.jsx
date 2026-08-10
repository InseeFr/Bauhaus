import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { AdvancedSearchCard } from "@components/advanced-search/fields";
import { AdvancedSearchList } from "@components/advanced-search/home";
import { CreatorsInput } from "@components/business/creators-input";
import { OrganisationInput } from "@components/business/stamps-input/stamps-input";
import { Loading } from "@components/loading";
import { SearchTextField } from "@components/ui/search-field";

import { OperationsApi } from "@sdk/operations-api";

import { useTitle } from "@utils/hooks/useTitle";
import useUrlQueryParameters from "@utils/hooks/useUrlQueryParameters";

import D from "../../../../deprecated-locales";
import { filterKeyDeburr } from "../../../../utils/array-utils";
import { TypeCodeInput } from "./components/typeCodeInput";

const filterLabel = filterKeyDeburr(["prefLabelLg1"]);
const filterTypeCode = filterKeyDeburr(["typeCode"]);

const defaultFormState = {
  prefLabelLg1: "",
  typeCode: "",
  creator: "",
  publisher: "",
  dataCollector: "",
};

export const SearchFormList = ({ data }) => {
  const { form, reset, handleChange } = useUrlQueryParameters(defaultFormState);

  const { prefLabelLg1, typeCode, creator, publisher, dataCollector } = form;

  const filteredData = data
    .filter(filterLabel(prefLabelLg1))
    .filter(filterTypeCode(typeCode))
    .filter((series) => {
      const creators = series.creators || [];
      const formattedCreators = Array.isArray(creators) ? creators : [creators];

      return !creator || formattedCreators.includes(creator);
    })
    .filter((series) => {
      const publishers = series.publishers || [];
      const formattedPublishers = Array.isArray(publishers) ? publishers : [publishers];

      return !publisher || formattedPublishers.map(({ id }) => id).includes(publisher);
    })
    .filter((series) => {
      const dataCollectors = series.dataCollectors || [];
      const formattedDataCollectors = Array.isArray(dataCollectors)
        ? dataCollectors
        : [dataCollectors];
      return !dataCollector || formattedDataCollectors.map(({ id }) => id).includes(dataCollector);
    });

  const dataLinks = filteredData.map(({ id, prefLabelLg1 }) => (
    <li key={id} className="list-group-item">
      <Link to={`/operations/series/${id}`}>{prefLabelLg1}</Link>
    </li>
  ));
  return (
    <AdvancedSearchList
      title={D.seriesSearchTitle}
      data={dataLinks}
      initializeState={reset}
      redirect={<Navigate to="/operations/series" />}
    >
      <AdvancedSearchCard className="series-search-form">
        <SearchTextField
          label={D.labelTitle}
          value={prefLabelLg1}
          onChange={(value) => handleChange("prefLabelLg1", value)}
          placeholder={D.searchLabelPlaceholder}
        />
        <div className="field col-12 md:col-6">
          <TypeCodeInput value={typeCode} onChange={(value) => handleChange("typeCode", value)} />
        </div>
        <div className="field col-12 md:col-6">
          <CreatorsInput
            mode="organisation"
            lang="default"
            value={creator}
            required={false}
            onChange={(value) => {
              handleChange("creator", value);
            }}
          />
        </div>
        <div className="field col-12 md:col-6">
          <OrganisationInput
            lang="default"
            labelSingle={D.organisation}
            labelMulti={D.organisation}
            value={publisher}
            required={false}
            onChange={(value) => {
              handleChange("publisher", value);
            }}
          />
        </div>
        <div className="field col-12 md:col-6">
          <OrganisationInput
            lang="default"
            labelSingle={D.dataCollector}
            labelMulti={D.dataCollector}
            value={dataCollector}
            required={false}
            onChange={(value) => {
              handleChange("dataCollector", value);
            }}
          />
        </div>
      </AdvancedSearchCard>
    </AdvancedSearchList>
  );
};

export const Component = () => {
  useTitle(D.seriesTitle + " - " + D.operationsTitle, D.advancedSearch);
  const [data, setData] = useState();

  useEffect(() => {
    OperationsApi.getSeriesSearchList().then(setData);
  }, []);

  if (!data) return <Loading />;
  return <SearchFormList data={data} />;
};
