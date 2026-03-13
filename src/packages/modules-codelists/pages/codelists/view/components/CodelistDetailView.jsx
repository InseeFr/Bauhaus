import { useTranslation } from "react-i18next";

import { ConfirmationDelete } from "@components/confirmation-delete";
import { CreationUpdateItems } from "@components/creation-update-items";
import { DisseminationStatusVisualisation } from "@components/dissemination-status/disseminationStatus";
import { ErrorBloc } from "@components/errors-bloc";
import { Row } from "@components/layout";
import { Note } from "@components/note";
import { PublicationFemale } from "@components/status";
import {
  InseeOrganisation,
  InseeOrganisations,
} from "@components/business/organisations/organisations";

import { useTitle } from "@utils/hooks/useTitle";
import { renderMarkdownElement } from "@utils/html-utils";

import { CodesPanel } from "../../../../components/CodesPanel";
import { ViewMenu } from "../menu";
import "./CodelistDetailView.css";

export const CodelistDetailView = ({
  codelist,
  handleUpdate,
  handleBack,
  handleDelete,
  updatable,
  deletable,
  modalOpened,
  handleYes,
  handleNo,
  secondLang,
  col = 3,
  publishComponent,
  serverSideError,
  hidden = false,
}) => {
  const { t } = useTranslation();

  useTitle(t("codelists.pluralTitle"), codelist?.labelLg1);

  const descriptionLg1 = renderMarkdownElement(codelist.descriptionLg1);
  const descriptionLg2 = renderMarkdownElement(codelist.descriptionLg2);

  return (
    <>
      {modalOpened && (
        <ConfirmationDelete
          className="codelists"
          handleNo={handleNo}
          handleYes={handleYes}
          message={t("codelists.deletionConfirmationMessage")}
        />
      )}
      <ViewMenu
        handleUpdate={handleUpdate}
        col={col}
        handleDelete={handleDelete}
        handleBack={handleBack}
        updatable={updatable}
        publish={publishComponent}
        codelist={codelist}
        deletable={deletable}
      ></ViewMenu>
      <ErrorBloc error={serverSideError} />
      <Row>
        <Note
          text={
            <ul>
              <li>
                {t("codelists.identifier")}: {codelist.id}
              </li>
              <CreationUpdateItems creation={codelist.created} update={codelist.modified} />
              <li>
                {t("codelists.validationStatus")} : <PublicationFemale object={codelist} />
              </li>
              <li>
                {t("codelists.creator")} : <InseeOrganisation creator={codelist.creator} />
              </li>
              <li>
                {t("codelists.contributors")} :{" "}
                <InseeOrganisations creators={codelist.contributor} />
              </li>
              <li>
                <DisseminationStatusVisualisation
                  disseminationStatus={codelist.disseminationStatus}
                />
              </li>
            </ul>
          }
          title={t("codelists.globalInformation")}
          alone={true}
        />
      </Row>
      <Row>
        <Note
          text={descriptionLg1}
          title={t("codelists.description", { lng: "fr" })}
          alone={!secondLang}
          allowEmpty={true}
          md
        />
        {secondLang && (
          <Note
            text={descriptionLg2}
            title={t("codelists.description", { lng: "en" })}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>
      <CodesPanel codelist={codelist} hidden={hidden} editable={false} />
    </>
  );
};
