import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ActionToolbar } from "@components/action-toolbar";
import { ReturnButton, TreeButton, UpdateButton } from "@components/buttons/buttons-with-icons";
import { ValidationButton } from "@components/validationButton";

import { HasAccess } from "../../../../../auth/components/auth";
import { Classification } from "../../../../types";
import { useGoBack } from "../../../../../utils/hooks/useGoBack";

interface ClassificationControlsTypes {
  classification: Classification;
  publish: VoidFunction;
}

export const ClassificationControls = ({
  classification,
  publish,
}: Readonly<ClassificationControlsTypes>) => {
  const { t } = useTranslation();

  const goBack = useGoBack();

  const location = useLocation();

  const treeLocation = `${location.pathname}/tree`;

  const viewTreeLabel = t("classification.viewTree");

  return (
    <ActionToolbar>
      <ReturnButton action={() => goBack("/classifications")} />
      <HasAccess module="CLASSIFICATION_CLASSIFICATION" privilege="PUBLISH">
        <ValidationButton object={classification} callback={publish} />
      </HasAccess>
      <HasAccess module="CLASSIFICATION_CLASSIFICATION" privilege="UPDATE">
        <UpdateButton action={`/classifications/classification/${classification.id}/modify`} />
      </HasAccess>
      <TreeButton key={viewTreeLabel} action={treeLocation} label={viewTreeLabel} />
    </ActionToolbar>
  );
};
