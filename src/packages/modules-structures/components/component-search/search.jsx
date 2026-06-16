import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

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

import { validateStateOptions } from "../../../model/ValidationState";
import D from "../../i18n/build-dictionary";
import { formatLabel } from "../../utils";

const filterLabel = filterKeyDeburr(["labelLg1"]);
const filterConcept = filterKeyDeburr(["concept"]);
const filterCreator = filterKeyDeburr(["creator"]);
const filterValidationState = filterKeyDeburr(["validationState"]);

const defaultFormState = {
  labelLg1: "",
  concept: "",
  creator: "",
  validationState: "",
};

export const SearchFormList = ({ concepts, data }) => {
  const { form, reset, handleChange } = useUrlQueryParameters(defaultFormState);

  const { labelLg1, concept, creator, validationState } = form;

  const filteredData = data
    .filter(filterConcept(concept))
    .filter(filterLabel(labelLg1))
    .filter(filterCreator(creator))
    .filter(filterValidationState(validationState));

  const conceptsOptions = ItemToSelectModel.toSelectModel(concepts);
  const dataLinks = filteredData.map((component) => (
    <li key={component.id} className="list-group-item text-left">
      <Link to={`/structures/components/${component.id}`}>{formatLabel(component)}</Link>
    </li>
  ));
  return (
    <AdvancedSearchList
      title={D.componentsSearchTitle}
      data={dataLinks}
      initializeState={reset}
      redirect={<Navigate to="/structures/components" />}
    >
      <AdvancedSearchCard className="component-search-form">
        <SearchTextField
          label={D.label}
          value={labelLg1}
          onChange={(value) => handleChange("labelLg1", value)}
        />
        <SearchField label={D.conceptTitle} col="col-12">
          {(id) => (
            <Select
              inputId={id}
              placeholder=""
              value={conceptsOptions.find((option) => option.value === concept) || ""}
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
        <SearchField label={D.componentValididationStatusTitle} col="col-12 md:col-6">
          {(id) => (
            <Select
              inputId={id}
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
    </AdvancedSearchList>
  );
};

export const Component = () => {
  useTitle(D.componentTitle, D.structuresAdvancedSearch);

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [concepts, setConcepts] = useState([]);
  useEffect(() => {
    Promise.all([StructureApi.getMutualizedComponentsForSearch(), ConceptsApi.getConceptList()])
      .then(([components, concepts]) => {
        setItems(components);
        setConcepts(concepts);
      })
      .finally(() => setLoading(false));
  }, []);
  if (loading) {
    return <Loading />;
  }
  return <SearchFormList data={items} concepts={concepts} />;
};
