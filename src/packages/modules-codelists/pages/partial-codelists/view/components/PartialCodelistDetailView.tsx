import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ActionToolbar } from "@components/action-toolbar";
import { InseeOrganization } from "@components/business/organizations/organizations";
import { DeleteButton, ReturnButton, UpdateButton } from "@components/buttons/buttons-with-icons";
import { ConfirmationDelete } from "@components/confirmation-delete";
import { CreationUpdateItems } from "@components/creation-update-items";
import { DisseminationStatusVisualization } from "@components/dissemination-status/disseminationStatus";
import { ErrorBloc } from "@components/errors-bloc";
import { Row } from "@components/layout";
import { Note } from "@components/note";
import { ValidationState } from "@components/status";
import { PublicationStatusItem } from "@components/status/PublicationStatusItem";
import { ValidationButton } from "@components/validationButton";

import { useTitle } from "@utils/hooks/useTitle";
import { renderMarkdownElement } from "@utils/html-utils";

import { HasAccess } from "../../../../../auth/components/auth";
import { CollapsiblePanel } from "../../../../components/CollapsiblePanel";

/** Fiche complète d'une liste de codes partielle, telle que renvoyée par
 * l'API : plus riche que le modèle `Codelist` (dédié à l'écran des codes). */
interface PartialCodelistViewValues {
  id?: string;
  labelLg1?: string;
  labelLg2?: string;
  descriptionLg1?: string;
  descriptionLg2?: string;
  created?: string;
  modified?: string;
  validationState?: ValidationState;
  creator?: string | null;
  contributor?: string | string[] | null;
  disseminationStatus?: string;
  parentCode?: string;
  parentLabel?: string;
  codes?: Record<string, unknown>;
}

interface PartialCodelistDetailViewTypes {
  codelist: PartialCodelistViewValues;
  handleUpdate: string | VoidFunction;
  handleDelete: VoidFunction;
  handleBack: VoidFunction;
  updatable: boolean;
  deletable: boolean;
  modalOpened: boolean;
  handleYes: VoidFunction;
  handleNo: VoidFunction;
  secondLang: boolean;
  publishComponent: VoidFunction;
  serverSideError?: unknown;
  hidden?: boolean;
}

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
  publishComponent,
  serverSideError,
  hidden = false,
}: Readonly<PartialCodelistDetailViewTypes>) => {
  const { t } = useTranslation();

  useTitle(t("partial-codelists.title"), codelist?.labelLg1);

  const descriptionLg1 = renderMarkdownElement(codelist.descriptionLg1 ?? "");
  const descriptionLg2 = renderMarkdownElement(codelist.descriptionLg2 ?? "");

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
        <ReturnButton action={handleBack} />
        <HasAccess module="CODESLIST_PARTIALCODESLIST" privilege="PUBLISH">
          <ValidationButton callback={publish} object={codelist} />
        </HasAccess>
        {updatable && (
          <HasAccess module="CODESLIST_PARTIALCODESLIST" privilege="UPDATE">
            <UpdateButton action={handleUpdate} />
          </HasAccess>
        )}
        {deletable && (
          <HasAccess module="CODESLIST_PARTIALCODESLIST" privilege="DELETE">
            <DeleteButton action={handleDelete} />
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
              <PublicationStatusItem
                label={t("partial-codelists.validationStatus")}
                object={codelist}
                gender="female"
              />
              <li>
                {t("partial-codelists.creator")} :{" "}
                <InseeOrganization creator={codelist.creator ?? null} />
              </li>
              <li>
                {t("partial-codelists.contributors")} :{" "}
                <InseeOrganization creator={(codelist.contributor as string) ?? null} />
              </li>
              <li>
                <DisseminationStatusVisualization
                  disseminationStatus={codelist.disseminationStatus ?? ""}
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
