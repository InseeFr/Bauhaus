import { useCallback, useEffect, useMemo, useReducer } from "react";
import { useLoaderData, useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { Loading } from "@components/loading";
import { PageTitleBlock } from "@components/page-title-block";

import { OperationsApi } from "@sdk/operations-api";

import { useOrganizations } from "@utils/hooks/organizations";
import { useGoBack } from "@utils/hooks/useGoBack";

import { DOCUMENT, LINK } from "../../../../constants/documentType";
import { useCodesLists } from "../../../hooks/useCodesLists";
import { useMetadataStructure } from "../../../hooks/useMetadataStructure";
import { useSaveSims, useSims } from "../../../hooks/useSims";
import { SimsLoaderData } from "../../../types/sims";
import { MSDComponent as MSDLayout } from "../components/MSDComponent";
import { CREATE, UPDATE } from "../constants";
import { DocumentsStoreProvider } from "../hooks/useDocumentsStoreContext";
import { useDocumentsList } from "../hooks/useDocumentsList";
import {
  computeEssentialRubricContext,
  EssentialRubricContextProvider,
} from "../hooks/useEssentialRubricContext";
import { getParentId } from "./utils/getParentId";
import { getParentType } from "./utils/getParentType";
import { AdvancedSimsCreation as SimsCreation } from "./components/AdvancedSimsCreation";

const apiByParentType: Record<string, (id: string) => Promise<any>> = {
  indicator: OperationsApi.getIndicatorById,
  operation: OperationsApi.getOperation,
  series: OperationsApi.getSerie,
};

interface State {
  parent: any;
  parentLoading: boolean;
  rubricIdForNewDocument: { rubric: string; lang: string } | null;
  serverError: unknown;
  lateralPanelOpened: typeof DOCUMENT | typeof LINK | undefined;
}

const initialState: State = {
  parent: undefined,
  parentLoading: true,
  rubricIdForNewDocument: null,
  serverError: undefined,
  lateralPanelOpened: undefined,
};

type Action =
  | { type: "SET_PARENT"; parent: any }
  | { type: "SET_PARENT_LOADING"; loading: boolean }
  | { type: "SET_SERVER_ERROR"; error: unknown }
  | { type: "SET_RUBRIC_ID_FOR_NEW_DOCUMENT"; id: { rubric: string; lang: string } | null }
  | { type: "SET_LATERAL_PANEL_OPENED"; panelType: typeof DOCUMENT | typeof LINK | undefined };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_PARENT":
      return { ...state, parent: action.parent };
    case "SET_PARENT_LOADING":
      return { ...state, parentLoading: action.loading };
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

export const Component = () => {
  const { t } = useTranslation();
  const {
    baseUrl,
    mode,
    disableSectionAnchor,
    parentType: parentTypeProp,
  } = (useLoaderData() as SimsLoaderData) ?? {};
  const params = useParams();
  const { data: organisations } = useOrganizations();
  const { isLoading: metadataStructureLoading, metadataStructure } = useMetadataStructure();
  const { codesLists } = useCodesLists(metadataStructure);
  const simsId = mode === UPDATE ? params.id : undefined;
  const { isLoading: simsLoading, sims } = useSims(simsId);
  const { mutateAsync: saveSimsMutation } = useSaveSims();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { parent, parentLoading, rubricIdForNewDocument, serverError, lateralPanelOpened } = state;
  const { documentStores, setDocumentStores } = useDocumentsList();
  const setRubricIdForNewDocument = useCallback(
    (id: { rubric: string; lang: string } | null) =>
      dispatch({ type: "SET_RUBRIC_ID_FOR_NEW_DOCUMENT", id }),
    [],
  );
  const goBack = useGoBack();

  const idParent = mode === CREATE ? params.idParent : sims && getParentId(sims);
  const parentType = mode === CREATE ? parentTypeProp : sims && getParentType(sims);

  const saveSims = useCallback(
    (simsData: any, callback: (resultId: any) => void, errorCallback: () => void) => {
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

  const currentSims =
    mode === CREATE
      ? {
          labelLg1: t("sims.simsTitle", { lng: "fr" }) + parent?.prefLabelLg1,
          labelLg2: t("sims.simsTitle", { lng: "en" }) + parent?.prefLabelLg2,
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

  const essentialRubricContext = useMemo(
    () => computeEssentialRubricContext(metadataStructure, currentSims.rubrics),
    [metadataStructure, currentSims.rubrics],
  );

  if (parentLoading) return <Loading />;

  if (metadataStructureLoading || (mode === UPDATE && simsLoading)) return <Loading />;

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
        storeCollapseState={false}
        baseUrl={baseUrl ?? ""}
        disableSectionAnchor={disableSectionAnchor ?? false}
      >
        <PageTitleBlock titleLg1={currentSims.labelLg1} titleLg2={currentSims.labelLg2} />
        <EssentialRubricContextProvider value={essentialRubricContext}>
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
        </EssentialRubricContextProvider>
      </MSDLayout>
    </DocumentsStoreProvider>
  );
};
