import { useCallback, useEffect, useMemo, useReducer } from "react";
import { useLoaderData, useParams } from "react-router-dom";

import { Loading } from "@components/loading";
import { PageTitleBlock } from "@components/page-title-block";

import { OperationsApi } from "@sdk/operations-api";

import { useOrganizations } from "@utils/hooks/organizations";

import { useCodesLists } from "../../../hooks/useCodesLists";
import { useMetadataStructure } from "../../../hooks/useMetadataStructure";
import { usePublishSims, useSims } from "../../../hooks/useSims";
import { SimsLoaderData } from "../../../types/sims";
import { MSDComponent as MSDLayout } from "../components/MSDComponent";
import { DocumentsStoreProvider } from "../hooks/useDocumentsStoreContext";
import { useDocumentsList } from "../hooks/useDocumentsList";
import {
  computeEssentialRubricContext,
  EssentialRubricContextProvider,
} from "../hooks/useEssentialRubricContext";
import { SimsVisualisation } from "./components/SimsVisualisation";

interface State {
  owners: any[];
  exportPending: boolean;
  missingDocuments: Set<any>;
}

const initialState: State = {
  owners: [],
  exportPending: false,
  missingDocuments: new Set(),
};

type Action =
  | { type: "SET_OWNERS"; owners: any[] }
  | { type: "EXPORT_STARTED" }
  | { type: "EXPORT_FINISHED"; missingDocuments: Set<any> };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_OWNERS":
      return { ...state, owners: action.owners };
    case "EXPORT_STARTED":
      return { ...state, exportPending: true, missingDocuments: new Set() };
    case "EXPORT_FINISHED":
      return {
        ...state,
        exportPending: false,
        missingDocuments: action.missingDocuments,
      };
    default:
      return state;
  }
}

export const Component = () => {
  const { baseUrl, disableSectionAnchor } = (useLoaderData() as SimsLoaderData) ?? {};

  const { id } = useParams();

  const { data: organisations } = useOrganizations();

  const { isLoading: metadataStructureLoading, metadataStructure } = useMetadataStructure();

  const { codesLists } = useCodesLists(metadataStructure);

  const { isLoading: simsLoading, sims } = useSims(id);

  const { mutateAsync: publishSimsMutation } = usePublishSims();

  const { documentStores, setDocumentStores } = useDocumentsList();

  const [state, dispatch] = useReducer(reducer, initialState);

  const { owners, exportPending, missingDocuments } = state;

  useEffect(() => {
    if (id) {
      OperationsApi.getOwners(id).then((ownersData: any) => {
        dispatch({ type: "SET_OWNERS", owners: ownersData });
      });
    }
  }, [id]);

  const publishSims = useCallback(
    (simsData: any, errorCallback: (error: unknown) => void) => {
      publishSimsMutation(simsData).catch((error) => {
        errorCallback?.(error);
      });
    },
    [publishSimsMutation],
  );

  const exportCallback = useCallback((exportId: any, config: any, exportSims: any) => {
    dispatch({ type: "EXPORT_STARTED" });
    OperationsApi.exportSims(exportId, config, exportSims).then((missingDocs: any) => {
      dispatch({ type: "EXPORT_FINISHED", missingDocuments: missingDocs });
    });
  }, []);

  const currentSims = sims || {};

  const essentialRubricContext = useMemo(
    () => computeEssentialRubricContext(metadataStructure, currentSims.rubrics),
    [metadataStructure, currentSims.rubrics],
  );

  if (metadataStructureLoading || simsLoading) return <Loading />;

  if (exportPending) return <Loading />;

  return (
    <DocumentsStoreProvider
      value={{
        documentStores,
        updateDocumentStores: setDocumentStores,
        rubricIdForNewDocument: null,
        setRubricIdForNewDocument: () => {},
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
        </EssentialRubricContextProvider>
      </MSDLayout>
    </DocumentsStoreProvider>
  );
};
