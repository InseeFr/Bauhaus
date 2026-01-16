import { ActionToolbar } from "@components/action-toolbar";
import { Button } from "@components/buttons/button";
import { ReturnButton, UpdateButton } from "@components/buttons/buttons-with-icons";

import { useGoBack } from "@utils/hooks/useGoBack";

import { HasAccess } from "../../auth/components/auth";
import D from "../../deprecated-locales";

interface ItemControls {
  classificationId: string;
  itemId: string;
  version?: number;
}
const ItemControls = ({ classificationId, itemId, version }: Readonly<ItemControls>) => {
  const goBack = useGoBack();

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
          label={D.btnCompare}
        />
      </HasAccess>

      <HasAccess module="CLASSIFICATION_CLASSIFICATION" privilege="UPDATE">
        <UpdateButton
          action={`/classifications/classification/${classificationId}/item/${itemId}/modify`}
        />
      </HasAccess>
    </ActionToolbar>
  );
};

export default ItemControls;
