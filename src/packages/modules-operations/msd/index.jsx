import { useCallback, useEffect, useMemo, useState } from "react";
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
import "./msd.scss";
import { DocumentsStoreProvider } from "./pages/sims-creation/documents-store-context";
import { useDocumentsList } from "./pages/sims-creation/useDocumentsList";
import { isEssentialRubricKo } from "./sims-field-title";
import { getParentId, getParentType } from "./utils";

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
  const [parent, setParent] = useState();
  const [parentLoading, setParentLoading] = useState(true);
  const { documentStores, setDocumentStores } = useDocumentsList();
  const [rubricIdForNewDocument, setRubricIdForNewDocument] = useState();
  const goBack = useGoBack();

  const [exportPending, setExportPending] = useState(false);
  const [owners, setOwners] = useState([]);
  const [missingDocuments, setMissingDocuments] = useState(new Set());

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
    (simsData, callback) => {
      saveSimsMutation(simsData).then((resultId) => {
        callback(resultId);
      });
    },
    [saveSimsMutation],
  );

  const publishSims = useCallback(
    (simsData) => {
      return publishSimsMutation(simsData);
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
    if (parentType === "indicator") {
      OperationsApi.getIndicatorById(idParent)
        .then((payload) => setParent(payload))
        .finally(() => setParentLoading(false));
    } else if (parentType === "operation") {
      OperationsApi.getOperation(idParent)
        .then((payload) => setParent(payload))
        .finally(() => setParentLoading(false));
    } else if (parentType === "series") {
      OperationsApi.getSerie(idParent)
        .then((payload) => setParent(payload))
        .finally(() => setParentLoading(false));
    } else {
      setParentLoading(false);
    }
  }, [idParent, parentType]);

  useEffect(() => {
    if (id) {
      OperationsApi.getOwners(id).then((ownersData) => {
        setOwners(ownersData);
      });
    }
  }, [id]);

  const exportCallback = useCallback((exportId, config, exportSims) => {
    setExportPending(true);
    setMissingDocuments(new Set());
    OperationsApi.exportSims(exportId, config, exportSims).then((missingDocs) => {
      setExportPending(false);
      setMissingDocuments(missingDocs);
    });
  }, []);

  const isEditMode = mode === CREATE || mode === UPDATE;

  const essentialRubricContext = useMemo(() => {
    if (mode !== VIEW && !isEditMode) {
      return {};
    }

    const makeMetadatastructureFlat = (items) => {
      if (!items || items.length === 0) {
        return items;
      }
      return [
        ...items,
        ...makeMetadatastructureFlat(items.map((item) => Object.values(item.children)).flat()),
      ];
    };

    const flatMetadataStructure = makeMetadatastructureFlat(Object.values(metadataStructure));

    return flatMetadataStructure.reduce((acc, msd) => {
      const msdCopy = { ...msd };
      if (msdCopy.minOccurs === "1") {
        msdCopy.essentialRubricKoLg1 = isEssentialRubricKo(
          msdCopy,
          currentSims.rubrics?.[msdCopy.idMas],
          false,
        );
        msdCopy.essentialRubricKoLg2 = isEssentialRubricKo(
          msdCopy,
          currentSims.rubrics?.[msdCopy.idMas],
          true,
        );
      }
      return {
        ...acc,
        [msdCopy.idMas]: msdCopy,
      };
    }, {});
  }, [mode, isEditMode, metadataStructure, currentSims.rubrics]);

  const [lateralPanelOpened, setLateralPanelOpened] = useState();

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
        onLateralPanelHide: () => setLateralPanelOpened(undefined),
        openLateralPanelOpened: (type) => setLateralPanelOpened(type),
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
