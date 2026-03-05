import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ActionToolbar } from "@components/action-toolbar";
import { DeleteButton, ReturnButton, UpdateButton } from "@components/buttons/buttons-with-icons";
import { ConfirmationDelete } from "@components/confirmation-delete";
import { CreationUpdateItems } from "@components/creation-update-items";
import { DisseminationStatusVisualisation } from "@components/dissemination-status/disseminationStatus";
import { ErrorBloc } from "@components/errors-bloc";
import { Row } from "@components/layout";
import { Note } from "@components/note";
import { PublicationFemale } from "@components/status";
import { ValidationButton } from "@components/validationButton";

import { useTitle } from "@utils/hooks/useTitle";
import { renderMarkdownElement } from "@utils/html-utils";

import { HasAccess } from "../../../../../auth/components/auth";
import { CollapsiblePanel } from "../../../../components/CollapsiblePanel";
import { InseeOrganisationText } from "@components/business/creators-view";

export const PartialCodelistDetailView = ({
  codelist,
  handleUpdate,
  handleDelete,
  handleBack,
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

  useTitle(t("partial-codelists.title"), codelist?.labelLg1);

  const descriptionLg1 = renderMarkdownElement(codelist.descriptionLg1);
  const descriptionLg2 = renderMarkdownElement(codelist.descriptionLg2);

  const publish = () => {
    publishComponent();
  };

  return (
    <>
      {modalOpened && (
        <ConfirmationDelete
          className="codelists"
          handleNo={handleNo}
          handleYes={handleYes}
          message={t("partial-codelists.deletionConfirmationMessage")}
        />
      )}
      <ActionToolbar>
        <ReturnButton action={handleBack} col={col} />
        <HasAccess module="CODESLIST_PARTIALCODESLIST" privilege="PUBLISH">
          <ValidationButton callback={publish} object={codelist} />
        </HasAccess>
        {updatable && (
          <HasAccess module="CODESLIST_PARTIALCODESLIST" privilege="UPDATE">
            <UpdateButton action={handleUpdate} col={col} />
          </HasAccess>
        )}
        {deletable && (
          <HasAccess module="CODESLIST_PARTIALCODESLIST" privilege="DELETE">
            <DeleteButton action={handleDelete} col={col} />
          </HasAccess>
        )}
      </ActionToolbar>
      <ErrorBloc error={serverSideError} />
      <Row>
        <Note
          text={
            <ul>
              <li>
                {t("partial-codelists.identifier")} : {codelist.id}
              </li>
              <li>
                {t("partial-codelists.parentCodelist")} :{" "}
                <Link to={`/codelists/${codelist.parentCode}`}>{codelist.parentLabel}</Link>
              </li>
              <CreationUpdateItems creation={codelist.created} update={codelist.modified} />
              <li>
                {t("partial-codelists.validationStatus")} : <PublicationFemale object={codelist} />
              </li>
              <li>
                {t("partial-codelists.creator")} :{" "}
                <InseeOrganisationText organisations={codelist.creator} />
              </li>
              <li>
                {t("partial-codelists.contributors")} :{" "}
                <InseeOrganisationText organisations={codelist.contributor} />
              </li>
              <li>
                <DisseminationStatusVisualisation
                  disseminationStatus={codelist.disseminationStatus}
                />
              </li>
            </ul>
          }
          title={t("partial-codelists.globalInformation")}
          alone={true}
        />
      </Row>
      <Row>
        <Note
          text={descriptionLg1}
          title={t("partial-codelists.description", { lng: "fr" })}
          alone={!secondLang}
          allowEmpty={true}
          md
        />
        {secondLang && (
          <Note
            text={descriptionLg2}
            title={t("partial-codelists.description", { lng: "en" })}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>
      {codelist.codes && (
        <Row>
          <CollapsiblePanel id="code-array" hidden={hidden} title={t("partial-codelists.elements")}>
            <></>
          </CollapsiblePanel>
        </Row>
      )}
    </>
  );
};
