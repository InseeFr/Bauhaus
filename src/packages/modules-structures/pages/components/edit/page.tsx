import { useReducer, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { Loading, Saving } from "@components/loading";
import { PageTitle } from "@components/page-title";
import { PageTitleBlock } from "@components/page-title-block";

import { Component as StructureComponent } from "@model/structures/Component";

import { ConceptsApi, saveComponent, StructureApi } from "@sdk/index";

import { useGoBack } from "@utils/hooks/useGoBack";

import { ComponentDetailEdit } from "../../../components/ComponentDetailEdit";
import { useFormattedCodelist } from "../../../hooks/useFormattedCodelist";

type EditContainerState = {
  loading: boolean;
  saving: boolean;
  component: any;
  concepts: any[];
  serverSideError: string;
  attributes: any[];
};

type EditContainerAction =
  | {
      type: "LOAD_SUCCESS";
      component: any;
      attributes: any[];
      concepts: any[];
    }
  | { type: "LOAD_FINISHED" }
  | { type: "SAVE_STARTED" }
  | { type: "SAVE_FAILED"; component: any; error: string }
  | { type: "SAVE_FINISHED" };

const initialState: EditContainerState = {
  loading: true,
  saving: false,
  component: {},
  concepts: [],
  serverSideError: "",
  attributes: [],
};

function editContainerReducer(
  state: EditContainerState,
  action: EditContainerAction,
): EditContainerState {
  switch (action.type) {
    case "LOAD_SUCCESS":
      return {
        ...state,
        component: action.component,
        attributes: action.attributes,
        concepts: action.concepts,
      };
    case "LOAD_FINISHED":
      return { ...state, loading: false };
    case "SAVE_STARTED":
      return { ...state, saving: true, serverSideError: "" };
    case "SAVE_FAILED":
      return {
        ...state,
        component: action.component,
        serverSideError: action.error,
      };
    case "SAVE_FINISHED":
      return { ...state, saving: false };
    default:
      return state;
  }
}

export const Component = (props: any) => {
  const { t } = useTranslation();

  const goBack = useGoBack();

  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const urlParams = new URLSearchParams(window.location.search);

  const type = urlParams.get("type");

  const { data: codelists = [] } = useFormattedCodelist();

  const [state, dispatch] = useReducer(editContainerReducer, initialState);
  const { loading, saving, component, concepts, serverSideError, attributes } = state;

  const handleBack = useCallback(() => goBack("/structures/components"), [goBack]);

  const handleSave = useCallback(
    (component: StructureComponent) => {
      dispatch({ type: "SAVE_STARTED" });
      saveComponent(component)
        .then((id = component.id) => goBack(`/structures/components/${id}`, !component.id))
        .catch((error: string) => {
          dispatch({ type: "SAVE_FAILED", component, error });
        })
        .finally(() => dispatch({ type: "SAVE_FINISHED" }));
    },
    [goBack],
  );

  useEffect(() => {
    const getComponent = id ? StructureApi.getMutualizedComponent(id) : Promise.resolve({});
    Promise.all([
      getComponent,
      StructureApi.getMutualizedAttributes(),
      ConceptsApi.getConceptList(),
    ])
      .then(([component, attributes, concepts]) => {
        dispatch({ type: "LOAD_SUCCESS", component, attributes, concepts });
      })
      .finally(() => dispatch({ type: "LOAD_FINISHED" }));
  }, [id]);

  if (loading) return <Loading />;

  if (saving) return <Saving />;

  return (
    <>
      {isEditing ? (
        <PageTitleBlock titleLg1={component.labelLg1} titleLg2={component.labelLg2} />
      ) : (
        <PageTitle title={t("component.creationPageTitle")} />
      )}
      <ComponentDetailEdit
        {...props}
        col={2}
        codelists={codelists}
        component={component}
        concepts={concepts}
        handleBack={handleBack}
        handleSave={handleSave}
        mutualized={true}
        attributes={attributes}
        serverSideError={serverSideError}
        type={type === "ALL" ? undefined : type}
      />
    </>
  );
};
