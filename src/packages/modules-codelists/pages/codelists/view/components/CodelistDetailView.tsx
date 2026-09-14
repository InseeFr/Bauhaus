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
import { ValidationState } from "@components/status";
import { PublicationStatusItem } from "@components/status/PublicationStatusItem";

import { useTitle } from "@utils/hooks/useTitle";
import { renderMarkdownElement } from "@utils/html-utils";

import { CodesPanel } from "../../../../components/CodesPanel";
import { ViewMenu } from "../menu";
import "./CodelistDetailView.css";

/** Fiche complète d'une liste de codes, telle que renvoyée par l'API "detailed" :
 * plus riche que le modèle `Codelist` (dédié à l'écran des codes). */
interface CodelistViewValues {
  id?: string;
  labelLg1?: string;
  labelLg2?: string;
  descriptionLg1?: string;
  descriptionLg2?: string;
  created?: string;
  modified?: string;
  validationState?: ValidationState;
  creator?: string | null;
  contributor?: string[];
  disseminationStatus?: string;
}

interface CodelistDetailViewTypes {
  codelist: CodelistViewValues;
  handleUpdate: string | VoidFunction;
  handleBack: VoidFunction;
  handleDelete: VoidFunction;
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
  publishComponent,
  serverSideError,
  hidden = false,
}: Readonly<CodelistDetailViewTypes>) => {
  const { t } = useTranslation();

  useTitle(t("codelists.pluralTitle"), codelist?.labelLg1);

  const descriptionLg1 = renderMarkdownElement(codelist.descriptionLg1 ?? "");
  const descriptionLg2 = renderMarkdownElement(codelist.descriptionLg2 ?? "");

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
                {t("codelists.creator")} : <InseeOrganization creator={codelist.creator ?? null} />
              </li>
              <li>
                {t("codelists.contributors")} :{" "}
                <InseeOrganizations creators={codelist.contributor ?? []} />
              </li>
              <li>
                <DisseminationStatusVisualization
                  disseminationStatus={codelist.disseminationStatus ?? ""}
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
      <CodesPanel codelist={codelist as any} hidden={hidden} editable={false} />
    </>
  );
};
