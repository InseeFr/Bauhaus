import { ComponentProps } from "react";

import { ActionToolbar } from "@components/action-toolbar";
import {
  AbstractButton,
  PublishButton,
  ReturnButton,
  UpdateButton,
} from "@components/buttons/buttons-with-icons";

import { HasAccess } from "../../../auth/components/auth";
import ExportButtons from "../export-buttons";

const CollectionVisualizationControls = ({
  isValidated,
  id,
  handleValidation,
  exportCollection,
}: Readonly<{
  isValidated: boolean;
  id: string;
  handleValidation: ComponentProps<typeof AbstractButton>["action"];
  exportCollection: (value: {
    ids: string[];
    type: string;
    withConcepts: boolean;
    lang: string;
  }) => void;
}>) => {
  return (
    <ActionToolbar>
      <ReturnButton action="/concepts/collections" />
      <ExportButtons
        exportHandler={(type, withConcepts, lang = "lg1") =>
          exportCollection({ ids: [id], type, withConcepts, lang })
        }
      />

      <HasAccess module="CONCEPT_COLLECTION" privilege="PUBLISH" complementaryCheck={!isValidated}>
        <PublishButton action={handleValidation} />
      </HasAccess>

      <HasAccess module="CONCEPT_COLLECTION" privilege="UPDATE">
        <UpdateButton action={`/concepts/collections/${id}/modify`} />
      </HasAccess>
    </ActionToolbar>
  );
};

export default CollectionVisualizationControls;
