import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { AdvancedSearchCard } from "@components/advanced-search/fields";
import { AdvancedSearchList } from "@components/advanced-search/home";
import { CreatorsInput } from "@components/business/creators-input";
import { Loading } from "@components/loading";
import { Select } from "@components/select-rmes";
import { SearchField, SearchTextField } from "@components/ui/search-field";

import { filterKeyDeburr } from "@utils/array-utils";
import { useTitle } from "@utils/hooks/useTitle";
import useUrlQueryParameters from "@utils/hooks/useUrlQueryParameters";

import { validateStateOptions } from "../../../../model/ValidationState";
import { CodelistsApi as API } from "@sdk/index";
import { formatLabel } from "../../../utils/formatLabel";

const filterId = filterKeyDeburr(["id"]);
const filterLabel = filterKeyDeburr(["labelLg1"]);
const filterCreator = filterKeyDeburr(["creator"]);
const filterValidationState = filterKeyDeburr(["validationState"]);
const filterCode = filterKeyDeburr(["codes.code"]);
const filterCodeLabel = filterKeyDeburr(["codes.labelLg1"]);

const defaultFormState = {
  id: "",
  labelLg1: "",
  code: "",
  codeLabel: "",
  creator: "",
  validationState: "",
};

export const SearchFormList = ({ data }) => {
  const { t } = useTranslation();

  let form, reset, handleChange;
  ({ form, reset, handleChange } = useUrlQueryParameters(defaultFormState));

  const { id, labelLg1, creator, validationState, code, codeLabel } = form;

  const filteredData = data
    .filter(filterId(id))
    .filter(filterLabel(labelLg1))
    .filter(filterCode(code))
    .filter(filterCodeLabel(codeLabel))
    .filter(filterCreator(creator))
    .filter(filterValidationState(validationState));

  const dataLinks = filteredData.map((codelist) => (
    <li key={codelist.id} className="list-group-item text-left">
      <Link to={`/codelists/${codelist.id}`}>{formatLabel(codelist)}</Link>
    </li>
  ));

  return (
    <AdvancedSearchList
      title={t("codelists.searchTitle")}
      data={dataLinks}
      initializeState={reset}
      redirect={<Navigate to="/codelists" push />}
    >
      <AdvancedSearchCard title={t("codelists.title")} className="codelist-search-form">
        <SearchTextField
          label={t("codelists.identifier")}
          value={id}
          onChange={(value) => handleChange("id", value)}
        />
        <SearchTextField
          label={t("codelists.label")}
          value={labelLg1}
          onChange={(value) => handleChange("labelLg1", value)}
        />
        <div className="field col-12 md:col-6">
          <CreatorsInput
            mode="organisation"
            value={creator}
            onChange={(value) => handleChange("creator", value)}
            required={false}
          />
        </div>
        <SearchField label={t("codelists.validationStatus")} col="col-12 md:col-6">
          {(selectId) => (
            <Select
              inputId={selectId}
              placeholder=""
              value={validateStateOptions.find((option) => option.value === validationState) || ""}
              options={validateStateOptions}
              onChange={(value) => {
                handleChange("validationState", value);
              }}
            />
          )}
        </SearchField>
      </AdvancedSearchCard>
      <AdvancedSearchCard title={t("codes.title")} className="code-search-form">
        <SearchTextField
          label={t("codes.identifier")}
          value={code}
          onChange={(value) => handleChange("code", value)}
        />
        <SearchTextField
          label={t("codes.label")}
          value={codeLabel}
          onChange={(value) => handleChange("codeLabel", value)}
        />
      </AdvancedSearchCard>
    </AdvancedSearchList>
  );
};

export const Component = () => {
  const { t } = useTranslation();

  useTitle(t("codelists.searchTitle"));

  const [loading, setLoading] = useState(true);

  const [items, setItems] = useState([]);

  useEffect(() => {
    API.getCodelistsForSearch()
      .then((codelists) => {
        setItems(codelists);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

  return <SearchFormList data={items} />;
};
