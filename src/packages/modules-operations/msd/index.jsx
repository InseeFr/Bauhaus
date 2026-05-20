import { useCallback, useEffect, useMemo, useReducer } from "react";
import { useLoaderData, useParams } from "react-router-dom";

import { Loading } from "@components/loading";
import { PageTitleBlock } from "@components/page-title-block";

import { OperationsApi } from "@sdk/operations-api";

import { useOrganizations } from "@utils/hooks/organizations";
import { useGoBack } from "@utils/hooks/useGoBack";

import { D1, D2 } from "../../deprecated-locales";
import { useCodesLists } from "../hooks/useCodesLists";
import { useMetadataStructure } from "../hooks/useMetadataStructure";
import { usePublishSims, useSaveSims, useSims } from "../hooks/useSims";
import MSDLayout from "../msd/layout";
import MSDHelp from "../msd/pages/help";
import SimsCreation from "../msd/pages/sims-creation";
import SimsVisualisation from "../msd/pages/sims-visualisation";
import { CREATE, HELP, UPDATE, VIEW } from "./constant";
import { SimsContextProvider } from "./context";
import { computeEssentialRubricContext } from "./essential-rubric-context";
import "./msd.scss";
import { DocumentsStoreProvider } from "./pages/sims-creation/documents-store-context";
import { useDocumentsList } from "./pages/sims-creation/useDocumentsList";
import { getParentId, getParentType } from "./utils";

const apiByParentType = {
  indicator: OperationsApi.getIndicatorById,
  operation: OperationsApi.getOperation,
  series: OperationsApi.getSerie,
};

const initialMsdState = {
  parent: undefined,
  parentLoading: true,
  rubricIdForNewDocument: undefined,
  exportPending: false,
  owners: [],
  missingDocuments: new Set(),
  serverError: undefined,
  lateralPanelOpened: undefined,
};

function msdReducer(state, action) {
  switch (action.type) {
    case "SET_PARENT":
      return { ...state, parent: action.parent };
    case "SET_PARENT_LOADING":
      return { ...state, parentLoading: action.loading };
    case "SET_OWNERS":
      return { ...state, owners: action.owners };
    case "EXPORT_STARTED":
      return { ...state, exportPending: true, missingDocuments: new Set() };
    case "EXPORT_FINISHED":
      return { ...state, exportPending: false, missingDocuments: action.missingDocuments };
    case "SET_SERVER_ERROR":
      return { ...state, serverError: action.error };
    case "SET_RUBRIC_ID_FOR_NEW_DOCUMENT":
      return { ...state, rubricIdForNewDocument: action.id };
    case "SET_LATERAL_PANEL_OPENED":
      return { ...state, lateralPanelOpened: action.panelType };
    default:
      return state;
  }
}

