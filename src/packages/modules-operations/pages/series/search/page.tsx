import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Navigate } from "react-router-dom";

import { AdvancedSearchCard } from "@components/advanced-search/fields";
import { AdvancedSearchList } from "@components/advanced-search/home";
import { CreatorsInput } from "@components/business/creators-input";
import { OrganizationInput } from "@components/business/stamps-input/stamps-input";
import { Loading } from "@components/loading";
import { List } from "@components/ui/list-group";
import { SearchTextField } from "@components/ui/search-field";

import { OperationsApi } from "@sdk/operations-api";

import { filterKeyDeburr } from "@utils/array-utils";
import { useTitle } from "@utils/hooks/useTitle";
import { useUrlQueryParameters } from "@utils/hooks/useUrlQueryParameters";

import { TypeCodeInput } from "./components/TypeCodeInput";

/**
 * Série telle que renvoyée par `GET /series/advanced-search` : une projection
 * des champs de série utilisés comme critères de recherche. `creators`,
 * `publishers` et `dataCollectors` peuvent être un objet unique ou un tableau
 * selon le nombre de valeurs, comme posé par le back.
 */
interface SeriesSearchItem {
  id: string;
  prefLabelLg1: string;
  typeCode?: string;
  creators?: string | string[];
  publishers?: { id: string } | { id: string }[];
  dataCollectors?: { id: string } | { id: string }[];
}

const filterLabel = filterKeyDeburr(["prefLabelLg1"]);

const filterTypeCode = filterKeyDeburr(["typeCode"]);

const defaultFormState = {
  prefLabelLg1: "",
  typeCode: "",
  creator: "",
  publisher: "",
  dataCollector: "",
};

export const SearchFormList = ({ data }: Readonly<{ data: SeriesSearchItem[] }>) => {
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
            mode="organization"
            lang="default"
            value={creator}
            required={false}
            onChange={(value) => {
              handleChange("creator", value as string);
            }}
          />
        </div>
        <div className="field col-12 md:col-6">
          <OrganizationInput
            lang="default"
            labelSingle={t("common.organization")}
            labelMulti={t("common.organization")}
            value={publisher}
            required={false}
            onChange={(value) => {
              handleChange("publisher", value as string);
            }}
          />
        </div>
        <div className="field col-12 md:col-6">
          <OrganizationInput
            lang="default"
            labelSingle={t("common.dataCollector")}
            labelMulti={t("common.dataCollector")}
            value={dataCollector}
            required={false}
            onChange={(value) => {
              handleChange("dataCollector", value as string);
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

  const [data, setData] = useState<SeriesSearchItem[]>();

  useEffect(() => {
    OperationsApi.getSeriesSearchList().then(setData);
  }, []);

  if (!data) return <Loading />;

  return <SearchFormList data={data} />;
};
