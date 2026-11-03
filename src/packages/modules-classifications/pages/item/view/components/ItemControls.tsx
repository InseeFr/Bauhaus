import { useTranslation } from "react-i18next";

import { ActionToolbar } from "@components/action-toolbar";
import { Button } from "@components/buttons/button";
import { ReturnButton, UpdateButton } from "@components/buttons/buttons-with-icons";

import { useGoBack } from "@utils/hooks/useGoBack";

import { HasAccess } from "../../../../../auth/components/auth";
import { useClassification } from "../../../../hooks/useClassification";

interface ItemControls {
  classificationId: string;
  itemId: string;
  version?: number;
}

export const ItemControls = ({ classificationId, itemId, version }: Readonly<ItemControls>) => {
  const { t } = useTranslation();

  const goBack = useGoBack();

  // Un poste hérite des contributeurs de sa nomenclature.
  const { classification } = useClassification(classificationId);
  const contributors = [classification?.general?.contributor ?? []].flat();

  return (
    <ActionToolbar>
      <ReturnButton
        action={() => goBack(`/classifications/classification/${classificationId}/items`)}
      />
      <HasAccess
        module="CLASSIFICATION_CLASSIFICATION"
        privilege="READ"
        complementaryCheck={!!(version && version > 1)}
      >
        <Button
          action={`/classifications/classification/${classificationId}/item/${itemId}/compare`}
          label={t("item.compare")}
        />
      </HasAccess>
      <HasAccess module="CLASSIFICATION_CLASSIFICATION" privilege="UPDATE" stamps={contributors}>
        <UpdateButton
          action={`/classifications/classification/${classificationId}/item/${itemId}/modify`}
        />
      </HasAccess>
    </ActionToolbar>
  );
};