const MSDContainer = ({
  mode = HELP,
  baseUrl,
  disableSectionAnchor,
  params,
  parentType: parentTypeProp,
}) => {
  const { data: organisations } = useOrganizations();
  const { isLoading: metadataStructureLoading, metadataStructure } = useMetadataStructure();
  const { codesLists } = useCodesLists();
  const simsId = mode === VIEW || mode === UPDATE ? params.id : undefined;
  const { isLoading: simsLoading, sims } = useSims(simsId);
  const { mutateAsync: saveSimsMutation } = useSaveSims();
  const { mutateAsync: publishSimsMutation } = usePublishSims();
  const simsParentType = sims ? getParentType(sims) : undefined;
  const simsIdParent = sims ? getParentId(sims) : undefined;
  const [state, dispatch] = useReducer(msdReducer, initialMsdState);
  const {
    parent,
    parentLoading,
    rubricIdForNewDocument,
    exportPending,
    owners,
    missingDocuments,
    serverError,
    lateralPanelOpened,
  } = state;
  const { documentStores, setDocumentStores } = useDocumentsList();
  const setRubricIdForNewDocument = useCallback(
    (id) => dispatch({ type: "SET_RUBRIC_ID_FOR_NEW_DOCUMENT", id }),
    [],
  );
  const goBack = useGoBack();

  const id = params.id;
  let idParent;
  let parentType;
  switch (mode) {
    case HELP:
      break;
    case CREATE:
      parentType = parentTypeProp;
      idParent = params.idParent;
      break;
    default:
      parentType = simsParentType;
      idParent = simsIdParent;
      break;
  }

  const saveSims = useCallback(
    (simsData, callback, errorCallback) => {
      saveSimsMutation(simsData)
        .then((resultId) => {
          callback(resultId);
        })
        .catch((error) => {
          dispatch({ type: "SET_SERVER_ERROR", error });
          errorCallback();
        });
    },
    [saveSimsMutation],
  );

  const publishSims = useCallback(
    (simsData, errorCallback) => {
      publishSimsMutation(simsData).catch((error) => {
        errorCallback?.(error);
      });
    },
    [publishSimsMutation],
  );

  const currentSims =
    mode === CREATE
      ? {
          labelLg1: D1.simsTitle + parent?.prefLabelLg1,
          labelLg2: D2.simsTitle + parent?.prefLabelLg2,
        }
      : sims || {};

  useEffect(() => {
    const fetch = apiByParentType[parentType];
    if (fetch) {
      fetch(idParent)
        .then((payload) => dispatch({ type: "SET_PARENT", parent: payload }))
        .finally(() => dispatch({ type: "SET_PARENT_LOADING", loading: false }));
    } else {
      dispatch({ type: "SET_PARENT_LOADING", loading: false });
    }
  }, [idParent, parentType]);

  useEffect(() => {
    if (id) {
      OperationsApi.getOwners(id).then((ownersData) => {
        dispatch({ type: "SET_OWNERS", owners: ownersData });
      });
    }
  }, [id]);

  const exportCallback = useCallback((exportId, config, exportSims) => {
    dispatch({ type: "EXPORT_STARTED" });
    OperationsApi.exportSims(exportId, config, exportSims).then((missingDocs) => {
      dispatch({ type: "EXPORT_FINISHED", missingDocuments: missingDocs });
    });
  }, []);

  const isEditMode = mode === CREATE || mode === UPDATE;

  const essentialRubricContext = useMemo(() => {
    if (mode !== VIEW && !isEditMode) {
      return {};
    }
    return computeEssentialRubricContext(metadataStructure, currentSims.rubrics);
  }, [mode, isEditMode, metadataStructure, currentSims.rubrics]);

  if (parentLoading) return <Loading />;

  if (metadataStructureLoading || ((mode === VIEW || mode === UPDATE) && simsLoading))
    return <Loading />;

  if (exportPending) return <Loading />;

  return (
    <DocumentsStoreProvider
      value={{
        documentStores,
        updateDocumentStores: setDocumentStores,
        lateralPanelOpened,
        onLateralPanelHide: () =>
          dispatch({ type: "SET_LATERAL_PANEL_OPENED", panelType: undefined }),
        openLateralPanelOpened: (type) =>
          dispatch({ type: "SET_LATERAL_PANEL_OPENED", panelType: type }),
        rubricIdForNewDocument,
        setRubricIdForNewDocument,
      }}
    >
      <MSDLayout
        metadataStructure={metadataStructure}
        storeCollapseState={mode === HELP}
        baseUrl={baseUrl}
        disableSectionAnchor={disableSectionAnchor}
      >
        {mode !== HELP && (
          <PageTitleBlock titleLg1={currentSims.labelLg1} titleLg2={currentSims.labelLg2} />
        )}
        {mode === HELP && (
          <MSDHelp
            metadataStructure={metadataStructure}
            codesLists={codesLists}
            organisations={organisations}
          />
        )}

        {mode === VIEW && (
          <SimsContextProvider value={essentialRubricContext}>
            <SimsVisualisation
              sims={currentSims}
              metadataStructure={metadataStructure}
              codesLists={codesLists}
              organisations={organisations}
              publishSims={publishSims}
              exportCallback={exportCallback}
              missingDocuments={missingDocuments}
              owners={owners}
            />
          </SimsContextProvider>
        )}
        {isEditMode && (
          <SimsContextProvider value={essentialRubricContext}>
            <SimsCreation
              parent={parent}
              sims={currentSims}
              metadataStructure={metadataStructure}
              codesLists={codesLists}
              onSubmit={saveSims}
              idParent={idParent}
              goBack={goBack}
              mode={mode}
              organisations={organisations}
              parentType={parentType}
              error={serverError}
            />
          </SimsContextProvider>
        )}
      </MSDLayout>
    </DocumentsStoreProvider>
  );
};

const withParams = (Component) => {
  return (props) => {
    const params = useParams();
    const data = useLoaderData();

    const { baseUrl, mode, disableSectionAnchor, parentType } = data ?? {};
    return (
      <Component
        {...props}
        mode={mode}
        disableSectionAnchor={disableSectionAnchor}
        parentType={parentType}
        params={params}
        baseUrl={baseUrl}
      />
    );
  };
};

export const Component = withParams(MSDContainer);
