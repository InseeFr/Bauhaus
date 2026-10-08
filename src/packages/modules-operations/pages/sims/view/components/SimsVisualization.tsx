import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { ActionToolbar } from "@components/action-toolbar";
import { Button } from "@components/buttons/button";
import { CancelButton } from "@components/buttons/buttons-with-icons";
import { CheckSecondLang } from "@components/check-second-lang";
import { ConfirmationDelete } from "@components/confirmation-delete";
import { CreationUpdateItems } from "@components/creation-update-items";
import { ErrorBloc } from "@components/errors-bloc";
import { Row } from "@components/layout";
import { Note } from "@components/note";
import { PublicationStatusItem } from "@components/status/PublicationStatusItem";
import { Dialog } from "@components/ui/dialog";

import { Organization } from "@model/organization";
import { Rubric, Sims } from "@model/Sims";

import { OperationsApi } from "@sdk/operations-api";

import { EMPTY_ARRAY } from "@utils/array-utils";
import { useInvalidateDocuments } from "@utils/hooks/documents";
import { useInvalidateOperations } from "@utils/hooks/operations";
import { useSecondLang } from "@utils/hooks/second-lang";
import { useInvalidateSeries } from "@utils/hooks/series";

import { useInvalidateIndicators } from "../../../../hooks/useIndicators";
import { RubricEssentialMsg } from "../../components/RubricEssentialMsg";
import { Menu } from "../menu";
import { getParentUri } from "../utils/getParentUri";
import "./SimsVisualization.css";
import { MissingDocumentsErrorBloc } from "./MissingDocumentsErrorBloc";
import { MSDInformations } from "./MSDInformations";

// Mirror of ErrorCodes.SIMS_PUBLICATION_MISSING_DOCUMENTS on the back-end : a SIMS
// publication blocked because some referenced documents are missing from storage.
const SIMS_PUBLICATION_MISSING_DOCUMENTS = "862";
const EMPTY_SET: Set<string> = new Set();

/** `params.documents` : identifiants des documents manquants, séparés par des virgules. */
const parseMissingDocuments = (documents: string | undefined): Set<string> =>
  documents ? new Set(documents.split(",")) : EMPTY_SET;

interface SimsVisualizationTypes {
  metadataStructure: Record<string, any>;
  codelists?: any;
  sims?: Sims;
  organizations?: Organization[];
  publishSims: (sims: Sims, errorCallback: (err: any) => void) => void;
  exportCallback: (id: string, config: any, sims: Sims) => void;
  missingDocuments: Set<string>;
  owners?: string[];
}

