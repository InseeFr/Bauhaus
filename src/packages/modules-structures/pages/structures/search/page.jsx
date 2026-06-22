import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { AdvancedSearchCard } from "@components/advanced-search/fields";
import { AdvancedSearchList } from "@components/advanced-search/home";
import { CreatorsInput } from "@components/business/creators-input";
import { Loading } from "@components/loading";
import { Select } from "@components/select-rmes";
import { SearchField, SearchTextField } from "@components/ui/search-field";

import { ConceptsApi, StructureApi } from "@sdk/index";

import { filterKeyDeburr } from "@utils/array-utils";
import { useTitle } from "@utils/hooks/useTitle";
import useUrlQueryParameters from "@utils/hooks/useUrlQueryParameters";
import * as ItemToSelectModel from "@utils/item-to-select-model";

import { validateStateOptions } from "../../../../model/ValidationState";
import { COMPONENT_TYPES } from "../../../constants";

const filterLabelLg1 = filterKeyDeburr(["labelLg1"]);
const filterCreator = filterKeyDeburr(["creator"]);
const filterValidationState = filterKeyDeburr(["validationState"]);

const filterComponentLabelLg1 = filterKeyDeburr(["components.labelLg1"]);
const filterType = filterKeyDeburr(["components.type"]);
const filterConcept = filterKeyDeburr(["components.concept"]);

const defaultFormState = {
  labelLg1: "",
  componentLabelLg1: "",
  type: "",
  concept: "",
  creator: "",
  validationState: "",
};

const SearchFormList = ({ concepts, data }) => {
  const { t } = useTranslation();

  const { form, reset, handleChange } = useUrlQueryParameters(defaultFormState);

  const {
    labelLg1,
    componentLabelLg1,
    type,
    concept,
    creator,
    validationState,
  } = form;

  const conceptsOptions = ItemToSelectModel.toSelectModel(concepts);

  const filteredData = data
    .filter(filterLabelLg1(labelLg1))
    .filter(filterComponentLabelLg1(componentLabelLg1))
    .filter(filterType(type))
    .filter(filterConcept(concept))
    .filter(filterCreator(creator))
    .filter(filterValidationState(validationState));

  const dataLinks = filteredData.map(({ id, labelLg1 }) => (
    <li key={id} className="list-group-item text-left">
      <Link to={"/structures/" + id}>{labelLg1}</Link>
    </li>
  ));

  return (
    <AdvancedSearchList
      title={t("structure.searchTitle")}
      data={dataLinks}
      initializeState={reset}
      redirect={<Navigate to="/structures" />}
    >
      <AdvancedSearchCard className="structure-search-form">
        <SearchTextField
          label={t("structure.label")}
          value={labelLg1}
          onChange={(value) => handleChange("labelLg1", value)}
        />
        <SearchTextField
          label={t("structure.componentLabel")}
          value={componentLabelLg1}
          onChange={(value) => handleChange("componentLabelLg1", value)}
        />
        <SearchField label={t("component.type.title")} col="col-12 md:col-6">
          {(id) => (
            <Select
              inputId={id}
              placeholder=""
              value={
                COMPONENT_TYPES.find((option) => option.value === type) || ""
              }
              options={COMPONENT_TYPES}
              onChange={(value) => {
                handleChange("type", value);
              }}
            />
          )}
        </SearchField>
        <SearchField label={t("component.concept")} col="col-12 md:col-6">
          {(id) => (
            <Select
              inputId={id}
              placeholder=""
              value={
                conceptsOptions.find((option) => option.value === concept) || ""
              }
              options={conceptsOptions}
              onChange={(value) => {
                handleChange("concept", value);
              }}
            />
          )}
        </SearchField>
        <div className="field col-12 md:col-6">
          <CreatorsInput
            mode="organisation"
            value={creator}
            onChange={(value) => handleChange("creator", value)}
            required={false}
          />
        </div>
        <SearchField
          label={t("structure.validationStatus")}
          col="col-12 md:col-6"
        >
          {(id) => (
            <Select
              inputId={id}
              placeholder=""
              value={
                validateStateOptions.find(
                  (option) => option.value === validationState,
                ) || ""
              }
              options={validateStateOptions}
              onChange={(value) => {
                handleChange("validationState", value);
              }}
            />
          )}
        </SearchField>
      </AdvancedSearchCard>
    </AdvancedSearchList>
  );
};

export const Component = () => {
  const { t } = useTranslation();

  useTitle(t("structure.searchTitle"));

  const [loading, setLoading] = useState(true);

  const [items, setItems] = useState([]);

  const [concepts, setConcepts] = useState([]);

  useEffect(() => {
    Promise.all([
      StructureApi.getStructuresForSearch(),
      ConceptsApi.getConceptList(),
    ])
      .then(([structures, concepts]) => {
        setItems(structures);
        setConcepts(concepts);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

  return <SearchFormList data={items} concepts={concepts} />;
};
