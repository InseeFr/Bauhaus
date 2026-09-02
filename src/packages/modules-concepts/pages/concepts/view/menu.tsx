import { useState } from "react";

import { ActionToolbar } from "@components/action-toolbar";
import {
  CompareButton,
  DeleteButton,
  ExportButton,
  PublishButton,
  ReturnButton,
  UpdateButton,
} from "@components/buttons/buttons-with-icons";
import { ConfirmationDelete } from "@components/confirmation-delete";
import type { ValidationState } from "@components/status";

import { ConceptGeneral } from "@model/concepts/concept";
import { VALIDATED } from "@model/ValidationState";

import { OPEN_DOCUMENT_TEXT_MIME_TYPE } from "@sdk/constants";
import { ConceptsApi } from "@sdk/index";

import { saveFileFromHttpResponse } from "@utils/files";
import { useGoBack } from "@utils/hooks/useGoBack";

import { HasAccess } from "../../../../auth/components/auth";
import { useLoading } from "./components/loading";

interface ConceptVisualizationControlsTypes {
  general: Pick<ConceptGeneral, "creator">;
  validationState: ValidationState;
  conceptVersion: number;
  id: string;
  onValidate: () => void;
  onDelete: () => void;
}

export const ConceptVisualizationControls = ({
  general,
  validationState,
  conceptVersion,
  id,
  onValidate,
  onDelete,
}: Readonly<ConceptVisualizationControlsTypes>) => {
  const { setLoading } = useLoading();

  const goBack = useGoBack();

  const [modalOpened, setModalOpened] = useState(false);

  const handleNo = () => setModalOpened(false);

  const handleYes = () => {
    onDelete();
    setModalOpened(false);
  };

  return (
    <>
      {modalOpened && (
        <ConfirmationDelete className="concepts" handleNo={handleNo} handleYes={handleYes} />
      )}
      <ActionToolbar>
        <ReturnButton action={() => goBack(`/concepts`)} />
        <HasAccess
          module="CONCEPT_CONCEPT"
          privilege="READ"
          complementaryCheck={conceptVersion > 1}
        >
          <CompareButton action={`/concepts/${id}/compare`} />
        </HasAccess>
        <ExportButton
          action={() => {
            setLoading("exporting");
            return ConceptsApi.getConceptExport(id, OPEN_DOCUMENT_TEXT_MIME_TYPE)
              .then(saveFileFromHttpResponse)
              .finally(() => setLoading(undefined));
          }}
        />
        <HasAccess module="CONCEPT_CONCEPT" privilege="UPDATE" stamps={[general.creator]}>
          <UpdateButton action={`/concepts/${id}/modify`} />
        </HasAccess>
        <HasAccess module="CONCEPT_CONCEPT" privilege="DELETE" stamps={[general.creator]}>
          <DeleteButton action={() => setModalOpened(true)} />
        </HasAccess>
        <HasAccess
          module="CONCEPT_CONCEPT"
          privilege="PUBLISH"
          complementaryCheck={validationState !== VALIDATED}
          stamps={[general.creator]}
        >
          <PublishButton action={onValidate} />
        </HasAccess>
      </ActionToolbar>
    </>
  );
};
