import { ComponentProps } from "react";

import { ActionToolbar } from "@components/action-toolbar";
import {
  AbstractButton,
  PublishButton,
  ReturnButton,
  UpdateButton,
} from "@components/buttons/buttons-with-icons";

import { CollectionExportFormat } from "@model/concepts/collection";

import ExportButtons from "../../../components/CollectionExportButtons";
import { HasAccess } from "../../../../auth/components/auth";

interface MenuProps {
  isValidated: boolean;
  id: string;
  handleValidation: ComponentProps<typeof AbstractButton>["action"];
  exportCollection: (value: {
    ids: string[];
    type: CollectionExportFormat;
    withConcepts: boolean;
    lang: "lg1" | "lg2";
  }) => void;
}

export const Menu = ({
  isValidated,
  id,
  handleValidation,
  exportCollection,
}: Readonly<MenuProps>) => {
  return (
    <ActionToolbar>
      <ReturnButton action="/concepts/collections" />
      <ExportButtons
        exportHandler={(
          type: CollectionExportFormat,
          withConcepts: boolean,
          lang: "lg1" | "lg2" = "lg1",
        ) => exportCollection({ ids: [id], type, withConcepts, lang })}
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
