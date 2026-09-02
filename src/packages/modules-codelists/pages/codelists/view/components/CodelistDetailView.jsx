import { useTranslation } from "react-i18next";

import {
  InseeOrganization,
  InseeOrganizations,
} from "@components/business/organizations/organizations";
import { ConfirmationDelete } from "@components/confirmation-delete";
import { CreationUpdateItems } from "@components/creation-update-items";
import { DisseminationStatusVisualization } from "@components/dissemination-status/disseminationStatus";
import { ErrorBloc } from "@components/errors-bloc";
import { Row } from "@components/layout";
import { Note } from "@components/note";
import { PublicationStatusItem } from "@components/status/PublicationStatusItem";

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
              <PublicationStatusItem
                label={t("codelists.validationStatus")}
                object={codelist}
                gender="female"
              />
              <li>
                {t("codelists.creator")} : <InseeOrganization creator={codelist.creator} />
              </li>
              <li>
                {t("codelists.contributors")} :{" "}
                <InseeOrganizations creators={codelist.contributor} />
              </li>
              <li>
                <DisseminationStatusVisualization
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