export function SimsVisualization({
  metadataStructure,
  codelists,
  sims = {} as Sims,
  organizations,
  publishSims,
  exportCallback,
  missingDocuments,
  owners = EMPTY_ARRAY,
}: Readonly<SimsVisualizationTypes>) {
  const [secondLang] = useSecondLang();

  const { t, i18n } = useTranslation();

  const [modalOpened, setModalOpened] = useState(false);

  const [exportModalOpened, setExportModalOpened] = useState(false);

  const [exportConfig, setExportConfig] = useState({
    emptyMas: true,
    lg1: true,
    lg2: true,
    document: true,
  });

  const rubrics = sims.rubrics as unknown as Record<string, Rubric>;

  const [serverSideError, setServerSideError] = useState<unknown>();

  const [publishMissingDocuments, setPublishMissingDocuments] = useState<Set<string>>(EMPTY_SET);

  const publish = useCallback(
    (object: Sims) => {
      setServerSideError(undefined);
      setPublishMissingDocuments(EMPTY_SET);
      publishSims(object, (err) => {
        if (err) {
          if (err.code === SIMS_PUBLICATION_MISSING_DOCUMENTS) {
            setPublishMissingDocuments(parseMissingDocuments(err.params?.documents));
            return;
          }
          // Refus métier traduits par le module (ex. 804, cible non publiée) ; les autres échecs,
          // dont l'indisponibilité du référentiel de diffusion, sont lus par ErrorBloc.
          if (!i18n.exists(`errors.${err.code}`)) {
            setServerSideError([err]);
            return;
          }
          const href = getParentUri(object);
          setServerSideError([t(`errors.${err.code}`, { id: err.params?.id, href })]);
        }
      });
    },
    [publishSims, t, i18n],
  );

  /**
   * Handle the deletion of a SIMS.
   */
  const navigate = useNavigate();

  const invalidateIndicators = useInvalidateIndicators();

  const invalidateSeries = useInvalidateSeries();

  const invalidateOperations = useInvalidateOperations();

  const invalidateDocuments = useInvalidateDocuments();

  const handleNo = () => {
    setModalOpened(false);
  };

  const handleYes = () => {
    setServerSideError(undefined);
    OperationsApi.deleteSims(sims)
      // La fiche de l'élément documenté (indicateur, série, opération) menait à ce SIMS (`idSims`).
      .then(() => sims.idIndicator && invalidateIndicators())
      .then(() => sims.idSeries && invalidateSeries())
      .then(() => sims.idOperation && invalidateOperations())
      // La fiche d'un document liste les SIMS qui le citent.
      .then(() => invalidateDocuments())
      .then(() => {
        setModalOpened(false);
        navigate(getParentUri(sims) ?? "");
      })
      .catch((err: unknown) => {
        // Le SDK rejette l'objet d'erreur nu { message, status } : ErrorBloc sait le rendre.
        setModalOpened(false);
        setServerSideError([err]);
      });
  };

  return (
    <>
      {modalOpened && (
        <ConfirmationDelete
          className="operations"
          handleNo={handleNo}
          handleYes={handleYes}
          message={t("documents.confirmationDelete")}
        />
      )}
      <Dialog
        className="operations"
        visible={exportModalOpened}
        onHide={() => setExportModalOpened(false)}
        header={t("app.btnExport")}
        style={{ width: "50rem", maxWidth: "95vw" }}
        blockScroll
        footer={
          <ActionToolbar>
            <CancelButton action={() => setExportModalOpened(false)} />
            <Button
              disabled={!exportConfig.lg1 && !exportConfig.lg2}
              action={() => {
                exportCallback(sims.id, exportConfig, sims);
                setExportModalOpened(false);
              }}
            >
              {t("app.btnExportValidate")}
            </Button>
          </ActionToolbar>
        }
      >
        <div className="export-modal-body">
          <Row>
            <p className="col-md-offset-1">{t("sims.exportSimsTips")}</p>
          </Row>
          <Row>
            <label className="col-md-offset-1">
              <input
                type="checkbox"
                checked={exportConfig.emptyMas}
                onChange={() =>
                  setExportConfig({
                    ...exportConfig,
                    emptyMas: !exportConfig.emptyMas,
                  })
                }
              />
              {t("sims.exportSimsIncludeEmptyMas")}
            </label>
          </Row>
          <Row>
            <label className="col-md-offset-1">
              <input
                type="checkbox"
                checked={exportConfig.lg1}
                onChange={() =>
                  setExportConfig({
                    ...exportConfig,
                    lg1: !exportConfig.lg1,
                  })
                }
              />
              {t("sims.exportSimsIncludeLg1")}
            </label>
          </Row>
          <Row>
            <label className="col-md-offset-1">
              <input
                type="checkbox"
                checked={exportConfig.lg2}
                onChange={() =>
                  setExportConfig({
                    ...exportConfig,
                    lg2: !exportConfig.lg2,
                  })
                }
              />
              {t("sims.exportSimsIncludeLg2")}
            </label>
          </Row>
          <Row>
            <label className="col-md-offset-1">
              <input
                type="checkbox"
                checked={exportConfig.document}
                onChange={() =>
                  setExportConfig({
                    ...exportConfig,
                    document: !exportConfig.document,
                  })
                }
              />
              {t("sims.exportDocument")}
            </label>
          </Row>
        </div>
      </Dialog>
      <Menu
        sims={sims}
        owners={owners}
        onExport={() => setExportModalOpened(true)}
        onDelete={() => setModalOpened(true)}
        onPublish={() => publish(sims)}
      />
      <Row>
        <MissingDocumentsErrorBloc missingDocuments={missingDocuments} />
        <MissingDocumentsErrorBloc
          missingDocuments={publishMissingDocuments}
          translationKey="documents.missingDocumentWhenPublishingSims"
        />
        <ErrorBloc error={serverSideError} />
        <CheckSecondLang />
        <RubricEssentialMsg secondLang={secondLang} />
        <Row>
          <Note
            text={
              <ul>
                <CreationUpdateItems creation={sims.created} update={sims.updated} />
                <PublicationStatusItem
                  label={t("common.simsStatus")}
                  object={sims}
                  gender="female"
                />
              </ul>
            }
            title={t("app.globalInformationsTitle")}
            alone={true}
          />
        </Row>
        {Object.values(metadataStructure).map((msd: any) => {
          return (
            <MSDInformations
              key={msd.idMas}
              msd={msd}
              firstLevel={true}
              rubrics={rubrics}
              secondLang={secondLang}
              codelists={codelists}
              organizations={organizations}
            />
          );
        })}
      </Row>
    </>
  );
}
