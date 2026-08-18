import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate } from "react-router-dom";

import { AdvancedSearchCard } from "@components/advanced-search/fields";
import { AdvancedSearchList } from "@components/advanced-search/home";
import { CreatorsInput } from "@components/business/creators-input";
import { OrganisationInput } from "@components/business/stamps-input/stamps-input";
import { Loading } from "@components/loading";
import { List } from "@components/ui/list-group";
import { SearchTextField } from "@components/ui/search-field";

import { OperationsApi } from "@sdk/operations-api";

import { useTitle } from "@utils/hooks/useTitle";
import useUrlQueryParameters from "@utils/hooks/useUrlQueryParameters";

import { filterKeyDeburr } from "../../../../utils/array-utils";
import { TypeCodeInput } from "./components/TypeCodeInput";

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
  const { t } = useTranslation();

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
    <List.Item key={id}>
      <Link to={`/operations/series/${id}`}>{prefLabelLg1}</Link>
    </List.Item>
  ));

  return (
    <AdvancedSearchList
      title={t("series.searchTitle")}
      data={dataLinks}
      initializeState={reset}
      redirect={<Navigate to="/operations/series" />}
    >
      <AdvancedSearchCard className="series-search-form">
        <SearchTextField
          label={t("app.labelTitle")}
          value={prefLabelLg1}
          onChange={(value) => handleChange("prefLabelLg1", value)}
          placeholder={t("app.searchLabelPlaceholder")}
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
            labelSingle={t("common.organisation")}
            labelMulti={t("common.organisation")}
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
            labelSingle={t("common.dataCollector")}
            labelMulti={t("common.dataCollector")}
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
  const { t } = useTranslation();

  useTitle(t("common.seriesTitle") + " - " + t("common.operationsTitle"), t("app.advancedSearch"));

  const [data, setData] = useState();

  useEffect(() => {
    OperationsApi.getSeriesSearchList().then(setData);
  }, []);

  if (!data) return <Loading />;

  return <SearchFormList data={data} />;
};
