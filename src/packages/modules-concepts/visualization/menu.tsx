import { useState } from "react";

import { ActionToolbar } from "@components/action-toolbar";
import { Button } from "@components/buttons/button";
import { ExportButton, ReturnButton, UpdateButton } from "@components/buttons/buttons-with-icons";
import { ConfirmationDelete } from "@components/confirmation-delete";

import { HasAccess } from "../../auth/components/auth";
import D from "../../deprecated-locales";
import { ConceptsApi } from "../../sdk";
import { saveFileFromHttpResponse } from "../../utils/files";
import { useGoBack } from "../../utils/hooks/useGoBack";
import { useLoading } from "./loading";
import { OPEN_DOCUMENT_TEXT_MIME_TYPE } from "../../sdk/constants";

interface ConceptVisualizationControlsTypes {
  general: any;
  isValidated: boolean;
  conceptVersion: number;
  id: string;
  onValidate: () => void;
  onDelete: () => void;
}

const ConceptVisualizationControls = ({
  general,
  isValidated,
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
          <Button action={`/concepts/${id}/compare`} label={D.btnCompare} />
        </HasAccess>
        <ExportButton
          action={() => {
            setLoading("exporting");
            return ConceptsApi.getConceptExport(id, OPEN_DOCUMENT_TEXT_MIME_TYPE)
              .then(saveFileFromHttpResponse)
              .finally(() => setLoading());
          }}
        />
        <HasAccess module="CONCEPT_CONCEPT" privilege="UPDATE" stamps={general.creator}>
          <UpdateButton action={`/concepts/${id}/modify`} />
        </HasAccess>

        <HasAccess module="CONCEPT_CONCEPT" privilege="DELETE" stamps={general.creator}>
          <Button action={() => setModalOpened(true)} label={D.btnDelete} />
        </HasAccess>

        <HasAccess
          module="CONCEPT_CONCEPT"
          privilege="PUBLISH"
          complementaryCheck={!isValidated}
          stamps={general.creator}
        >
          <Button action={onValidate} label={D.btnValid} />
        </HasAccess>
      </ActionToolbar>
    </>
  );
};

export default ConceptVisualizationControls;
