import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { AdvancedSearchList } from "@components/advanced-search/home";
import { TextInput } from "@components/form/input";
import { Column } from "@components/layout";
import { Loading } from "@components/loading";
import { Select } from "@components/select-rmes";

import { ConceptsApi, StructureApi } from "@sdk/index";

import { filterKeyDeburr } from "@utils/array-utils";
import { useStampsOptions } from "@utils/hooks/stamps";
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

export const SearchFormList = ({ concepts, stampListOptions, data }) => {
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
      <div className="row form-group">
        <div className="col-md-12">
          <label className="w-100">
            {D.label}
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
            {D.conceptTitle}

            <Select
              placeholder=""
              value={conceptsOptions.find((option) => option.value === concept) || ""}
              options={conceptsOptions}
              onChange={(value) => {
                handleChange("concept", value);
              }}
            />
          </label>
        </div>
      </div>
      <div className="row form-group">
        <Column>
          <label className="w-100">
            {D.creator}
            <Select
              placeholder=""
              value={stampListOptions.find((option) => option.value === creator) || ""}
              options={stampListOptions}
              onChange={(value) => {
                handleChange("creator", value);
              }}
            />
          </label>
        </Column>
        <Column>
          <label className="w-100">
            {D.componentValididationStatusTitle}
            <Select
              placeholder=""
              value={validateStateOptions.find((option) => option.value === validationState) || ""}
              options={validateStateOptions}
              onChange={(value) => {
                handleChange("validationState", value);
              }}
            />
          </label>
        </Column>
      </div>
    </AdvancedSearchList>
  );
};

export const Component = () => {
  useTitle(D.componentTitle, D.structuresAdvancedSearch);

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const stampListOptions = useStampsOptions();
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
  return <SearchFormList data={items} concepts={concepts} stampListOptions={stampListOptions} />;
};
