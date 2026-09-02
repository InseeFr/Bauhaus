import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

import { ActionToolbar } from "@components/action-toolbar";
import { Button } from "@components/buttons/button";
import { CancelButton, CloseIconButton } from "@components/buttons/buttons-with-icons";
import { CheckSecondLang } from "@components/check-second-lang";
import { ConfirmationDelete } from "@components/confirmation-delete";
import { CreationUpdateItems } from "@components/creation-update-items";
import { ErrorBloc } from "@components/errors-bloc";
import { Row } from "@components/layout";
import { Note } from "@components/note";
import { Panel } from "@components/panel";
import { PublicationStatusItem } from "@components/status/PublicationStatusItem";

import { OperationsApi } from "@sdk/operations-api";

import { EMPTY_ARRAY } from "@utils/array-utils";
import { useSecondLang } from "@utils/hooks/second-lang";

import { RubricEssentialMsg } from "../../components/RubricEssentialMsg";
import { SimsFieldTitle } from "../../components/SimsFieldTitle";
import { hasLabelLg2 } from "../../utils/hasLabelLg2";
import { shouldDisplayTitleForPrimaryItem } from "../../utils/shouldDisplayTitleForPrimaryItem";
import { Menu } from "../menu";
import { getParentUri } from "../utils/getParentUri";
import "./SimsVisualisation.css";
import { MissingDocumentsErrorBloc } from "./MissingDocumentsErrorBloc";
import { SimsBlock } from "./SimsBlock";

// Mirror of ErrorCodes.SIMS_PUBLICATION_MISSING_DOCUMENTS on the back-end : a SIMS
// publication blocked because some referenced documents are missing from storage.
const SIMS_PUBLICATION_MISSING_DOCUMENTS = 862;
const EMPTY_SET = new Set();

const parseMissingDocuments = (details) => {
  try {
    return new Set(JSON.parse(details));
  } catch {
    return EMPTY_SET;
  }
};

export function SimsVisualisation({
  metadataStructure,
  codesLists,
  sims = {},
  organisations,
  publishSims,
  exportCallback,
  missingDocuments,
  owners = EMPTY_ARRAY,
}) {
  const [secondLang] = useSecondLang();

  const { t } = useTranslation();

  const [modalOpened, setModalOpened] = useState(false);

  const [exportModalOpened, setExportModalOpened] = useState(false);

  const [exportConfig, setExportConfig] = useState({
    emptyMas: true,
    lg1: true,
    lg2: true,
    document: true,
  });

  function MSDInformations({ msd, firstLevel = false }) {
    return (
      <>
        {firstLevel && shouldDisplayTitleForPrimaryItem(msd) && (
          <h3 className="col-md-12 sims-title">
            {msd.idMas} - {msd.masLabelBasedOnCurrentLang}
          </h3>
        )}
        <div className="sims-row" key={msd.idMas} id={msd.idMas}>
          {!msd.isPresentational && (
            <Panel
              title={
                <SimsFieldTitle
                  secondLang={false}
                  msd={msd}
                  currentSection={sims.rubrics[msd.idMas]}
                />
              }
            >
              <SimsBlock
                msd={msd}
                isSecondLang={false}
                currentSection={sims.rubrics[msd.idMas]}
                unbounded={msd.maxOccurs === "unbounded"}
                codesLists={codesLists}
                organisations={organisations}
              />
            </Panel>
          )}
          {!msd.isPresentational && hasLabelLg2(msd) && secondLang && (
            <Panel
              title={
                <SimsFieldTitle
                  secondLang={true}
                  msd={msd}
                  currentSection={sims.rubrics[msd.idMas]}
                />
              }
            >
              <SimsBlock
                msd={msd}
                isSecondLang={true}
                currentSection={sims.rubrics[msd.idMas]}
                unbounded={msd.maxOccurs === "unbounded"}
                codesLists={codesLists}
                organisations={organisations}
              />
            </Panel>
          )}
        </div>
        {Object.values(msd.children).map((child) => (
          <MSDInformations key={child.idMas} msd={child} />
        ))}
      </>
    );
  }

  const [serverSideError, setServerSideError] = useState();

  const [publishMissingDocuments, setPublishMissingDocuments] = useState(EMPTY_SET);

  const publish = useCallback(
    (object) => {
      setServerSideError(undefined);
      setPublishMissingDocuments(EMPTY_SET);
      publishSims(object, (err) => {
        if (err) {
          if (err.code === SIMS_PUBLICATION_MISSING_DOCUMENTS) {
            setPublishMissingDocuments(parseMissingDocuments(err.details));
            return;
          }
          const targetMatch = err.details?.match(/Indicator\/Series\/Operation:\s*(\S+)/);
          const targetId = targetMatch?.[1];
          const href = getParentUri(object);
          setServerSideError([t(`errors.${err.code}`, { id: targetId, href })]);
        }
      });
    },
    [publishSims, t],
  );

  /**
   * Handle the deletion of a SIMS.
   */
  const navigate = useNavigate();

  const handleNo = () => {
    setModalOpened(false);
  };

  const handleYes = () => {
    setServerSideError(undefined);
    OperationsApi.deleteSims(sims)
      .then(() => {
        setModalOpened(false);
        navigate(getParentUri(sims));
      })
      .catch((err) => {
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
      {exportModalOpened && (
        <Modal
          className="Modal__Bootstrap modal-dialog operations"
          isOpen={true}
          ariaHideApp={false}
        >
          <div className="modal-content">
            <div className="modal-header">
              <CloseIconButton onClick={() => setExportModalOpened(false)} />
              <h4 className="modal-title">{t("app.btnExport")}</h4>
            </div>
            <div className="modal-body export-modal-body">
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
            <div className="modal-footer text-right">
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
            </div>
          </div>
        </Modal>
      )}
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
        {Object.values(metadataStructure).map((msd) => {
          return <MSDInformations key={msd.idMas} msd={msd} firstLevel={true} />;
        })}
      </Row>
    </>
  );
}
